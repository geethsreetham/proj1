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
    res.status(500).send({ error: 'Failed to update profile' });
  }
});

router.post('/cart/add', authenticate, async (req, res) => {
  try {
    const { book_id } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    if (!user.cart.some(item => item.book_id === book_id)) {
      user.cart.push({ book_id });
      await user.save();
    }
    res.send('Book added to cart');
  } catch (error) {
    res.status(500).send({ error: 'Failed to add to cart' });
  }
});

router.post('/cart/remove', authenticate, async (req, res) => {
  try {
    const { book_id } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    user.cart = user.cart.filter(item => item.book_id !== book_id);
    await user.save();
    res.send('Book removed from cart');
  } catch (error) {
    res.status(500).send({ error: 'Failed to remove from cart' });
  }
});

router.get('/cart', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('cart.book_id');
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.send(user.cart);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch cart' });
  }
});

router.post('/bookmark', authenticate, async (req, res) => {
  try {
    const { book_id, last_chapter } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    const bookmark = user.bookmarks.find(b => b.book_id === book_id);
    if (bookmark) {
      bookmark.last_chapter = last_chapter;
      bookmark.last_read = new Date();
    } else {
      user.bookmarks.push({ book_id, last_chapter });
    }
    await user.save();
    res.send('Bookmark updated');
  } catch (error) {
    res.status(500).send({ error: 'Failed to update bookmark' });
  }
});

router.get('/bookmarks', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('bookmarks.book_id');
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.send(user.bookmarks);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch bookmarks' });
  }
});

router.post('/upload-photo', authenticate, async (req, res) => {
  try {
    const { photoUrl } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    user.profilePhoto = photoUrl;
    await user.save();
    res.send('Profile photo updated');
  } catch (error) {
    res.status(500).send({ error: 'Failed to upload photo' });
  }
});

module.exports = router;