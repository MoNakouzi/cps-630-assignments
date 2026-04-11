const express = require("express");
const router = express.Router();

const ChatMessage = require("../models/ChatMessage");
const User = require("../models/User");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const {
  broadcastToAnnouncementsRoom,
  ANNOUNCEMENTS_ROOM,
} = require("../utils/socket");

// Get recent announcements
router.get("/announcements", requireAuth, async (req, res) => {
  try {
    const messages = await ChatMessage.find({ room: ANNOUNCEMENTS_ROOM })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json(messages.reverse());
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return res.status(500).json({ error: "Server error fetching announcements" });
  }
});

// Post a new announcement
// Admin only
router.post("/announcements", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !String(text).trim()) {
      return res.status(400).json({ error: "Announcement text is required" });
    }

    const sender = await User.findById(req.user.id);

    if (!sender) {
      return res.status(404).json({ error: "Sender not found" });
    }

    const newMessage = await ChatMessage.create({
      room: ANNOUNCEMENTS_ROOM,
      text: String(text).trim(),
      senderName: sender.name,
      senderId: sender._id,
      senderRole: sender.role,
    });

    broadcastToAnnouncementsRoom("announcement-message", newMessage);

    return res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error creating announcement:", error);
    return res.status(500).json({ error: "Server error creating announcement" });
  }
});

module.exports = router;