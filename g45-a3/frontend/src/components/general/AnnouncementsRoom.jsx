import { useEffect, useState } from "react";
import API_BASE_URL from "../../config";
import { useAuth } from "../../context/AuthContext";
import {
  connectChatSocket,
  disconnectChatSocket,
} from "../../utils/chatSocket";

export default function AnnouncementsRoom() {
  const { token, user, authFetch } = useAuth();
  const [messages, setMessages] = useState([]);
  const [adminText, setAdminText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    async function loadAnnouncements() {
      try {
        setLoading(true);
        setError("");

        const res = await authFetch(`${API_BASE_URL}/api/chat/announcements`);

        if (!res.ok) {
          throw new Error("Failed to load announcements");
        }

        const data = await res.json();
        setMessages(data);
      } catch (err) {
        setError(err.message || "Could not load announcements");
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      loadAnnouncements();
    }
  }, [token, authFetch]);

  useEffect(() => {
    if (!token) return;

    const socket = connectChatSocket(token);

    if (!socket) return;

    const handleIncomingAnnouncement = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("announcement-message", handleIncomingAnnouncement);

    return () => {
      socket.off("announcement-message", handleIncomingAnnouncement);
      disconnectChatSocket();
    };
  }, [token]);

  async function handleAdminSend(e) {
    e.preventDefault();

    if (!adminText.trim()) return;

    try {
      setError("");

      const res = await authFetch(`${API_BASE_URL}/api/chat/announcements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: adminText,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to send announcement");
      }

      setAdminText("");
    } catch (err) {
      setError(err.message || "Failed to send announcement");
    }
  }

  if (!token) {
    return null;
  }

  return (
    <section className="max-w-4xl mx-auto mt-8 rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-semibold">Announcements Room</h2>
        <p className="text-sm text-gray-600">
          All logged in users are connected automatically. Regular users can only
          receive announcements.
        </p>
      </div>

      <div className="h-96 overflow-y-auto px-6 py-4 space-y-3 bg-gray-50">
        {loading ? (
          <p className="text-sm text-gray-500">Loading announcements...</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-gray-500">No announcements yet.</p>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className="rounded-lg border border-gray-200 bg-white px-4 py-3"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-gray-900">
                  {message.senderName}
                  {message.senderRole === "admin" ? " (Admin)" : ""}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(message.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-700">{message.text}</p>
            </div>
          ))
        )}
      </div>

      {error && (
        <div className="px-6 pt-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="border-t border-gray-200 px-6 py-4">
        {isAdmin ? (
          <form onSubmit={handleAdminSend} className="space-y-3">
            <textarea
              value={adminText}
              onChange={(e) => setAdminText(e.target.value)}
              placeholder="Send an announcement to everyone in the Announcements Room..."
              className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-black"
              rows={3}
            />
            <button
              type="submit"
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Send Announcement
            </button>
          </form>
        ) : (
          <div className="rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-600">
            This room is read-only for regular users.
          </div>
        )}
      </div>
    </section>
  );
}