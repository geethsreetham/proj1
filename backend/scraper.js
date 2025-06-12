const axios = require('axios');
const cheerio = require('cheerio');
const Book = require('./models/Book');

// Increase delay to 5 seconds to avoid rate-limiting
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Retry logic for failed requests
const fetchWithRetry = async (url, retries = 3, delayMs = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url, {
        timeout: 10000, // 10-second timeout
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      return response;
    } catch (err) {
      if (i === retries - 1) throw err; // Last retry failed, throw the error
      console.log(`Request failed for ${url}. Retrying (${i + 1}/${retries})... Error: ${err.message}`);
      await delay(delayMs);
    }
  }
};

const scrapeGutenberg = async () => {
  try {
    console.log('Starting Gutenberg scrape...');
    let books = [];
    let startIndex = 1;
    const booksPerPage = 25;

    while (books.length < 10) { // Keep it at 10 for testing
      console.log(`Fetching books starting at index ${startIndex}...`);
      const url = `https://www.gutenberg.org/ebooks/search/?sort_order=downloads&start_index=${startIndex}`;
      let response;
      try {
        response = await fetchWithRetry(url);
      } catch (err) {
        console.error(`Failed to fetch book list page at index ${startIndex}: ${err.message}`);
        break; // Skip to the end if the main page fails
      }

      const $ = cheerio.load(response.data);
      const bookLinks = $('li.booklink');
      console.log(`Found ${bookLinks.length} book links on this page`);
      if (bookLinks.length === 0) break;

      for (const bookLink of bookLinks) {
        const link = $(bookLink).find('a').attr('href');
        const id = link.split('/').pop();
        const title = $(bookLink).find('.title').text().trim();
        let author = $(bookLink).find('.subtitle').text().trim().split(', ');

        author = Array.isArray(author) && author.length ? author.filter(a => a) : ['Unknown'];
        console.log(`Processing book: ${title} by ${author.join(', ')}`);

        const bookUrl = `https://www.gutenberg.org${link}`;
        let bookResponse;
        try {
          bookResponse = await fetchWithRetry(bookUrl);
        } catch (err) {
          console.error(`Failed to fetch book page for ${title}: ${err.message}`);
          continue; // Skip this book and continue with the next one
        }

        const bookPage = cheerio.load(bookResponse.data);
        const genres = [];
        bookPage('td[property="dcterms:subject"] a').each((_, el) => {
          genres.push(bookPage(el).text().trim());
        });

        const language = bookPage('td[property="dcterms:language"]').text().trim() || 'English';
        const publication_date = bookPage('td[property="dcterms:issued"]').text().trim();
        const description = bookPage('div.book_description').text().trim() || '';

        let full_text = '';
        let chapter_list = [];
        const htmlLink = bookPage('a[type="text/html"]').attr('href');
        if (htmlLink) {
          const textUrl = `https://www.gutenberg.org${htmlLink}`;
          try {
            const textResponse = await fetchWithRetry(textUrl);
            const textPage = cheerio.load(textResponse.data);
            full_text = textPage('body').text().trim();

            textPage('h2, h3').each((_, el) => {
              const chapter = textPage(el).text().trim();
              if (chapter) chapter_list.push(chapter);
            });
          } catch (err) {
            console.error(`Failed to fetch HTML text for ${title}: ${err.message}`);
          }
        } else {
          const txtLink = bookPage('a[type="text/plain"]').attr('href');
          if (txtLink) {
            const textUrl = `https://www.gutenberg.org${txtLink}`;
            try {
              const textResponse = await fetchWithRetry(textUrl);
              full_text = textResponse.data;
            } catch (err) {
              console.error(`Failed to fetch plain text for ${title}: ${err.message}`);
            }
          }
        }

        let cover = '/assets/placeholder.jpg';
        const olSearchUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(title)}+${encodeURIComponent(author[0] || '')}`;
        try {
          const olResponse = await fetchWithRetry(olSearchUrl);
          const olData = olResponse.data.docs[0];
          if (olData && olData.cover_i) {
            cover = `https://covers.openlibrary.org/b/id/${olData.cover_i}-M.jpg`;
          }
        } catch (err) {
          console.log(`Failed to fetch cover for ${title}: ${err.message}`);
        }

        const price = Math.floor(Math.random() * 10) + 1;

        books.push({
          id: `pg${id}`,
          title,
          author,
          genres,
          language,
          publication_date,
          description,
          source_url: bookUrl,
          full_text,
          chapter_list,
          cover,
          price
        });

        await delay(5000); // Increased delay to 5 seconds
      }

      startIndex += booksPerPage;
      await delay(5000);
    }

    let insertedCount = 0;
    for (const book of books) {
      const existingBook = await Book.findOne({ id: book.id });
      if (!existingBook) {
        await Book.create(book);
        insertedCount++;
        console.log(`Inserted book: ${book.title}`);
      } else {
        console.log(`Book already exists: ${book.title}`);
      }
    }
    console.log(`Inserted ${insertedCount} new books`);
    return insertedCount;
  } catch (error) {
    console.error('Scrape error:', error.message);
    throw error;
  }
};

module.exports = { scrapeGutenberg };