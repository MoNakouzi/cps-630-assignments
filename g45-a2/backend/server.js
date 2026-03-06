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
async function addSeedData() {
    const postCount = await Post.countDocuments();

    if (postCount === 0){
        console.log('Database is empty. Adding initial posts...');

        bulletins.forEach(post => {
            const newPost = new Post(post);
            newPost.save()
                .then(() => console.log("Post added with ID: " + post.id + " and title: " + post.title ))
                .catch(err => console.error("Error adding post with ID: " + post.id + " and title: " +   post.title + " " + err));
        });

    }
    else{
        console.log("Post already exists. Not adding test book.");
        return;
    }
};
addSeedData();

/********************************************************/
/********* Defining (CRUD) API CREATE routes ************/
/********************************************************/
//Add new posts
//Should probably make a proper and unique id system
//This will break if 2 people try to add a post at the same time
app.post("/api/posts", async (req, res) => {
  try {
    const newPost = req.body;

    if (
      !newPost ||
      newPost.title === undefined ||
      newPost.category === undefined ||
      newPost.author === undefined
    ) {
      return res.status(400).json({ error: "Invalid post data" });
    }

    // Get highest existing id, then +1
    const last = await Post.findOne({}, { id: 1 }).sort({ id: -1 }).lean();
    const nextId = (last?.id ?? 0) + 1;

    // Current date in YYYY-MM-DD
    const today = new Date().toISOString().slice(0, 10);

    const created = await Post.create({
      id: nextId,
      title: String(newPost.title).trim(),
      category: String(newPost.category).trim(),
      message: String(newPost.message).trim(),
      author: String(newPost.author).trim(),
      date: today, // auto-fill date
    });

    return res.status(201).json(created);
  } catch (err) {
    console.error("Error creating post:", err);
    return res.status(500).json({ error: "Server error creating post" });
  }
});

/******************************************************/
/********* Defining (CRUD) API READ routes ************/
/******************************************************/
//Get all Posts from DB (HomePage)
app.get('/api/posts', async (req, res)  => {
    try {
        const posts = await Post.find({});
        return res.status(200).json(posts);
    } catch (err){
        console.error("Error fetching posts: ", err);
        return res.status(500).json({error: "Server error fetching posts"});
    }
});

//Get one Post
//Currenly no implementation that can use this
app.get('/api/posts/id/:id', async (req, res) => {
    try{
        const idParm = req.params.id;

        const post = await Post.findOne({ id: idParm});

        if(!post){
            return res.status(404).json({error: 'Post not found'});
        }

        return res.status(200).json(post);
    } catch (err) {
        console.error("Error fetching post by ID: ", err);
        return res.status(500).json({error: 'Server error fetching post'});
    }

});

//Return a json object with posts that match that Author
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

app.get('api/posts/search', async (req, res) => {
    try {
        const postAuthor = req.query.author;

        if(!postAuthor){
            return res.status(400).json({error: 'Author query parameter is required'});
        }

        const pattern = new RegExp(`^${escapeRegex(postAuthor)}$`, 'i');
        const posts = await Posts.find({author: pattern});

        if (books.length === 0){
            return res.status(404).json({error: "Post not found"});
        }

        return res.status(200).json(posts)
    } catch (err) {
        console.error("Error searching posts by author: ", err)
        return res.status(500).json({error: "Server error searching posts"});
    }
});


/********************************************************/
/********* Defining (CRUD) API UPDATE routes ************/
/********************************************************/
// Update an Existing posts message by finding the ID
app.patch("/api/posts/id/:id", async (req, res) => {
  try {
    const idParam = Number(req.params.id);
    const { message } = req.body;

    if (!Number.isFinite(idParam)) {
      return res.status(400).json({ error: "Invalid id param" });
    }
    if (message === undefined) {
      return res.status(400).json({ error: "Missing message in request body" });
    }

    const updated = await Post.findOneAndUpdate(
      { id: idParam },
      { $set: { message } },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    return res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating announcement message:", err);
    return res.status(500).json({ error: "Server error updating announcement" });
  }
});


/********************************************************/
/********* Defining (CRUD) API DELETE routes ************/
/********************************************************/
// Delete Post DB entry 
app.delete('/api/posts/id/:id', async (req, res) => {
    try {
        const idParm = req.params.id;
        const deleted = await Posts.findOneAndDelete({id: idParm});

        if (!deleted){
            return res.status(404).json({error: 'Post not found'});
        }
        return res.status(204).send();

    } catch (err) {
        console.error('Error deleting post: ', err);
        return res.status(500).json({error: 'Server error deleting post'});
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});