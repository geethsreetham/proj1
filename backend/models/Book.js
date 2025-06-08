const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String },
  description: { type: String },
  cover: { type: String },
  isbn: { type: String, unique: true, sparse: true }, // Sparse index for optional ISBN
  content: { type: String }
});

module.exports = mongoose.model('Book', bookSchema);