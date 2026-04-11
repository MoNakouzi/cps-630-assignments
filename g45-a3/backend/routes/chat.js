const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const ChatMessage = require("../models/ChatMessage");
const User = require("../models/User");
const Bulletin = require("../models/Bulletin");

const { requireAuth, requireAdmin } = require("../middleware/auth");
const {
  broadcastToAnnouncementsRoom,
  ANNOUNCEMENTS_ROOM,
  getBulletinRoomName,
} = require("../utils/socket");

async function findAccessibleBulletin(user, bulletinId) {
  if (!mongoose.Types.ObjectId.isValid(bulletinId)) {
    return null;
  }

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

router.get("/bulletins/:bulletinId/messages", requireAuth, async (req, res) => {
  try {
    const { bulletinId } = req.params;

    const bulletin = await findAccessibleBulletin(req.user, bulletinId);

    if (!bulletin) {
      return res.status(404).json({
        error: "Bulletin not found, deleted, or not accessible",
      });
    }

    const room = getBulletinRoomName(bulletinId);

    const messages = await ChatMessage.find({ room })
      .sort({ createdAt: -1 })
      .limit(100);

    return res.status(200).json(messages.reverse());
  } catch (error) {
    console.error("Error fetching bulletin chat messages:", error);
    return res
      .status(500)
      .json({ error: "Server error fetching bulletin chat messages" });
  }
});

module.exports = router;