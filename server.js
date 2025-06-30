const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Post = require("./models/Post");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.get("/",(req, res)=>{res.send("backend is running!");});

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB error:", err));

// === Create a new post ===
app.post("/posts", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  try {
    const newPost = new Post({ text });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: "Failed to create post" });
  }
});

// === Get all posts ===
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// === React to a post ===
app.patch("/posts/:id/react", async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;

  if (!["fire", "skull", "bulb"].includes(type)) {
    return res.status(400).json({ error: "Invalid emoji type" });
  }

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    post.reactions[type]++;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to react" });
  }
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
