import axios from 'axios';
import cheerio from 'cheerio';

export default async function handler(req, res) {
  try {
    const url = 'https://www.pornpics.com/?q=boob';

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ScraperBot/1.0)'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const results = [];

    $('li.thumbwook').each((i, el) => {
      const $el = $(el);
      const link = $el.find('a.rel-link').attr('href');
      const title = $el.find('a.rel-link').attr('title');
      const img = $el.find('img').attr('data-src') || $el.find('img').attr('src');

      results.push({
        link,
        title,
        img,
      });
    });

    res.status(200).json({ results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
