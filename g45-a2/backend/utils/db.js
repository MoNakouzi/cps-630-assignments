const mongoose = require("mongoose");

const DATABASE_URL = "localhost";
const DATABASE_PORT = 27017;
const DATABASE_NAME = "bulletinDB";

const dbURL = `mongodb://${DATABASE_URL}:${DATABASE_PORT}/${DATABASE_NAME}`;

function connectDB() {
  mongoose.connect(dbURL);
  const db = mongoose.connection;

  db.on("error", function (e) {
    console.error("MongoDB connection error:", e);
  });

  db.on("open", function () {
    console.log("Connected to MongoDB at", dbURL);
  });
}

module.exports = connectDB;
