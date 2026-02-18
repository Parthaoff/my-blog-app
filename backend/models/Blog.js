const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true, // This will store the blog text (or HTML later)
  },
  image: {
    type: String, // URL of the image
    default: "https://via.placeholder.com/150",
  },
  category: {
    type: String,
    default: "General",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Blog', blogSchema);