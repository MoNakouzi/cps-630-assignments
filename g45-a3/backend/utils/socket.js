const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Bulletin = require("../models/Bulletin");
const User = require("../models/User");
const ChatMessage = require("../models/ChatMessage");

const ANNOUNCEMENTS_ROOM = "announcements-room";

let ioInstance = null;

function getBulletinRoomName(bulletinId) {
  return `bulletin-${bulletinId}`;
}

async function findAccessibleBulletin(user, bulletinId) {
  const bulletin = await Bulletin.findById(bulletinId);

  if (!bulletin || bulletin.isDeleted) {
    return null;
  }

  if (
    bulletin.visibility === "private" &&
    !(
      user &&
      (user.role === "admin" || String(bulletin.author) === String(user.id))
    )
  ) {
    return null;
  }

  return bulletin;
}

function safeAck(ack, payload) {
  if (typeof ack === "function") {
    ack(payload);
  }
}

function initSocket(server) {
  ioInstance = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  ioInstance.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Authentication required"));
      }

      const payload = jwt.verify(token, process.env.JWT_SECRET);

      socket.user = {
        id: String(payload.id),
        role: payload.role || "user",
      };

      next();
    } catch (error) {
      next(new Error("Invalid token"));
    }
  });

  ioInstance.on("connection", (socket) => {
    socket.join(ANNOUNCEMENTS_ROOM);

    socket.emit("joined-room", {
      room: ANNOUNCEMENTS_ROOM,
      message: "Connected to Announcements Room",
    });

    socket.on("join-bulletin-room", async ({ bulletinId }, ack) => {
      try {
        if (!bulletinId) {
          return safeAck(ack, { ok: false, error: "bulletinId is required" });
        }

        const bulletin = await findAccessibleBulletin(socket.user, bulletinId);

        if (!bulletin) {
          return safeAck(ack, {
            ok: false,
            error: "Bulletin not found or not accessible",
          });
        }

        const room = getBulletinRoomName(bulletinId);
        socket.join(room);

        safeAck(ack, { ok: true, room });
      } catch (error) {
        console.error("join-bulletin-room error:", error);
        safeAck(ack, { ok: false, error: "Server error joining room" });
      }
    });

    socket.on("leave-bulletin-room", ({ bulletinId }, ack) => {
      try {
        if (!bulletinId) {
          return safeAck(ack, { ok: false, error: "bulletinId is required" });
        }

        const room = getBulletinRoomName(bulletinId);
        socket.leave(room);

        safeAck(ack, { ok: true, room });
      } catch (error) {
        console.error("leave-bulletin-room error:", error);
        safeAck(ack, { ok: false, error: "Server error leaving room" });
      }
    });

    socket.on("send-bulletin-message", async ({ bulletinId, text }, ack) => {
      try {
        const trimmedText = String(text || "").trim();

        if (!bulletinId) {
          return safeAck(ack, { ok: false, error: "bulletinId is required" });
        }

        if (!trimmedText) {
          return safeAck(ack, { ok: false, error: "Message text is required" });
        }

        const bulletin = await findAccessibleBulletin(socket.user, bulletinId);

        if (!bulletin) {
          return safeAck(ack, {
            ok: false,
            error: "Bulletin no longer exists or is not accessible",
          });
        }

        const room = getBulletinRoomName(bulletinId);

        if (!socket.rooms.has(room)) {
          return safeAck(ack, {
            ok: false,
            error: "You must join the bulletin room before sending messages",
          });
        }

        const sender = await User.findById(socket.user.id);

        if (!sender) {
          return safeAck(ack, { ok: false, error: "Sender not found" });
        }

        const newMessage = await ChatMessage.create({
          room,
          text: trimmedText,
          senderName: sender.name,
          senderId: sender._id,
          senderRole: sender.role,
        });

        ioInstance.to(room).emit("bulletin-message", newMessage);

        safeAck(ack, { ok: true, message: newMessage });
      } catch (error) {
        console.error("send-bulletin-message error:", error);
        safeAck(ack, { ok: false, error: "Server error sending message" });
      }
    });
  });

  return ioInstance;
}

function getIO() {
  if (!ioInstance) {
    throw new Error("Socket.io has not been initialized yet");
  }

  return ioInstance;
}

function broadcastToAnnouncementsRoom(eventName, payload) {
  getIO().to(ANNOUNCEMENTS_ROOM).emit(eventName, payload);
}

function broadcastToRoom(room, eventName, payload) {
  getIO().to(room).emit(eventName, payload);
}

module.exports = {
  initSocket,
  getIO,
  broadcastToAnnouncementsRoom,
  broadcastToRoom,
  getBulletinRoomName,
  ANNOUNCEMENTS_ROOM,
};