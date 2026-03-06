const express   = require('express');
const cors      = require('cors');
const app       = express();
const path      = require('path');
const { default: mongoose } = require('mongoose');
const Post = require('./models/Posts');

const PORT          = 8080;
const DATABASE_HOST = 'localhost';
const DATABASE_PORT = 27017;

<<<<<<< Updated upstream
//Enable CORS for frontend requests
=======
// Routes
const bulletinsRouter = require("./routes/bulletinAPI");

const app = express();

// Middleware
>>>>>>> Stashed changes
app.use(cors());
app.use(express.json());

//Connect to Local DB
const dbURL = `mongodb://${DATABASE_HOST}:${DATABASE_PORT}/post_library`;
mongoose.connect(dbURL);

//Test the connection
const db = mongoose.connection;
db.on('error', function(e) {
   console.log('error connecting:' + e);
});
db.on('open', function() {
    console.log('database connected!');
});

//Initial posts to be added to DB
let bulletins = [
  { id: 1, title: "Free Breakfast Club", category: "Events", message: "Free coffee and donuts will be available in the Science Lounge from 9:00 AM to 11:00 AM. First come, first served.", author: "Science Department", date: "2026-02-14" },
  { id: 2, title: "Lost Wallet Found", category: "Announcements", message: "A black leather wallet was found near the library entrance on Friday evening. Please contact the front desk with a description to claim it.", author: "Campus Security", date: "2026-01-30" },
  { id: 3, title: "Study Group for CPS 630", category: "Academics", message: "A study group for CPS 630 will meet every Wednesday at 6:00 PM in Room ENG-201. Everyone is welcome. Please come to learn more about the course, and how to apply your knowledge.", author: "CS Course Union", date: "2026-02-13" },
  { id: 4, title: "Gym Maintenance Notice", category: "Announcements", message: "The campus gym will be closed for maintenance this Saturday from 8:00 AM to 4:00 PM. We apologize for the inconvenience. We are trying our best to resolve this as soon as possible and we will get back to you urgently.", author: "Facilities Management", date: "2026-02-03" },
  { id: 6, title: "Career Fair This Friday", category: "Events", message: "Meet recruiters from tech, finance, and healthcare companies at the Winter Career Fair. Bring your resume and dress business casual.", author: "Career and Co-op Center", date: "2026-02-14" },
  { id: 7, title: "Job Fair", category: "Announcements", message: "I will finally get a job! Probably...", author: "CS Student", date: "2026-02-14" }
];

//Add the initial DB Posts
async function addTestPostsToMongoDB(){
    const postCount = await Post.countDocuments();

    if (postCount === 0){
        console.log('Adding Initial Posts');

        bulletins.forEach(post => {
            const newPost = new Post(post);
            newPost.save()
                .then(() => console.log("Post added with Id: " + post.id + " And Title: " + post.title ))
                .catch(err => console.error("Error adding posgt with ID: " + post.id + " And Title: " +   post.title + " " + err));
        });

    }
    else{
        console.log("Post already exists. Not adding test book.");
        return;
    }
}

addTestPostsToMongoDB();

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

//Starts Server
app.listen(PORT, () => { console.log("Server started on port: " + PORT) });