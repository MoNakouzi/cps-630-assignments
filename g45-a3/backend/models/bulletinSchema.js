const mongoose = require("mongoose");

const BulletinSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    message: {
        type: String,
        required: false,
        trim: true,
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: String,
        required: true,
        trim: true,
    },
});

const Bulletin = mongoose.model("bulletin", BulletinSchema);

module.exports = Bulletin;
