const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  resetToken: { type: String },
  resetTokenExpires: { type: Date },
  cart: [{ book_id: String, added_at: { type: Date, default: Date.now } }],
  bookmarks: [{ book_id: String, last_chapter: String, last_read: { type: Date, default: Date.now } }],
  profilePhoto: { type: String, default: '/assets/default-profile.png' }
});

module.exports = mongoose.model('User', userSchema);