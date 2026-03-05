const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    message: { type: String, required: false },
    author: { type: String, required: true },
    date: { type: String, required: true }
    
});

const Post = mongoose.model('post', PostSchema);
module.exports = Post;

