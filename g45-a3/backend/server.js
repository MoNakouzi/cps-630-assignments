require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Utils
const connectDB = require("./utils/db");
const addSeedData = require("./utils/seedBulletins");

// Routes
const authRouter = require("./routes/auth");
const bulletinsRouter = require("./routes/bulletin");
const categoriesRouter = require("./routes/categories");
const usersRouter = require("./routes/users");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Attach user info from JWT (guest if no token provided)
const { attachUser } = require("./middleware/auth");
app.use(attachUser);

// Connect DB + seed
connectDB();
addSeedData();

// Routes
app.use("/api/auth", authRouter);
app.use("/api/bulletins", bulletinsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/users", usersRouter);

// Health check route
app.get("/health", (req, res) => {
    res.status(200).send("Bulletin API is running");
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
