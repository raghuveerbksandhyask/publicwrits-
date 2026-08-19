'use client';

import { use } from 'react';
import Link from 'next/link';
import Masthead from '../../../components/Masthead';
import Footer from '../../../components/Footer';
import { RelatedCard } from '../../../components/ArticleCard';
import { useLang, t } from '../../../lib/lang-context';
import { strings } from '../../../lib/strings';
import { getArticleBySlug, getRelated } from '../../../lib/articles';

function formatDate(dateStr, lang) {
  const d = new Date(dateStr);
  return d.toLocaleString(lang === 'kn' ? 'kn-IN' : 'en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ArticlePage({ params }) {
  const { slug } = use(params);
  const { lang } = useLang();
  const article = getArticleBySlug(slug);

  if (!article) {
    return (
      <>
        <Masthead />
        <main>
          <div className="article-page">
            <p className="kn" style={{ fontSize: 18 }}>
              {lang === 'kn' ? 'ಈ ಡಾಕೆಟ್ ಕಂಡುಬಂದಿಲ್ಲ.' : 'This docket could not be found.'}
            </p>
            <Link href="/" className="back-link">{t(strings.backHome, lang)}</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const related = getRelated(slug, 3);

  return (
    <>
      <Masthead />
      <main>
        <div className="article-page">
          <Link href="/" className="back-link">{t(strings.backHome, lang)}</Link>

          <header className="article-header">
            <span className="tag">{t(article.tag, lang)}</span>
            <h1 className="article-title kn">{t(article.title, lang)}</h1>
            <p className="article-dek">{t(article.dek, lang)}</p>

            <div className="article-meta-grid">
              <div>
                <span className="label">{t(strings.docketLabel, lang)}</span>
                <span className="value mono">{article.docket}</span>
              </div>
              <div>
                <span className="label">{t(strings.filedUnder, lang)}</span>
                <span className="value kn">{t(article.category, lang)}</span>
              </div>
              <div>
                <span className="label">{t(strings.byBureau, lang)}</span>
                <span className="value kn">{t(article.bureau, lang)}</span>
              </div>
              <div>
                <span className="label">{t(strings.publishedOn, lang)}</span>
                <span className="value">{formatDate(article.date, lang)}</span>
              </div>
            </div>
          </header>

          <div className="article-body">
            {article.body.map((para, i) => (
              <p key={i} className="kn">{t(para, lang)}</p>
            ))}
          </div>

          {related.length > 0 && (
            <section className="related-section">
              <div className="category-rule">
                <h2 className="kn-display">{t(strings.relatedStories, lang)}</h2>
                <div className="line" />
              </div>
              <div className="related-grid">
                {related.map((r) => (
                  <RelatedCard key={r.slug} article={r} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
