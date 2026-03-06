const mongoose = require("mongoose");

const BulletinSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  title: { type: String, required: true },
  category: { type: String, required: true },
  message: { type: String, required: false },
  author: { type: String, required: true },
  date: { type: String, required: true },
});

const Bulletin = mongoose.model("bulletin", BulletinSchema);

module.exports = Bulletin;
