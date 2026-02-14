// Import required modules
const express = require("express");
const path = require("path");
const app = express();

// Set the port
const PORT = 8000;

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

//For Bulletin functions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes for HTML files
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "src/views/board.html"));
});
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "src/views/about.html"));
});
app.get("/add", (req, res) => {
    res.sendFile(path.join(__dirname, "src/views/add.html"));
});
app.get("/edit", (req, res) => {
    res.sendFile(path.join(__dirname, "src/views/edit.html"));
});
app.get("/delete", (req, res) => {
    res.sendFile(path.join(__dirname, "src/views/delete.html"));
});

// CRUD API routes
const bulletinsRouter = require("./src/routes/bulletins");
app.use("/api/bulletins", bulletinsRouter);

// Handle 404 errors
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "src/views/404.html"));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
