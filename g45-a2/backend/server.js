const express = require("express");
const cors = require("cors");

// Utils
const connectDB = require("./utils/db");
const addSeedData = require("./utils/seedBulletins");

// Routes
const bulletinsRouter = require("./routes/bulletinAPI");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB + seed
connectDB();
addSeedData();

// Routes
app.use("/bulletins", bulletinsRouter);

// Health check route
app.get("/health", (req, res) => {
    res.status(200).send("Bulletin API is running");
});
// Database connection check route
app.get("/dbcheck", async (req, res) => {
    try {
        await connectDB();
        res.status(200).send("Database connection successful");
    } catch (err) {
        console.error("Database connection error:", err);
        res.status(500).send("Database connection failed");
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Start server
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
