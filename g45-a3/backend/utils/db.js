const mongoose = require("mongoose");
// Load environment variables from .env when present
require("dotenv").config();

// try to get full MONGODB_URL from environment, fall back to localhost
const dbURL = process.env.MONGODB_URL || "mongodb://localhost:27017/bulletinDB";

function connectDB() {
    mongoose.connect(dbURL).catch((err) => {
        // Catch any initial connection errors
        console.error("MongoDB initial connection error:", err);
    });

    const db = mongoose.connection;

    db.on("error", function (e) {
        console.error("MongoDB connection error:", e);
    });

    db.on("open", function () {
        console.log("Connected to MongoDB at", dbURL);
    });
}

module.exports = connectDB;
