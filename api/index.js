import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

const app = express();
const PORT = 3000;

app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter q' });
  }

  try {
    // Fetch Pornpics search page for the query
    const url = `https://www.pornpics.com/?q=${encodeURIComponent(query)}`;
    const response = await axios.get(url);
    const html = response.data;

    // Load HTML into cheerio
    const $ = cheerio.load(html);

    // Extract images inside <ul id="tiles"> with class .thumbwook
    const results = [];

    $('#tiles li.thumbwook').each((i, elem) => {
      const a = $(elem).find('a.rel-link');
      const img = a.find('img');
      if (!a || !img) return;

      results.push({
        title: a.attr('title') || null,
        link: a.attr('href') || null,
        image: img.attr('data-src') || img.attr('src') || null,
        alt: img.attr('alt') || null,
        width: img.attr('width') || null,
        height: img.attr('height') || null,
      });
    });

    res.json({ query, count: results.length, results });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch or parse data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
