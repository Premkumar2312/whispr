const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Post = require('./models/Post');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

// Routes

// Get all posts
app.get('/posts', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// Create new post
app.post('/posts', async (req, res) => {
  const { text } = req.body;
  const newPost = new Post({ text });
  await newPost.save();
  res.status(201).json(newPost);
});

// React to a post
app.patch('/posts/:id/react', async (req, res) => {
  const { id } = req.params;
  const { type } = req.body; // type = 'fire' | 'skull' | 'bulb'

  if (!['fire', 'skull', 'bulb'].includes(type))
    return res.status(400).json({ error: 'Invalid reaction type' });

  const post = await Post.findById(id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  post.reactions[type]++;
  await post.save();
  res.json(post);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
