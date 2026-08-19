// Temporary static fallback – Markdown articles are now loaded via /api/articles
const staticArticles = [];

export function getArticleBySlug(slug) {
  return staticArticles.find((a) => a.slug === slug) || null;
}

export function getLeadArticle() {
  return staticArticles[0] || null;
}

export function getSecondaryArticles() {
  return staticArticles.slice(1, 5);
}

export function getRelated(slug, limit = 3) {
  return staticArticles.filter((a) => a.slug !== slug).slice(0, limit);
}

export const articles = staticArticles;
