const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/User");
const Bulletin = require("../models/Bulletin");

const { requireAdmin, requireAuth } = require("../middleware/auth");

/********************************************************/
/********* Defining (CRUD) API CREATE routes ************/
/********************************************************/
// Register a new user
router.post("/", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ error: "Name, email and password required" });
        }

        // Ensure email uniqueness, throw error if email already exists
        const existing = await User.findOne({
            email: String(email).toLowerCase().trim(),
        });
        if (existing) {
            return res.status(409).json({ error: "Email already in use" });
        }

        // Hash the password before storing
        const passwordHash = await bcrypt.hash(String(password), 10);

        // Create the user and return basic info (excluding passwordHash)
        const user = await User.create({
            name: String(name).trim(),
            email: String(email).toLowerCase().trim(),
            passwordHash,
        });
        return res
            .status(201)
            .json({ id: user._id, name: user.name, email: user.email });
    } catch (err) {
        console.error("Error creating user:", err);
        return res.status(500).json({ error: "Server error creating user" });
    }
});

/******************************************************/
/********* Defining (CRUD) API READ routes ************/
/******************************************************/
// List all users (admin only)
router.get("/", requireAdmin, async (req, res) => {
    try {
        const users = await User.find(
            {},
            { name: 1, email: 1, role: 1, isActive: 1, createdAt: 1 },
        ).sort({ createdAt: -1 });
        return res.status(200).json(users);
    } catch (err) {
        console.error("Error listing users:", err);
        return res.status(500).json({ error: "Server error listing users" });
    }
});

// Get a specific user details (admin or self)
router.get("/:id", requireAuth, async (req, res) => {
    try {
        const idParam = req.params.id;

        // Validate that idParam is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(idParam)) {
            return res.status(400).json({ error: "Invalid user id" });
        }

        // Allow admin or the user themselves only
        if (
            !(
                req.user &&
                (req.user.role === "admin" || req.user.id === idParam)
            )
        ) {
            return res.status(403).json({ error: "Not authorized" });
        }

        const user = await User.findById(idParam, {
            name: 1,
            email: 1,
            role: 1,
            isActive: 1,
            createdAt: 1,
            lastLogin: 1,
        });

        // If user not found, return 404
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json(user);
    } catch (err) {
        console.error("Error fetching user:", err);
        return res.status(500).json({ error: "Server error fetching user" });
    }
});

// List bulletins by a user (public)
router.get("/:id/bulletins", async (req, res) => {
    try {
        const idParam = req.params.id;

        // Validate that idParam is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(idParam)) {
            return res.status(400).json({ error: "Invalid user id" });
        }

        // Return all non-soft-deleted bulletins by this author, populated with category name and slug
        const bulletins = await Bulletin.find({
            author: idParam,
            isDeleted: false,
        }).populate("category", "name slug");
        return res.status(200).json(bulletins);
    } catch (err) {
        console.error("Error listing user bulletins:", err);
        return res
            .status(500)
            .json({ error: "Server error listing user bulletins" });
    }
});

/********************************************************/
/********* Defining (CRUD) API UPDATE routes ************/
/********************************************************/
// Update user name/email (admin or self)
router.patch("/:id", requireAuth, async (req, res) => {
    try {
        const idParam = req.params.id;

        // Validate that idParam is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(idParam)) {
            return res.status(400).json({ error: "Invalid user id" });
        }

        // Allow admin or the user themselves only
        if (
            !(
                req.user &&
                (req.user.role === "admin" || req.user.id === idParam)
            )
        ) {
            return res.status(403).json({ error: "Not authorized" });
        }

        const { name, email } = req.body;
        const update = {};

        // Validate which fields are being updated and ensure they are not empty strings
        if (name && String(name).trim()) {
            update.name = String(name).trim();
        }
        if (email && String(email).trim()) {
            update.email = String(email).toLowerCase().trim();
        }

        // If no valid fields provided, return an error
        if (Object.keys(update).length === 0) {
            return res
                .status(400)
                .json({ error: "Provide name or email to update" });
        }

        // If email changed, ensure uniqueness
        if (update.email) {
            const other = await User.findOne({
                email: update.email,
                _id: { $ne: idParam },
            });
            if (other)
                return res.status(409).json({ error: "Email already in use" });
        }

        // Try to update the user and return the updated info (excluding passwordHash)
        const updated = await User.findByIdAndUpdate(
            idParam,
            { $set: update },
            { new: true, runValidators: true },
        );

        // If user not found, return 404
        if (!updated) {
            return res.status(404).json({ error: "User not found" });
        }

        return res
            .status(200)
            .json({
                id: updated._id,
                name: updated.name,
                email: updated.email,
            });
    } catch (err) {
        console.error("Error updating user:", err);
        return res.status(500).json({ error: "Server error updating user" });
    }
});

/********************************************************/
/********* Defining (CRUD) API DELETE routes ************/
/********************************************************/
// Change user password (only self or admin can change the password, user needs to confirm old password if not admin)
router.post("/:id/change-password", requireAuth, async (req, res) => {
    try {
        const idParam = req.params.id;

        // Validate that idParam is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(idParam)) {
            return res.status(400).json({ error: "Invalid user id" });
        }

        // Only admin or the user themselves
        if (
            !(
                req.user &&
                (req.user.role === "admin" || req.user.id === idParam)
            )
        ) {
            return res.status(403).json({ error: "Not authorized" });
        }

        const { oldPassword, newPassword } = req.body;

        // Validate that new password is provided
        if (!newPassword) {
            return res.status(400).json({ error: "New password required" });
        }

        // Try to find the user by ID
        const user = await User.findById(idParam);
        // If user not found, return 404
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // If not admin, verify old password
        if (req.user.role !== "admin") {
            if (!oldPassword) {
                return res.status(400).json({ error: "Old password required" });
            }
            const ok = await bcrypt.compare(
                String(oldPassword),
                user.passwordHash,
            );
            if (!ok) {
                return res
                    .status(400)
                    .json({ error: "Old password incorrect" });
            }
        }

        // Hash the new password and update the user's passwordHash
        const passwordHash = await bcrypt.hash(String(newPassword), 10);

        user.passwordHash = passwordHash;
        await user.save();

        return res.status(200).json({ message: "Password updated" });
    } catch (err) {
        console.error("Error changing password:", err);
        return res
            .status(500)
            .json({ error: "Server error changing password" });
    }
});

module.exports = router;
