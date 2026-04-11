const mongoose = require("mongoose");

const ChatMessageSchema = new mongoose.Schema({
  room: {
    type: String,
    required: true,
    default: "announcements-room",
    index: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  senderName: {
    type: String,
    required: true,
    trim: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  senderRole: {
    type: String,
    enum: ["user", "admin"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ChatMessage", ChatMessageSchema);