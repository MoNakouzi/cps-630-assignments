// Import required modules
const express = require('express');
const path = require('path');
const app = express();

// Set the port
const PORT = 8000;
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes for HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/board.html'));
});