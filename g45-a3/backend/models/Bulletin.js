const mongoose = require("mongoose");

// Bulletin schema references User and Category to reduce redundancy
const BulletinSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    // Reference to a Category document by _id
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    message: {
        type: String,
        required: false,
        trim: true,
    },
    // Reference to the User who created the bulletin by _id
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    // Set to type Date with default to current time for easy sorting and filtering by date
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    // Soft-delete so we can keep records without permanently removing them
    isDeleted: {
        type: Boolean,
        default: false,
    },
});

// Add common indexes to improve query performance
BulletinSchema.index({ title: "text", message: "text" });

const Bulletin = mongoose.model("Bulletin", BulletinSchema);

module.exports = Bulletin;
