const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Bulletin = require("../models/Bulletin");
const Category = require("../models/Category");
const User = require("../models/User");

const escapeRegex = require("../utils/escapeRegex");
const { requireAuth, requireAdmin } = require("../middleware/auth");

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

        // Resolve category to objectId based on objectId, slug or name
        let categoryId = null;
        const catVal = String(newBulletin.category).trim();

        // First try to find category by ID, then fallback to slug or name
        if (mongoose.Types.ObjectId.isValid(catVal)) {
            categoryId = catVal;
        } else {
            const cat = await Category.findOne({
                $or: [{ slug: catVal.toLowerCase() }, { name: catVal }],
            });

            // If category doesn't exist, throw an error (frontend should ensure category exists before allowing creation)
            if (cat) {
                categoryId = cat._id;
            } else {
                return res.status(400).json({ error: "Invalid category" });
            }
        }

        // Resolve author to be the logged in user (accept objectId, name or email, should be automatically set to logged in user in frontend)
        let authorId = null;
        const authVal = String(newBulletin.author).trim();

        // First try to find user by ID, then fallback to name or email
        if (mongoose.Types.ObjectId.isValid(authVal)) {
            authorId = authVal;
        } else {
            const user = await User.findOne({
                $or: [{ name: authVal }, { email: authVal }],
            });

            // If user doesn't exist, throw an error (frontend should ensure user exists before allowing creation, and should default to logged in user)
            if (user) {
                authorId = user._id;
            } else {
                return res.status(400).json({ error: "Invalid author" });
            }
        }

        const created = await Bulletin.create({
            title: String(newBulletin.title).trim(),
            category: categoryId,
            message: newBulletin.message
                ? String(newBulletin.message).trim()
                : "",
            author: authorId,
            date: new Date(),
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

        // Handle category filter (accept slug or ObjectId and resolve to category _id)
        if (
            selectedCategory &&
            selectedCategory.trim().toLowerCase() !== "all"
        ) {
            const catVal = selectedCategory.trim();

            // First try to find category by ID, then fallback to slug or name
            if (mongoose.Types.ObjectId.isValid(catVal)) {
                query.category = catVal;
            } else {
                const cat = await Category.findOne({
                    $or: [{ slug: catVal.toLowerCase() }, { name: catVal }],
                });
                if (cat) query.category = cat._id;
            }
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

            // Search by title
            if (trimmedField === "title") {
                query.title = pattern;
            }
            // Search by category name (need to find matching categories and filter by their _id)
            else if (trimmedField === "category") {
                const cats = await Category.find({ name: pattern });

                // for each category, get the _id
                const catIds = cats.map((c) => c._id);

                query.category = { $in: catIds };
            }
            // Search by author name (need to find matching users and filter by their _id)
            else if (trimmedField === "author") {
                const users = await User.find({ name: pattern });

                // for each user, get the _id
                const userIds = users.map((u) => u._id);

                query.author = { $in: userIds };
            }
            // If "any" is selected, search title, category name, and author name
            else if (trimmedField === "any") {
                const cats = await Category.find({ name: pattern });
                const users = await User.find({ name: pattern });

                // for each category, get the _id
                const catIds = cats.map((c) => c._id);

                // for each user, get the _id
                const userIds = users.map((u) => u._id);

                query.$or = [
                    { title: pattern },
                    { category: { $in: catIds } },
                    { author: { $in: userIds } },
                ];
            }

            // If selectedCategory and "any" search, we combine them
            if (
                selectedCategory &&
                selectedCategory.trim().toLowerCase() !== "all" &&
                trimmedField === "any"
            ) {
                // We need to find the category _id for the selected category filter
                const catVal = selectedCategory.trim();
                let catId = null;

                // First try to find category by ID, then fallback to slug or name
                if (mongoose.Types.ObjectId.isValid(catVal)) {
                    catId = catVal;
                } else {
                    const cat = await Category.findOne({
                        $or: [{ slug: catVal.toLowerCase() }, { name: catVal }],
                    });
                    if (cat) catId = cat._id;
                }

                // Query is set to serach through "any" based on previous code AND category
                if (catId) {
                    query = {
                        $and: [{ category: catId }, query],
                    };
                }
            }
        }

        // exclude soft-deleted
        query.isDeleted = false;

        // Populate author and category fields for better frontend display (only name and email for author, name and slug for category)
        const bulletins = await Bulletin.find(query)
            .populate("author", "name email")
            .populate("category", "name slug");

        return res.status(200).json(bulletins);
    } catch (err) {
        console.error("Error fetching bulletins:", err);
        return res
            .status(500)
            .json({ error: "Server error fetching bulletins" });
    }
});

// Get one bulletin by _id
router.get("/:id", async (req, res) => {
    try {
        const idParam = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(idParam)) {
            return res.status(400).json({ error: "Invalid _id param" });
        }

        // Populate author and category fields for better frontend display (only name and email for author, name and slug for category)
        const bulletin = await Bulletin.findById(idParam)
            .populate("author", "name email")
            .populate("category", "name slug");

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
router.patch("/:id", async (req, res) => {
    try {
        const idParam = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(idParam)) {
            return res.status(400).json({ error: "Invalid _id param" });
        }

        const allowedFields = ["title", "category", "message", "author"];
        const updateData = {};

        for (const field of allowedFields) {
            // Only process fields that are actually present in the request body (allows partial updates)
            if (Object.prototype.hasOwnProperty.call(req.body, field)) {
                // Allow empty strings for message
                if (field === "message") {
                    updateData.message =
                        req.body.message === undefined ||
                        req.body.message === null
                            ? ""
                            : String(req.body.message).trim();
                } else if (field === "title") {
                    const titleVal = String(req.body.title).trim();

                    // Title cannot be empty (it's a required field)
                    if (!titleVal) {
                        return res
                            .status(400)
                            .json({ error: "Title cannot be empty" });
                    }

                    updateData.title = titleVal;
                } else if (field === "category") {
                    // If category is being updated, retrieve the passed value
                    const catVal = String(req.body.category).trim();

                    // Category cannot be empty
                    if (!catVal) {
                        return res
                            .status(400)
                            .json({ error: "Category cannot be empty" });
                    }

                    // First try to find category by ID, then fallback to slug or name and resolve to ID
                    if (mongoose.Types.ObjectId.isValid(catVal)) {
                        const cat = await Category.findById(catVal);

                        if (!cat) {
                            return res
                                .status(400)
                                .json({ error: "Invalid category" });
                        }

                        updateData.category = cat._id;
                    } else {
                        const cat = await Category.findOne({
                            $or: [
                                { slug: catVal.toLowerCase() },
                                { name: catVal },
                            ],
                        });

                        if (!cat) {
                            return res
                                .status(400)
                                .json({ error: "Invalid category" });
                        }

                        updateData.category = cat._id;
                    }
                } else if (field === "author") {
                    // If author is being updated, retrieve the passed value
                    const authVal = String(req.body.author).trim();

                    // Author cannot be empty
                    if (!authVal) {
                        return res
                            .status(400)
                            .json({ error: "Author cannot be empty" });
                    }

                    // First try to find user by ID, then fallback to name or email and resolve to ID
                    if (mongoose.Types.ObjectId.isValid(authVal)) {
                        const user = await User.findById(authVal);

                        if (!user) {
                            return res
                                .status(400)
                                .json({ error: "Invalid author" });
                        }

                        updateData.author = user._id;
                    } else {
                        const user = await User.findOne({
                            $or: [{ name: authVal }, { email: authVal }],
                        });

                        if (!user) {
                            return res
                                .status(400)
                                .json({ error: "Invalid author" });
                        }

                        updateData.author = user._id;
                    }
                } else {
                    // For any other fields, throw an error
                    return res.status(400).json({
                        error: `Cannot update field: ${field}`,
                    });
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
        updateData.date = new Date();

        // Find the bulletin by ID and update with the new data, return the updated document
        const updated = await Bulletin.findByIdAndUpdate(
            idParam,
            { $set: updateData },
            { new: true, runValidators: true },
        )
            // Populate author and category fields for better frontend display (only name and email for author, name and slug for category)
            .populate("author", "name email")
            .populate("category", "name slug");

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
// Soft-delete a bulletin (admin)
router.post("/:id/soft-delete", requireAuth, async (req, res) => {
    try {
        const idParam = req.params.id;

        // If the id parameter is not a valid MongoDB ObjectId, return a 400 error
        if (!mongoose.Types.ObjectId.isValid(idParam)) {
            return res.status(400).json({ error: "Invalid _id param" });
        }

        // If bulletin doesn't exist, return a 404 error
        const bulletin = await Bulletin.findById(idParam);
        if (!bulletin) {
            return res.status(404).json({ error: "Bulletin not found" });
        }

        // Only author or admin may soft-delete
        if (
            !(
                req.user.role === "admin" ||
                String(bulletin.author) === String(req.user.id)
            )
        ) {
            return res
                .status(403)
                .json({ error: "Not authorized to delete this bulletin" });
        }

        bulletin.isDeleted = true;

        // Update the bulletin
        await bulletin.save();
        return res.status(200).json({ message: "Bulletin soft-deleted" });
    } catch (err) {
        console.error("Error soft-deleting bulletin:", err);
        return res
            .status(500)
            .json({ error: "Server error deleting bulletin" });
    }
});

// Restore a soft-deleted bulletin (admin only)
router.post("/:id/restore", requireAdmin, async (req, res) => {
    try {
        const idParam = req.params.id;

        // If the id parameter is not a valid MongoDB ObjectId, return a 400 error
        if (!mongoose.Types.ObjectId.isValid(idParam)) {
            return res.status(400).json({ error: "Invalid _id param" });
        }

        // If bulletin doesn't exist, return a 404 error
        const bulletin = await Bulletin.findById(idParam);
        if (!bulletin) {
            return res.status(404).json({ error: "Bulletin not found" });
        }
        // Update the bulletin
        bulletin.isDeleted = false;
        await bulletin.save();

        return res.status(200).json({ message: "Bulletin restored" });
    } catch (err) {
        console.error("Error restoring bulletin:", err);
        return res
            .status(500)
            .json({ error: "Server error restoring bulletin" });
    }
});

// Permanently delete a bulletin (admin only), only allow if already soft-deleted
router.delete("/:id", requireAdmin, async (req, res) => {
    try {
        const idParam = req.params.id;

        // If the id parameter is not a valid MongoDB ObjectId, return a 400 error
        if (!mongoose.Types.ObjectId.isValid(idParam)) {
            return res.status(400).json({ error: "Invalid _id param" });
        }

        // If bulletin doesn't exist, return a 404 error
        const bulletin = await Bulletin.findById(idParam);
        if (!bulletin) {
            return res.status(404).json({ error: "Bulletin not found" });
        }

        // Only allow permanent deletion if the bulletin is already soft-deleted
        if (!bulletin.isDeleted) {
            return res.status(400).json({
                error: "Bulletin must be soft-deleted before permanent removal",
            });
        }

        // Permanently delete the bulletin
        await Bulletin.findByIdAndDelete(idParam);
        return res.status(204).send();
    } catch (err) {
        console.error("Error permanently deleting bulletin:", err);
        return res
            .status(500)
            .json({ error: "Server error deleting bulletin" });
    }
});

// Admin-only stats (counts per category, total bulletins, total per user)
router.get("/stats", requireAdmin, async (req, res) => {
    try {
        const total = await Bulletin.countDocuments({});
        const totalActive = await Bulletin.countDocuments({ isDeleted: false });

        // for each category (grouped) return the count of bulletins, including categories with zero bulletins
        const perCategory = await Category.aggregate([
            {
                // Join bulletins to each category on category _id = bulletin category
                $lookup: {
                    from: "bulletins",
                    localField: "_id",
                    foreignField: "category",
                    as: "bulletins",
                },
            },
            {
                // Group by category _id and count the number of bulletins in the joined array
                $group: {
                    _id: "$_id",
                    count: { $sum: { $size: "$bulletins" } },
                },
            },
        ]);

        // for each author (grouped) return the count of bulletins, including authors with zero bulletins
        const perUser = await User.aggregate([
            {
                // Join bulletins to each user on user _id = bulletin author
                $lookup: {
                    from: "bulletins",
                    localField: "_id",
                    foreignField: "author",
                    as: "bulletins",
                },
            },
            {
                // Group by user _id and count the number of bulletins in the joined array
                $group: {
                    _id: "$_id",
                    count: { $sum: { $size: "$bulletins" } },
                },
            },
        ]);

        // Return the stats in an object
        return res
            .status(200)
            .json({ total, totalActive, perCategory, perUser });
    } catch (err) {
        console.error("Error fetching stats:", err);
        return res.status(500).json({ error: "Server error fetching stats" });
    }
});

module.exports = router;
