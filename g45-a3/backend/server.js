require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");


// Utils
const connectDB = require("./utils/db");
const addSeedData = require("./utils/seedBulletins");
const { initSocket } = require("./utils/socket");

// Routes
const authRouter = require("./routes/auth");
const bulletinsRouter = require("./routes/bulletins");
const categoriesRouter = require("./routes/categories");
const usersRouter = require("./routes/users");
const chatRouter = require("./routes/chat");

const app = express();
const server = http.createServer(app);

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
app.use("/api/bulletins", bulletinsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);


// Health check route
app.get("/health", (req, res) => {
    res.status(200).send("Bulletin API is running");
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Initialize Socket.io
initSocket(server);

// Start server
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
