const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
const { scrapeWuxiaWorld } = require('./scraper');
const { scrapeLightNovels } = require('./puppeteerScraper');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/novelink')
  .then(() => {
    console.log('MongoDB connected');
    scrapeWuxiaWorld().catch(err => console.error('Initial scrape error:', err));
  })
  .catch((err) => console.log('MongoDB error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/user', userRoutes);

// New endpoint for light novels
app.get('/api/novels', async (req, res) => {
  console.log('GET /api/novels called');
  try {
    const novels = await scrapeLightNovels();
    res.json({ novels });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch novels', details: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));