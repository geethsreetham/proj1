const axios = require('axios');
const cheerio = require('cheerio');
const Book = require('./models/Book');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithRetry = async (url, retries = 3, delayMs = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      return response;
    } catch (err) {
      if (i === retries - 1) throw err;
      console.log(`Request failed for ${url}. Retrying (${i + 1}/${retries})... Error: ${err.message}`);
      await delay(delayMs);
    }
  }
};

const scrapeWuxiaWorld = async () => {
  try {
    console.log('Starting WuxiaWorld scrape for Chinese and Korean light novels...');
    let books = [];
    const url = 'https://www.wuxiaworld.com/novels';
    let response;
    try {
      response = await fetchWithRetry(url);
    } catch (err) {
      console.error(`Failed to fetch WuxiaWorld novels page: ${err.message}`);
      return 0;
    }
    const $ = cheerio.load(response.data);
    const novelCards = $('.novel-item');
    for (let i = 0; i < novelCards.length && books.length < 20; i++) {
      const el = novelCards[i];
      const title = $(el).find('.novel-title').text().trim();
      const link = 'https://www.wuxiaworld.com' + $(el).find('a').attr('href');
      const cover = $(el).find('img').attr('src') || '/assets/placeholder.jpg';
      const author = $(el).find('.novel-author').text().replace('Author:', '').trim() || 'Unknown';
      const genres = $(el).find('.novel-tags .tag').map((i, tag) => $(tag).text().trim()).get();
      let description = '';
      // Fetch novel detail page for description
      try {
        const detailRes = await fetchWithRetry(link);
        const $$ = cheerio.load(detailRes.data);
        description = $$('.novel-body .desc-text').first().text().trim();
      } catch (err) {
        description = '';
      }
      books.push({
        id: `ww_${title.replace(/\s+/g, '_').toLowerCase()}`,
        title,
        author: [author],
        genres,
        language: 'Chinese/Korean',
        publication_date: '',
        description,
        source_url: link,
        full_text: '',
        chapter_list: [],
        cover,
        price: Math.floor(Math.random() * 10) + 1
      });
      await delay(1500);
    }
    let insertedCount = 0;
    for (const book of books) {
      const existingBook = await Book.findOne({ id: book.id });
      if (!existingBook) {
        await Book.create(book);
        insertedCount++;
        console.log(`Inserted novel: ${book.title}`);
      } else {
        console.log(`Novel already exists: ${book.title}`);
      }
    }
    console.log(`Inserted ${insertedCount} new novels`);
    return insertedCount;
  } catch (error) {
    console.error('Scrape error:', error.message);
    throw error;
  }
};

module.exports = { scrapeWuxiaWorld };