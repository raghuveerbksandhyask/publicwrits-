import Parser from 'rss-parser';
import * as cheerio from 'cheerio';

const RSS_FEEDS = [
  {
    name: 'The Hindu Karnataka',
    url: 'https://www.thehindu.com/news/national/karnataka/feeder/default.rss',
  },
  {
    name: 'Deccan Herald',
    url: 'https://www.deccanherald.com/rss-feed',
  },
];

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'PublicWritsBot/1.0 (+https://publicwrits.com)',
  },
});

/**
 * Fetch recent items from RSS feeds + a basic government/court scrape.
 * Returns an array of RawItem objects.
 */
export async function fetchSources() {
  const items = [];

  // 1. RSS feeds
  for (const feed of RSS_FEEDS) {
    try {
      const result = await parser.parseURL(feed.url);
      for (const entry of (result.items || []).slice(0, 3)) {
        items.push({
          title: entry.title || '',
          link: entry.link || '',
          content: entry.contentSnippet || entry.content || entry.summary || '',
          source: feed.name,
          published: entry.pubDate || entry.isoDate,
        });
      }
    } catch (err) {
      console.error(`RSS error (${feed.name}):`, err.message);
    }
  }

  // 2. Basic High Court / government notifications scrape
  try {
    const courtItems = await scrapeHighCourtNotifications();
    items.push(...courtItems);
  } catch (err) {
    console.error('Scrape error:', err.message);
  }

  // Newest first, limited
  return items.slice(0, 8);
}

async function scrapeHighCourtNotifications() {
  const url = 'https://karnatakahighcourt.kar.nic.in/';
  const res = await fetch(url, {
    headers: { 'User-Agent': 'PublicWritsBot/1.0 (+https://publicwrits.com)' },
  });

  if (!res.ok) return [];

  const html = await res.text();
  const $ = cheerio.load(html);
  const items = [];

  $('a').each((_, el) => {
    const text = $(el).text().trim();
    const href = $(el).attr('href');
    if (
      text.length > 25 &&
      href &&
      (text.toLowerCase().includes('notification') ||
        text.toLowerCase().includes('circular') ||
        text.toLowerCase().includes('order'))
    ) {
      items.push({
        title: text,
        link: href.startsWith('http')
          ? href
          : `https://karnatakahighcourt.kar.nic.in/${href.replace(/^\//, '')}`,
        content: text,
        source: 'Karnataka High Court',
      });
    }
  });

  return items.slice(0, 3);
}
