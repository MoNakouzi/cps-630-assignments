const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
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
            message: newBulletin.message
                ? String(newBulletin.message).trim()
                : "",
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
// Get bulletins with optional filtering by category and/or search term (in title, category, or author)
router.get("/", async (req, res) => {
    try {
        const selectedCategory = req.query.category;
        const searchTerm = req.query.q;
        const field = req.query.field;

        let query = {};

        if (
            selectedCategory &&
            selectedCategory.trim().toLowerCase() !== "all"
        ) {
            query.category = selectedCategory.trim();
        }

        if (searchTerm && searchTerm.trim()) {
            const trimmedField = field ? field.trim().toLowerCase() : "any";
            const allowedFields = ["title", "category", "author", "any"];

            if (!allowedFields.includes(trimmedField)) {
                return res.status(400).json({
                    error: "Search field must be one of: title, category, author, any",
                });
            }

            const pattern = new RegExp(escapeRegex(searchTerm.trim()), "i");

            if (trimmedField === "title") {
                query.title = pattern;
            } else if (trimmedField === "category") {
                query.category = pattern;
            } else if (trimmedField === "author") {
                query.author = pattern;
            } else if (trimmedField === "any") {
                query.$or = [
                    { author: pattern },
                    { title: pattern },
                    { category: pattern },
                ];
            }

            if (
                selectedCategory &&
                selectedCategory.trim().toLowerCase() !== "all" &&
                trimmedField === "category"
            ) {
                query = {
                    $and: [
                        { category: selectedCategory.trim() },
                        { category: pattern },
                    ],
                };
            }

            if (
                selectedCategory &&
                selectedCategory.trim().toLowerCase() !== "all" &&
                trimmedField === "any"
            ) {
                query = {
                    $and: [
                        { category: selectedCategory.trim() },
                        {
                            $or: [
                                { author: pattern },
                                { title: pattern },
                                { category: pattern },
                            ],
                        },
                    ],
                };
            }
        }

        const bulletins = await Bulletin.find(query);
        return res.status(200).json(bulletins);
    } catch (err) {
        console.error("Error fetching bulletins:", err);
        return res
            .status(500)
            .json({ error: "Server error fetching bulletins" });
    }
});

// Gets all unique categories
router.get("/categories", async (req, res) => {
    try {
        const categories = await Bulletin.distinct("category");
        return res.status(200).json(categories);
    } catch (err) {
        console.error("Error fetching categories:", err);
        return res
            .status(500)
            .json({ error: "Server error fetching categories" });
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
