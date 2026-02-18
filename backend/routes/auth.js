const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER (Run this once to create your admin, then ignore)
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, password: hashedPassword });
    const savedUser = await newUser.save();
    
    res.json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. LOGIN (This gives you the "wristband" token)
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(404).json("User not found!");

    // Compare passwords
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json("Wrong password!");

    // Create Token (The "Wristband")
    // Note: We will add JWT_SECRET to .env later
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Send token and username back
    res.status(200).json({ token, username: user.username }); 
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;