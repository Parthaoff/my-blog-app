import axios from 'axios';

const API = axios.create({
  baseURL: 'https://my-blog-app-1-fszm.onrender.com/api',
});

// This automatically adds the token to requests if we have one saved
API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers['auth-token'] = localStorage.getItem('token');
  }
  return req;
});


export default API;


// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// // IMPORT ROUTES
// const blogRoutes = require('./routes/blogs');
// const authRoutes = require('./routes/auth');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // --- FIXED MIDDLEWARE SECTION ---
// app.use(express.json()); // Allows us to parse JSON bodies

// // FIX: Use this simple CORS setup. It allows ALL origins (Vercel, Localhost, etc.)
// app.use(cors()); 

// // USE ROUTES
// app.use('/api/blogs', blogRoutes);
// app.use('/api/auth', authRoutes);

// // Basic Route to test
// app.get('/', (req, res) => {
//   res.send('Blog API is running...');
// });

// // Database Connection
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('MongoDB Connected'))
//   .catch((err) => console.log('DB Connection Error:', err));

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

