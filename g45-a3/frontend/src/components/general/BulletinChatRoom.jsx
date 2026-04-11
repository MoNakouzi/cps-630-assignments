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
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [roomClosed, setRoomClosed] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const joinedStorageKey = user
    ? `bulletin-room-joined-${user.id || user._id}-${bulletinId}`
    : null;

  async function loadMessages() {
    try {
      setMessagesLoading(true);
      setError("");

      const res = await authFetch(
        `${API_BASE_URL}/api/chat/bulletins/${bulletinId}/messages`
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to load chat history");
      }

      const history = await res.json();
      setMessages(history);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load chat history");
    } finally {
      setMessagesLoading(false);
    }
  }

  function attachSocketListeners(socket) {
    const onBulletinMessage = (message) => {
      if (message.room === `bulletin-${bulletinId}`) {
        setMessages((prev) => {
          const alreadyExists = prev.some((m) => m._id === message._id);
          if (alreadyExists) return prev;
          return [...prev, message];
        });
      }
    };

    const onRoomClosed = (payload) => {
      if (String(payload?.bulletinId) === String(bulletinId)) {
        setRoomClosed(true);
        setJoined(false);
        setError(payload?.message || "This chatroom has been closed.");

        if (joinedStorageKey) {
          localStorage.removeItem(joinedStorageKey);
        }
      }
    };

    socket.off("bulletin-message");
    socket.off("bulletin-room-closed");

    socket.on("bulletin-message", onBulletinMessage);
    socket.on("bulletin-room-closed", onRoomClosed);
  }

  async function joinRoom(showLoading = true) {
    if (!token) {
      setError("You must be logged in to join this chatroom.");
      return;
    }

    if (showLoading) {
      setLoading(true);
    }

    setError("");

    try {
      const socket = connectChatSocket(token);
      socketRef.current = socket;

      attachSocketListeners(socket);

      socket.emit("join-bulletin-room", { bulletinId }, (response) => {
        if (!response?.ok) {
          setError(response?.error || "Failed to join room");
          return;
        }

        setJoined(true);

        if (joinedStorageKey) {
          localStorage.setItem(joinedStorageKey, "true");
        }
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to join chatroom");
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    if (!user || !token) return;
    loadMessages();
  }, [bulletinId, user, token]);

  useEffect(() => {
    if (!user || !token) return;

    const wasJoined = joinedStorageKey
      ? localStorage.getItem(joinedStorageKey) === "true"
      : false;

    if (wasJoined) {
      joinRoom(false);
    }
  }, [bulletinId, user, token]);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.off("bulletin-message");
        socketRef.current.off("bulletin-room-closed");
      }
    };
  }, [bulletinId]);

  function handleJoin() {
    joinRoom(true);
  }

  function handleLeave() {
    if (socketRef.current) {
      socketRef.current.emit("leave-bulletin-room", { bulletinId });
    }

    setJoined(false);

    if (joinedStorageKey) {
      localStorage.removeItem(joinedStorageKey);
    }
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
          Log in to view and join this bulletin chatroom.
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
            You can always read messages. Join the room to send messages.
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
        {messagesLoading ? (
          <p className="text-sm text-gray-500">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-gray-500">
            No messages yet. Join the chatroom to send the first message.
          </p>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className="rounded-lg border border-gray-100 bg-white p-3 shadow-sm"
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
                <p className="mt-1 whitespace-pre-wrap text-sm text-gray-800">
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