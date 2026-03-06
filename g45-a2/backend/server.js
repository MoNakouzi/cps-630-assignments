// Import express, path, cors and mongoose
const express = require("express");
const path = require("path");
const cors = require("cors");
const { default: mongoose } = require("mongoose");

// Create an express app
const app = express();
app.use(cors());

// Import models
const Bulletin = require("./models/bulletin");

// Set up variables for MongoDB connection
const PORT = 8080;
const DATABASE_URL = "localhost";
const DATABASE_PORT = 27017;
const DATABASE_NAME = "bulletinDB";

// Connect to MongoDB using mongoose
const dbURL = `mongodb://${DATABASE_URL}:${DATABASE_PORT}/${DATABASE_NAME}`;
mongoose.connect(dbURL);
const db = mongoose.connection;

// Handle MongoDB connection events
db.on("error", function(e) {
    console.error("MongoDB connection error:", e);
});
db.on("open", function() {
    console.log("Connected to MongoDB at", dbURL);
});

// Create test (seed) data if the collection is empty
const seedData = [];

// Add seed data to the database if the collection is empty
async function addSeedData() {};
addSeedData();

/********************************************************/
/********* Defining (CRUD) API CREATE routes ************/
/********************************************************/


/******************************************************/
/********* Defining (CRUD) API READ routes ************/
/******************************************************/


/********************************************************/
/********* Defining (CRUD) API UPDATE routes ************/
/********************************************************/


/************************************&&******************/
/********* Defining (CRUD) API DELETE routes ************/
/**************************************&&****************/

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});