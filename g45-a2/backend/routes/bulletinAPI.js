const express = require("express");
const router = express.Router();

const Bulletin = require("../models/bulletinSchema");
const getTorontoDate = require("../utils/getDate");

// Helper: escape regex special chars for safe searching
function escapeRegex(str) {
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/********************************************************/
/********* Defining (CRUD) API CREATE routes ************/
/********************************************************/
// Create a new bulletin
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

        const created = await Bulletin.create({
            title: String(newBulletin.title).trim(),
            category: String(newBulletin.category).trim(),
            message: message ? String(message).trim() : "",
            author: String(newBulletin.author).trim(),
            date: getTorontoDate(),
        });

        return res.status(201).json(created);
    } catch (err) {
        console.error("Error creating bulletin:", err);
        return res
            .status(500)
            .json({ error: "Server error creating bulletin" });
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
        return res
            .status(500)
            .json({ error: "Server error fetching bulletins" });
    }
});

// Get one bulletin by _id
// TO DO: Currently not used, should be used for viewing a single bulletin in detail (frontend)
router.get("/id/:id", async (req, res) => {
    try {
        const idParam = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(idParam)) {
            return res.status(400).json({ error: "Invalid _id param" });
        }

        const bulletin = await Bulletin.findById(idParam);

        if (!bulletin) {
            return res.status(404).json({ error: "Bulletin not found" });
        }

        return res.status(200).json(bulletin);
    } catch (err) {
        console.error("Error fetching bulletin by _id:", err);
        return res
            .status(500)
            .json({ error: "Server error fetching bulletin" });
    }
});

// Search bulletins by author (case-insensitive exact match)
// TO DO: Currently not used, should do a search system (frontend)
router.get("/search", async (req, res) => {
    try {
        const searchTerm = req.query.q;

        if (!searchTerm || !searchTerm.trim()) {
            return res.status(400).json({
                error: "Search query parameter 'q' is required",
            });
        }

        const pattern = new RegExp(escapeRegex(searchTerm.trim()), "i");

        const bulletins = await Bulletin.find({
            $or: [
                { author: pattern },
                { title: pattern },
                { category: pattern },
            ],
        });

        if (bulletins.length === 0) {
            return res
                .status(404)
                .json({ error: "No matching bulletins found" });
        }

        return res.status(200).json(bulletins);
    } catch (err) {
        console.error("Error searching bulletins:", err);
        return res
            .status(500)
            .json({ error: "Server error searching bulletins" });
    }
});

/********************************************************/
/********* Defining (CRUD) API UPDATE routes ************/
/********************************************************/
// Update an existing bulletin using ID
router.patch("/id/:id", async (req, res) => {
    try {
        const idParam = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(idParam)) {
            return res.status(400).json({ error: "Invalid _id param" });
        }

        const allowedFields = ["title", "category", "message", "author"];
        const updateData = {};

        for (const field of allowedFields) {
            if (Object.prototype.hasOwnProperty.call(req.body, field)) {
                //Allows Empty Strings
                if (field === "message") {
                    updateData.message =
                        req.body.message === undefined ||
                        req.body.message === null
                            ? ""
                            : String(req.body.message).trim();
                } else {
                    updateData[field] = String(req.body[field]).trim();
                }
            }
        }

        // Do not allow empty update requests
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                error: "Provide at least one field to update: title, category, message, or author",
            });
        }

        // Always update date when bulletin is edited
        updateData.date = getTorontoDate();

        const updated = await Bulletin.findByIdAndUpdate(
            idParam,
            { $set: updateData },
            { new: true, runValidators: true },
        );

        if (!updated) {
            return res.status(404).json({ error: "Bulletin not found" });
        }

        return res.status(200).json(updated);
    } catch (err) {
        console.error("Error updating bulletin:", err);
        return res
            .status(500)
            .json({ error: "Server error updating bulletin" });
    }
});

/********************************************************/
/********* Defining (CRUD) API DELETE routes ************/
/********************************************************/
// Delete a bulletin by ID

router.delete("/id/:id", async (req, res) => {
    try {
        const idParam = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(idParam)) {
            return res.status(400).json({ error: "Invalid _id param" });
        }

        const deleted = await Bulletin.findByIdAndDelete(idParam);

        if (!deleted) {
            return res.status(404).json({ error: "Bulletin not found" });
        }

        return res.status(204).send();
    } catch (err) {
        console.error("Error deleting bulletin:", err);
        return res
            .status(500)
            .json({ error: "Server error deleting bulletin" });
    }
});

module.exports = router;
