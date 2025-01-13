require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const router = express.Router(); // Use Router instead of app to define routes

// Register Route
router.post('/register', async (req, res) => {
    try {
      const { username, email, password, plan } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).send('User already exists');

      // Hash Password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save User
      const newUser = new User({ username, email, password: hashedPassword, plan });
      await newUser.save();
      res.send('User registered successfully');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('User not found');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('Invalid password');

    const token = jwt.sign({ id: user._id, plan: user.plan }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router; // Export the router for use in server.js
