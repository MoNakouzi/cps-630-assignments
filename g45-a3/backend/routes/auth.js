const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const RefreshToken = require("../models/RefreshToken");
const User = require("../models/User");

// (PUBLIC) login endpoint that issues JWT on successful authentication
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res
                .status(400)
                .json({ error: "Email and password required" });
        }

        // Find the user by email
        const user = await User.findOne({
            email: String(email).toLowerCase().trim(),
        });
        // If user not found, return error (intentionally vague for additional security)
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Compare the provided password with the stored hash
        const ok = await bcrypt.compare(String(password), user.passwordHash);
        // If password does not match, return error
        if (!ok) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // If authentication is successful, issue a JWT token with user ID and role
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES || "1h" },
        );

        // Generate a secure random token value
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
        return res.status(200).json({
            token,
            refreshToken: refreshTokenValue,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error("Error during login:", err);
        return res.status(500).json({ error: "Server error logging in" });
    }
});

// (PUBLIC) exchange refresh token for new access token
router.post("/refresh", async (req, res) => {
    try {
        const { refreshToken } = req.body;

        // Validate that refreshToken is provided
        if (!refreshToken) {
            return res.status(400).json({ error: "refreshToken required" });
        }

        // Find the refresh token in the database and populate the associated user
        const stored = await RefreshToken.findOne({
            token: refreshToken,
        }).populate("user");

        // If token not found return error
        if (!stored) {
            return res.status(401).json({ error: "Invalid refresh token" });
        }

        // If token is expired, delete it and return error
        if (stored.expiresAt < new Date()) {
            // delete expired token
            await RefreshToken.deleteOne({ _id: stored._id });
            return res.status(401).json({ error: "Refresh token expired" });
        }

        // Retrieve the user from the populated refresh token and issue a new JWT
        const user = stored.user;
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES || "1h" },
        );

        return res.status(200).json({ token });
    } catch (err) {
        console.error("Error refreshing token:", err);
        return res.status(500).json({ error: "Server error refreshing token" });
    }
});

// (PRIVATE) takes refreshToken and deletes it so it cannot be reused
router.post("/logout", async (req, res) => {
    try {
        const { refreshToken } = req.body;
        
        // Validate that refreshToken is provided
        if (!refreshToken) {
            return res.status(400).json({ error: "refreshToken required" });
        }

        // Delete the refresh token from the database to invalidate it
        await RefreshToken.deleteOne({ token: refreshToken });
        
        return res.status(200).json({ message: "Logged out" });
    } catch (err) {
        console.error("Error logging out:", err);
        return res.status(500).json({ error: "Server error logging out" });
    }
});

module.exports = router;
