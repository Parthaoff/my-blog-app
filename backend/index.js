// backend/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// IMPORT ROUTES
const blogRoutes = require('./routes/blogs');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Allow requests from your Vercel frontend
app.use(cors({
  origin: ["https://my-blog-app.vercel.app", "http://localhost:5173"], // Add your specific Vercel URL here later
  credentials: true
}));

// Middleware
app.use(express.json()); // Allows us to parse JSON bodies
app.use(cors()); // Allows frontend to connect

// USE ROUTES
// app.use('/api/blogs', blogRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/auth', authRoutes);
// Basic Route to test
app.get('/', (req, res) => {
  res.send('Blog API is running...');
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('DB Connection Error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

});
