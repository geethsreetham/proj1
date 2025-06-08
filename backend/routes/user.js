const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).send({ error: 'Authentication required' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret');
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).send({ error: 'Invalid token' });
  }
};

router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password -resetToken -resetTokenExpires');
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.send(user);
  } catch (error) {
    console.error('Profile fetch error:', error.message);
    res.status(500).send({ error: 'Failed to fetch profile' });
  }
});

router.put('/profile', authenticate, async (req, res) => {
  try {
    const { username, name, dob } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    if (username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).send({ error: 'Username already taken' });
      }
    }
    user.username = username;
    user.name = name;
    user.dob = dob;
    await user.save();
    res.send('Profile updated');
  } catch (error) {
    console.error('Profile update error:', error.message);
    res.status(500).send({ error: 'Failed to update profile' });
  }
});

module.exports = router;