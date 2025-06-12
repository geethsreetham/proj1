const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const jwt = require('jsonwebtoken');
const { scrapeGutenberg } = require('../scraper');

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

router.get('/populate', async (req, res) => {
  try {
    const insertedCount = await scrapeGutenberg();
    res.send(`Populated ${insertedCount} books from Project Gutenberg`);
  } catch (error) {
    res.status(500).send({ error: 'Failed to populate books' });
  }
});

router.get('/random', authenticate, async (req, res) => {
  try {
    const books = await Book.aggregate([{ $sample: { size: 5 } }]);
    res.send(books);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch random books' });
  }
});

router.get('/popular', authenticate, async (req, res) => {
  try {
    const popularAll = await Book.find().sort({ views: -1 }).limit(10);

    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const popularToday = await Book.find({ last_updated: { $gte: today } }).sort({ views: -1 }).limit(10);
    const popularWeek = await Book.find({ last_updated: { $gte: weekAgo } }).sort({ views: -1 }).limit(10);
    const popularMonth = await Book.find({ last_updated: { $gte: monthAgo } }).sort({ views: -1 }).limit(10);

    res.send({
      today: popularToday.length ? popularToday : popularAll.slice(0, 5),
      week: popularWeek.length ? popularWeek : popularAll.slice(0, 5),
      month: popularMonth.length ? popularMonth : popularAll.slice(0, 5),
      all: popularAll
    });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch popular books' });
  }
});

router.get('/search', authenticate, async (req, res) => {
  try {
    const { query, genre, language, page = 1 } = req.query;
    const limit = 10;
    const skip = (page - 1) * limit;

    let searchCriteria = {};
    if (query) {
      searchCriteria.$text = { $search: query };
    }
    if (genre) {
      searchCriteria.genres = genre;
    }
    if (language) {
      searchCriteria.language = language;
    }

    const books = await Book.find(searchCriteria).skip(skip).limit(limit);
    const total = await Book.countDocuments(searchCriteria);

    let suggestions = [];
    if (books.length === 0 && genre) {
      suggestions = await Book.find({ genres: genre }).limit(3);
    }

    res.send({
      books,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      suggestions: books.length ? [] : suggestions
    });
  } catch (error) {
    res.status(500).send({ error: 'Failed to search books' });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const book = await Book.findOne({ id: req.params.id });
    if (!book) {
      return res.status(404).send({ error: 'Book not found' });
    }
    book.views += 1;
    await book.save();
    res.send(book);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch book' });
  }
});

router.get('/:id/chapter/:chapterIndex', authenticate, async (req, res) => {
  try {
    const book = await Book.findOne({ id: req.params.id });
    if (!book) {
      return res.status(404).send({ error: 'Book not found' });
    }
    const chapterIndex = parseInt(req.params.chapterIndex);
    if (!book.chapter_list.length) {
      return res.send({ chapter: book.full_text, chapters: [], currentIndex: 0 });
    }
    if (chapterIndex < 0 || chapterIndex >= book.chapter_list.length) {
      return res.status(400).send({ error: 'Invalid chapter index' });
    }

    const chapters = book.chapter_list;
    const textParts = book.full_text.split(new RegExp(chapters.join('|'), 'i'));
    const chapterText = textParts[chapterIndex + 1] || 'Chapter content not available';

    res.send({
      chapter: chapterText.trim(),
      chapters,
      currentIndex: chapterIndex
    });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch chapter' });
  }
});

module.exports = router;