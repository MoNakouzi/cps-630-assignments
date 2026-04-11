const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const ANNOUNCEMENTS_ROOM = "announcements-room";

let ioInstance = null;

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

    // Users do not send messages through socket events.
    // The server will broadcast announcements after admin posts through REST.
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

module.exports = {
  initSocket,
  getIO,
  broadcastToAnnouncementsRoom,
  ANNOUNCEMENTS_ROOM,
};