import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { connectChatSocket } from "../../utils/chatSocket";
import API_BASE_URL from "../../config";
import formatDateToToronto from "../../utils/formatDate";

export default function BulletinChatRoom({ bulletinId }) {
  const { user, token, authFetch } = useAuth();

  const socketRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roomClosed, setRoomClosed] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (socketRef.current && bulletinId) {
        socketRef.current.emit("leave-bulletin-room", { bulletinId });
        socketRef.current.off("bulletin-message");
        socketRef.current.off("bulletin-room-closed");
      }
    };
  }, [bulletinId]);

  async function handleJoin() {
    if (!token) {
      setError("You must be logged in to join this chatroom.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const historyRes = await authFetch(
        `${API_BASE_URL}/api/chat/bulletins/${bulletinId}/messages`
      );

      if (!historyRes.ok) {
        const data = await historyRes.json().catch(() => ({}));
        throw new Error(data.error || "Failed to load chat history");
      }

      const history = await historyRes.json();
      setMessages(history);

      const socket = connectChatSocket(token);
      socketRef.current = socket;

      const onBulletinMessage = (message) => {
        if (message.room === `bulletin-${bulletinId}`) {
          setMessages((prev) => [...prev, message]);
        }
      };

      const onRoomClosed = (payload) => {
        if (String(payload?.bulletinId) === String(bulletinId)) {
          setRoomClosed(true);
          setJoined(false);
          setError(payload?.message || "This chatroom has been closed.");
        }
      };

      socket.off("bulletin-message", onBulletinMessage);
      socket.off("bulletin-room-closed", onRoomClosed);

      socket.on("bulletin-message", onBulletinMessage);
      socket.on("bulletin-room-closed", onRoomClosed);

      socket.emit("join-bulletin-room", { bulletinId }, (response) => {
        if (!response?.ok) {
          setError(response?.error || "Failed to join room");
          return;
        }

        setJoined(true);
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to join chatroom");
    } finally {
      setLoading(false);
    }
  }

  function handleLeave() {
    if (!socketRef.current) return;

    socketRef.current.emit("leave-bulletin-room", { bulletinId });
    setJoined(false);
  }

  function handleSend(e) {
    e.preventDefault();

    if (!socketRef.current || !joined || roomClosed) return;

    const trimmed = input.trim();
    if (!trimmed) return;

    setError("");

    socketRef.current.emit(
      "send-bulletin-message",
      {
        bulletinId,
        text: trimmed,
      },
      (response) => {
        if (!response?.ok) {
          setError(response?.error || "Failed to send message");
          return;
        }

        setInput("");
      }
    );
  }

  if (!user) {
    return (
      <section className="mt-8 rounded-xl border border-violet-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-violet-900">
          Bulletin Chatroom
        </h2>
        <p className="mt-2 text-sm text-gray-700">
          Log in to join this bulletin chatroom and send messages.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-8 rounded-xl border border-violet-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-violet-900">
            Bulletin Chatroom
          </h2>
          <p className="text-sm text-gray-600">
            Join this room to chat with other users about this bulletin.
          </p>
        </div>

        {!joined ? (
          <button
            type="button"
            onClick={handleJoin}
            disabled={loading || roomClosed}
            className="rounded-lg bg-violet-700 px-4 py-2 text-white hover:bg-violet-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {roomClosed ? "Chatroom Closed" : loading ? "Joining..." : "Join Chatroom"}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleLeave}
            className="rounded-lg border border-violet-700 px-4 py-2 text-violet-700 hover:bg-violet-50"
          >
            Leave Chatroom
          </button>
        )}
      </div>

      {error ? (
        <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-4 h-80 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-3">
        {messages.length === 0 ? (
          <p className="text-sm text-gray-500">
            No messages yet. Be the first one to chat after joining.
          </p>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className="rounded-lg bg-white p-3 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium text-violet-800">
                    {msg.senderName}
                    {msg.senderRole === "admin" ? " (admin)" : ""}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDateToToronto(msg.createdAt)}
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-800 whitespace-pre-wrap">
                  {msg.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!joined || roomClosed}
          placeholder={
            joined
              ? "Type your message..."
              : "Join the chatroom to send messages"
          }
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-violet-500 disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={!joined || roomClosed || !input.trim()}
          className="rounded-lg bg-violet-700 px-4 py-2 text-white hover:bg-violet-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          Send
        </button>
      </form>
    </section>
  );
}