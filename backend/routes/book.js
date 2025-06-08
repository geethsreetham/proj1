const express = require('express');
const router = express.Router();
const axios = require('axios');
const Book = require('../models/Book');
const jwt = require('jsonwebtoken');

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

const fallbackBooks = [
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    isbn: '9780141439518',
    description: 'A classic romance novel.',
    cover: 'https://covers.openlibrary.org/b/id/9741144-L.jpg',
    content: 'It is a truth universally acknowledged, that a single man in possession...'
  },
  {
    title: '1984',
    author: 'George Orwell',
    isbn: '9780451524935',
    description: 'A dystopian novel about totalitarianism.',
    cover: 'https://covers.openlibrary.org/b/id/1111111-L.jpg',
    content: 'It was a bright cold day in April, and the clocks were striking thirteen...'
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '9780446310789',
    description: 'A story of racial injustice and the loss of innocence.',
    cover: 'https://covers.openlibrary.org/b/id/1122311-L.jpg',
    content: 'When he was nearly thirteen, my brother Jem got his arm badly broken...'
  }
];

router.get('/populate', async (req, res) => {
  try {
    let books = [];
    try {
      const response = await axios.get('https://openlibrary.org/search.json?q=fiction&limit=10&fields=title,author_name,isbn,cover_i,first_sentence');
      books = response.data.docs.filter(book => book.isbn && book.isbn.length > 0); // Ensure ISBN exists
      console.log('Fetched books:', books.length);
    } catch (apiError) {
      console.error('Open Library API error:', apiError.message);
      books = fallbackBooks;
    }

    let insertedCount = 0;
    for (const book of books) {
      try {
        const existingBook = await Book.findOne({ isbn: book.isbn ? book.isbn[0] : null });
        if (!existingBook) {
          await Book.create({
            title: book.title,
            author: book.author_name ? book.author_name.join(', ') : book.author || 'Unknown',
            description: book.description || 'No description available',
            cover: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : book.cover || '',
            isbn: book.isbn ? book.isbn[0] : null,
            content: book.first_sentence ? book.first_sentence.join(' ') : book.content || ''
          });
          insertedCount++;
        }
      } catch (error) {
        console.error(`Error saving book ${book.title}:`, error.message);
        continue; // Skip to next book on error
      }
    }
    res.send(`Populated ${insertedCount} books`);
  } catch (error) {
    console.error('Population error:', error.message);
    res.status(500).send({ error: 'Failed to populate books' });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const books = await Book.find();
    res.send(books);
  } catch (error) {
    console.error('Fetch books error:', error.message);
    res.status(500).send({ error: 'Failed to fetch books' });
  }
});

router.get('/:isbn', authenticate, async (req, res) => {
  try {
    const book = await Book.findOne({ isbn: req.params.isbn });
    if (!book) {
      return res.status(404).send({ error: 'Book not found' });
    }
    res.send(book);
  } catch (error) {
    console.error('Fetch book error:', error.message);
    res.status(500).send({ error: 'Failed to fetch book' });
  }
});

module.exports = router;