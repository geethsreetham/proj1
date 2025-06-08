const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  resetToken: { type: String },
  resetTokenExpires: { type: Date }
});

module.exports = mongoose.model('User', userSchema);