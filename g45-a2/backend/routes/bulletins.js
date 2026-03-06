const express = require("express");
const router = express.Router();

const Bulletin = require("../models/bulletin");

// Helper: escape regex special chars for safe searching
function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/********************************************************/
/********* Defining (CRUD) API CREATE routes ************/
/********************************************************/
// Create a new bulletin
// TO DO: Fix ID generation to be more robust against deletions and concurrent creates
router.post("/", async (req, res) => {
  try {
    const newBulletin = req.body;

    if (
      !newBulletin ||
      !newBulletin.title ||
      !newBulletin.category ||
      !newBulletin.author
    ) {
      return res.status(400).json({ error: "Invalid bulletin data" });
    }

    // Get highest id, then + 1
    const last = await Bulletin.findOne({}, { id: 1 }).sort({ id: -1 }).lean();
    const nextId = (last?.id ?? 0) + 1;

    // Current date in YYYY-MM-DD format
    const today = new Date().toISOString().slice(0, 10);

    const created = await Bulletin.create({
      id: nextId,
      title: String(newBulletin.title).trim(),
      category: String(newBulletin.category).trim(),
      message: String(newBulletin.message || "").trim(),
      author: String(newBulletin.author).trim(),
      date: today,
    });

    return res.status(201).json(created);
  } catch (err) {
    console.error("Error creating bulletin:", err);
    return res.status(500).json({ error: "Server error creating bulletin" });
  }
});

/******************************************************/
/********* Defining (CRUD) API READ routes ************/
/******************************************************/
// Get all bulletins (HomePage)
router.get("/", async (req, res) => {
  try {
    const bulletins = await Bulletin.find({});
    return res.status(200).json(bulletins);
  } catch (err) {
    console.error("Error fetching bulletins:", err);
    return res.status(500).json({ error: "Server error fetching bulletins" });
  }
});

// Get one bulletin by ID
// TO DO: Currently not used, should be used for viewing a single bulletin in detail (frontend)
router.get("/id/:id", async (req, res) => {
  try {
    const idParam = Number(req.params.id);

    if (!Number.isFinite(idParam)) {
      return res.status(400).json({ error: "Invalid id param" });
    }

    const bulletin = await Bulletin.findOne({ id: idParam });

    if (!bulletin) {
      return res.status(404).json({ error: "Bulletin not found" });
    }

    return res.status(200).json(bulletin);
  } catch (err) {
    console.error("Error fetching bulletin by ID:", err);
    return res.status(500).json({ error: "Server error fetching bulletin" });
  }
});

// Search bulletins by author (case-insensitive exact match)
// TO DO: Currently not used, should do a search system (frontend)
// TO DO: Allow partial matches instead of exact matches
// TO DO: Allow search by title/category
router.get("/search", async (req, res) => {
  try {
    const bulletinAuthor = req.query.author;

    if (!bulletinAuthor) {
      return res
        .status(400)
        .json({ error: "Author query parameter is required" });
    }

    const pattern = new RegExp(`^${escapeRegex(bulletinAuthor)}$`, "i");
    const bulletins = await Bulletin.find({ author: pattern });

    if (bulletins.length === 0) {
      return res.status(404).json({ error: "Bulletin not found" });
    }

    return res.status(200).json(bulletins);
  } catch (err) {
    console.error("Error searching bulletins by author:", err);
    return res.status(500).json({ error: "Server error searching bulletins" });
  }
});

/********************************************************/
/********* Defining (CRUD) API UPDATE routes ************/
/********************************************************/
// Update an existing bulletin using ID
// TO DO: Currently fails with empty message, but message is not required in Model
// TO DO: Should allow editing of any field, not just message
router.patch("/id/:id", async (req, res) => {
  try {
    const idParam = Number(req.params.id);
    const { message } = req.body;

    if (!Number.isFinite(idParam)) {
      return res.status(400).json({ error: "Invalid id param" });
    }
    if (message === undefined) {
      return res.status(400).json({ error: "Missing message in request body" });
    }

    const updated = await Bulletin.findOneAndUpdate(
      { id: idParam },
      { $set: { message: String(message).trim() } },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return res.status(404).json({ error: "Bulletin not found" });
    }

    return res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating bulletin:", err);
    return res.status(500).json({ error: "Server error updating bulletin" });
  }
});

/********************************************************/
/********* Defining (CRUD) API DELETE routes ************/
/********************************************************/
// Delete a bulletin by ID
router.delete("/id/:id", async (req, res) => {
  try {
    const idParam = Number(req.params.id);

    if (!Number.isFinite(idParam)) {
      return res.status(400).json({ error: "Invalid id param" });
    }

    const deleted = await Bulletin.findOneAndDelete({ id: idParam });

    if (!deleted) {
      return res.status(404).json({ error: "Bulletin not found" });
    }

    return res.status(204).send();
  } catch (err) {
    console.error("Error deleting bulletin:", err);
    return res.status(500).json({ error: "Server error deleting bulletin" });
  }
});

module.exports = router;
