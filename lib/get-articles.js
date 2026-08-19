import fs from 'fs';
import path from 'path';

const articlesDirectory = path.join(process.cwd(), 'content/articles');

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { data: {}, body: content };

  const frontmatter = match[1];
  const body = match[2].trim();
  const data = {};

  frontmatter.split('\n').forEach((line) => {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;
    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();
    // Remove surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  });

  // Split body into Kannada and English if separator exists
  const parts = body.split(/\n---\n\n\*\*English version\*\*\n\n/);
  data.body_kn = parts[0] || body;
  data.body_en = parts[1] || '';

  return { data, body };
}

function getAllMarkdownFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;

  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getAllMarkdownFiles(filePath, fileList);
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

export function getAllArticles() {
  const files = getAllMarkdownFiles(articlesDirectory);

  const articles = files.map((filePath) => {
    const content = fs.readFileSync(filePath, 'utf8');
    const { data } = parseFrontmatter(content);

    return {
      slug: data.slug || path.basename(filePath, '.md'),
      title: { kn: data.title || '', en: data.title_en || data.title || '' },
      excerpt: { kn: data.excerpt || '', en: data.excerpt || '' },
      category: data.category || 'ಕರ್ನಾಟಕ',
      date: data.date || new Date().toISOString(),
      docket: data.docket || '',
      bureau: data.bureau || 'ಬೆಂಗಳೂರು ಬ್ಯೂರೋ',
      body: { kn: data.body_kn || '', en: data.body_en || '' },
      source: 'markdown',
    };
  });

  // Newest first
  return articles.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getArticleBySlug(slug) {
  const articles = getAllArticles();
  return articles.find((a) => a.slug === slug) || null;
}
