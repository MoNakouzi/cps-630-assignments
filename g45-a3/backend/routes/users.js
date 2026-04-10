const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User");
const Bulletin = require("../models/Bulletin");
const RefreshToken = require("../models/RefreshToken");

const { requireAdmin, requireAuth } = require("../middleware/auth");

/********************************************************/
/********* Defining (CRUD) API CREATE routes ************/
/********************************************************/
// (PUBLIC) Register a new user, registration issues a JWT on success
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

        // Issue JWT on registration
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES || "1h" },
        );

        // Create refresh token value randomly
        const refreshTokenValue = crypto.randomBytes(48).toString("hex");

        // Set expiration for refresh token (7 days default if env variable not set)
        const refreshExpires = new Date(
            Date.now() +
                parseInt(
                    process.env.REFRESH_EXPIRES_MS ||
                        String(7 * 24 * 60 * 60 * 1000),
                    10,
                ),
        );

        // Store the refresh token in the database linked to the user
        await RefreshToken.create({
            token: refreshTokenValue,
            user: user._id,
            expiresAt: refreshExpires,
        });

        // Return the token and basic user info (excluding passwordHash)
        return res.status(201).json({
            token,
            refreshToken: refreshTokenValue,
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (err) {
        console.error("Error creating user:", err);
        return res.status(500).json({ error: "Server error creating user" });
    }
});

/******************************************************/
/********* Defining (CRUD) API READ routes ************/
/******************************************************/
// (PRIVATE) List all users (admin only)
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

// (PRIVATE) Get a specific user details (admin or self)
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

// (PUBLIC) List bulletins by a user (non-deleted only, with category info)
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
// (PRIVATE) Update user name/email (admin or self)
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

        return res.status(200).json({
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
// (PRIVATE) Change user password (only self or admin), admin can change without old password; non-admin users must provide old password
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
