const mongoose = require("mongoose");

const BulletinSchema = new mongoose.Schema({});

const Bulletin = mongoose.model("bulletin", BulletinSchema);

module.exports = Bulletin;
