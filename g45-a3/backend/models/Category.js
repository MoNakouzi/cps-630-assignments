const mongoose = require("mongoose");

// Category schema is a list of bulletin categories
const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    // slug is a normalized unique identifier for URLs/filters (e.g., "events")
    slug: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
    },
    description: {
        type: String,
        required: false,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
