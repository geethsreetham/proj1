const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// Password validation regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').matches(passwordRegex).withMessage('Password must be at least 8 characters, include uppercase, lowercase, number, and special character'),
    body('username').trim().isLength({ min: 3 }).escape(),
    body('name').trim().isLength({ min: 1 }).escape(),
    body('dob').isDate()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    try {
      const { email, password, username, name, dob } = req.body;
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ email, password: hashedPassword, username, name, dob });
      await user.save();

      const transporter = nodemailer.createTransport({
        service: 'gmail',
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
      res.status(201).json({ message: 'User registered and welcome email sent' });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'email or password incorrect' });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your-jwt-secret', { expiresIn: '1h' });
      res.json({ token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

router.post(
  '/forgot-password',
  [body('email').isEmail().normalizeEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'If the email exists, a reset link has been sent to your inbox.' });
    }

    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      // Always return the same message to prevent enumeration
      if (!user) {
        return res.json({ message: 'If the email exists, a reset link has been sent to your inbox.' });
      }

      const token = crypto.randomBytes(20).toString('hex');
      user.resetToken = token;
      user.resetTokenExpires = Date.now() + 3600000; // 1 hour
      await user.save();

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Novelink Password Reset',
        text: `Click here to reset your password: http://localhost:3000/reset-password/${token}\n\nThis link expires in 1 hour.\n`
      };

      await transporter.sendMail(mailOptions);
      res.json({ message: 'If the email exists, a reset link has been sent to your inbox.' });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ message: 'An unexpected error occurred. Please try again.' });
    }
  }
);

router.post(
  '/reset-password/:token',
  [body('password').matches(passwordRegex).withMessage('Password must be at least 8 characters, include uppercase, lowercase, number, and special character')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    try {
      const { token } = req.params;
      const { password } = req.body;
      const user = await User.findOne({
        resetToken: token,
        resetTokenExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.resetTokenExpires = undefined;
      await user.save();

      res.json({ message: 'Password reset successful' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ error: 'Failed to reset password' });
    }
  }
);

router.get(
  '/verify',
  async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret');
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      res.json({ message: 'Token valid' });
    } catch (error) {
      console.error('Verify error:', error);
      res.status(401).json({ error: 'Invalid token' });
    }
  }
);

module.exports = router;