require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const blogRoutes = require('./routes/blogs');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// --- THE FIX IS HERE ---
// Delete any complex CORS code. Use ONLY this line:
app.use(cors()); 
// -----------------------

app.use(express.json());

app.use('/api/blogs', blogRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Blog API is running...');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('DB Connection Error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
