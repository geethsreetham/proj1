const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  try {
    const { email, password, username, name, dob } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).send({ error: 'Email or username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, username, name, dob });
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to Novelink!',
      text: `Hello ${name},\n\nWelcome to Novelink! Your account has been created successfully.\n\nUsername: ${username}\nEmail: ${email}\n\nStart exploring books now: http://localhost:3000`
    };

    await transporter.sendMail(mailOptions);
    res.status(201).send('User registered and welcome email sent');
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).send({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: 'Invalid email' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Invalid password' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your-jwt-secret', { expiresIn: '1h' });
    res.send({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send({ error: 'Login failed' });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: 'Email not found' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetToken = token;
    user.resetTokenExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Novelink Password Reset',
      text: `Click to reset your password: http://localhost:3000/reset-password/${token}\n\nThis link expires in 1 hour.`
    };

    await transporter.sendMail(mailOptions);
    res.send('Reset email sent');
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).send({ error: 'Failed to send reset email' });
  }
});

module.exports = router;