const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const verifyToken = require('../middleware/verifyToken'); // <--- 1. MAKE SURE THIS IS HERE

// PUBLIC ROUTES (Viewers don't need a token)
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PROTECTED ROUTES (Admin needs a token)
// Notice "verifyToken" is the second argument now
router.post('/', verifyToken, async (req, res) => {  // <--- 2. ADD THIS
  const blog = new Blog({
    title: req.body.title,
    content: req.body.content,
    image: req.body.image,
    category: req.body.category
  });

  try {
    const newBlog = await blog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add verifyToken to PUT and DELETE as well
router.put('/:id', verifyToken, async (req, res) => { // <--- 3. ADD THIS
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedBlog);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => { // <--- 4. ADD THIS
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: 'Blog deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;