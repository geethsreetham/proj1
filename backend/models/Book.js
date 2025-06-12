const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true }, // Gutenberg ID (e.g., "pg1342")
  title: { type: String, required: true },
  author: { type: [String], default: ['Unknown'] },
  genres: { type: [String], default: [] },
  language: { type: String, default: 'English' },
  publication_date: { type: String },
  isbn: { type: String, unique: true, sparse: true },
  cover: { type: String, default: '/assets/placeholder.jpg' },
  description: { type: String },
  source_url: { type: String },
  full_text: { type: String },
  chapter_list: { type: [String], default: [] },
  price: { type: Number }, // Random price for cart
  views: { type: Number, default: 0 },
  last_updated: { type: Date, default: Date.now }
});

bookSchema.index({ title: 'text', author: 'text', description: 'text' });

module.exports = mongoose.model('Book', bookSchema);