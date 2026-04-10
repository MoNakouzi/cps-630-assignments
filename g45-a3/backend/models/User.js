const mongoose = require("mongoose");

// User schema stores account info for authentication and role-based access
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true,
    },
    // Store hashed password (not plain text), hashing is handled when registering users
    passwordHash: {
        type: String,
        required: true,
    },
    // Role for authorization checks (e.g., user or admin)
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastLogin: {
        type: Date,
    },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
