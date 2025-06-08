const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String },
  description: { type: String },
  cover: { type: String },
  isbn: { type: String, unique: true },
  content: { type: String }
});

module.exports = mongoose.model('Book', bookSchema);