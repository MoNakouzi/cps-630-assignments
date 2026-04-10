const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Category = require("../models/Category");
const Bulletin = require("../models/Bulletin");

const { requireAdmin } = require("../middleware/auth");

/********************************************************/
/********* Defining (CRUD) API CREATE routes ************/
/********************************************************/
// Create a new category (admin only for now)
router.post("/", requireAdmin, async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !String(name).trim()) {
            return res.status(400).json({ error: "Category name required" });
        }

        // Generate slug from name (e.g., "Events" -> "events")
        const slug = String(name)
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");

        // Ensure uniqueness by slug
        const existing = await Category.findOne({ slug });
        if (existing) {
            return res.status(409).json({ error: "Category already exists" });
        }

        // Create and return the new category
        const cat = await Category.create({
            name: String(name).trim(),
            slug,
            description,
        });
        return res.status(201).json(cat);
    } catch (err) {
        console.error("Error creating category:", err);
        return res
            .status(500)
            .json({ error: "Server error creating category" });
    }
});

/******************************************************/
/********* Defining (CRUD) API READ routes ************/
/******************************************************/
// Return all categories (name, slug, description) sorted by name
router.get("/", async (req, res) => {
    try {
        const cats = await Category.find(
            {},
            { name: 1, slug: 1, description: 1 },
        ).sort({ name: 1 });

        return res.status(200).json(cats);
    } catch (err) {
        console.error("Error fetching categories:", err);
        return res
            .status(500)
            .json({ error: "Server error fetching categories" });
    }
});

/********************************************************/
/********* Defining (CRUD) API UPDATE routes ************/
/********************************************************/
// Update category name/description (admin only)
router.patch("/:id", requireAdmin, async (req, res) => {
    try {
        const idParam = req.params.id;

        // Validate that the id parameter is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(idParam)) {
            return res.status(400).json({ error: "Invalid category id" });
        }

        const { name, description } = req.body;
        const update = {};

        if (name && String(name).trim()) {
            update.name = String(name).trim();
            // Auto-generate slug from name if name is being updated
            update.slug = update.name
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");

            // Check if the new slug would conflict with an existing category (excluding current category)
            const existing = await Category.findOne({
                slug: update.slug,
                _id: { $ne: idParam },
            });
            if (existing) {
                return res.status(409).json({
                    error: "Another category with the same slug already exists",
                });
            }
        }

        // Only update description if it's provided (allow empty string since it's not required)
        if (description !== undefined) update.description = description;

        // If no valid fields to update, return an error
        if (Object.keys(update).length === 0) {
            return res
                .status(400)
                .json({ error: "Provide name or description to update" });
        }

        // Find the category by ID and update it with the new values
        const updated = await Category.findByIdAndUpdate(
            idParam,
            { $set: update },
            { new: true, runValidators: true },
        );

        // If no category was found with the given ID, return a 404 error
        if (!updated) {
            return res.status(404).json({ error: "Category not found" });
        }

        return res.status(200).json(updated);
    } catch (err) {
        console.error("Error updating category:", err);
        return res
            .status(500)
            .json({ error: "Server error updating category" });
    }
});

/********************************************************/
/********* Defining (CRUD) API DELETE routes ************/
/********************************************************/
// Delete category if no bulletins reference it (admin only)
router.delete("/:id", requireAdmin, async (req, res) => {
    try {
        const idParam = req.params.id;

        // Validate that the id parameter is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(idParam)) {
            return res.status(400).json({ error: "Invalid category id" });
        }

        // Check if any bulletins reference this category
        const referencing = await Bulletin.countDocuments({
            category: idParam,
        });
        if (referencing > 0) {
            return res.status(400).json({
                error: "Category in use by bulletins. Remove or reassign bulletins first.",
            });
        }

        // If no references, delete the category
        const deleted = await Category.findByIdAndDelete(idParam);
        if (!deleted) {
            return res.status(404).json({ error: "Category not found" });
        }

        return res.status(204).send();
    } catch (err) {
        console.error("Error deleting category:", err);
        return res
            .status(500)
            .json({ error: "Server error deleting category" });
    }
});

module.exports = router;
