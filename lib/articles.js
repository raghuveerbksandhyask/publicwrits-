import { getAllArticles, getArticleBySlug as getMdArticle } from './get-articles';

// Keep a few static sample articles as fallback
const staticArticles = [
  // You can leave this empty later
];

export function getAllArticlesCombined() {
  try {
    const mdArticles = getAllArticles();
    return [...mdArticles, ...staticArticles];
  } catch (e) {
    return staticArticles;
  }
}

export function getArticleBySlug(slug) {
  try {
    const md = getMdArticle(slug);
    if (md) return md;
  } catch (e) {}
  return staticArticles.find((a) => a.slug === slug) || null;
}

export function getLeadArticle() {
  const all = getAllArticlesCombined();
  return all[0] || null;
}

export function getSecondaryArticles() {
  const all = getAllArticlesCombined();
  return all.slice(1, 5);
}

export function getRelated(slug, limit = 3) {
  const all = getAllArticlesCombined();
  return all.filter((a) => a.slug !== slug).slice(0, limit);
}

export const articles = getAllArticlesCombined();
