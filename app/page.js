'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Masthead from '../components/Masthead';
import Footer from '../components/Footer';
import { CategoryCard, NoticeBand } from '../components/ArticleCard';
import { useLang, t } from '../lib/lang-context';
import { strings } from '../lib/strings';
import { categories } from '../lib/categories';

export default function HomePage() {
  const { lang } = useLang();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/articles')
      .then((res) => res.json())
      .then((data) => {
        setArticles(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const lead = articles[0] || null;
  const secondary = articles.slice(1, 5);
  const byCategory = (en) =>
    articles.filter((a) => a.category?.en === en || a.category === en);
  const categoriesWithContent = categories.filter(
    (c) => byCategory(c.label.en).length > 0
  );

  if (loading) {
    return (
      <>
        <Masthead />
        <main style={{ padding: '60px 20px', textAlign: 'center' }}>
          <p>Loading articles…</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Masthead />
      <div className="shell">
        {/* Hero */}
        {lead ? (
          <section className="hero">
            <div className="hero-content">
              <span className="badge">{t(strings.breaking, lang)}</span>
              <h1 className="hero-headline kn">
                <Link href={`/article/${lead.slug}`}>
                  {t(lead.title, lang)}
                </Link>
              </h1>
              <p className="hero-dek kn">{t(lead.excerpt || lead.dek, lang)}</p>
              <div className="hero-meta">
                <span>{t(lead.bureau, lang)}</span>
                <span>•</span>
                <span>{lead.docket}</span>
              </div>
            </div>
          </section>
        ) : (
          <section className="hero">
            <div className="hero-content">
              <h1 className="hero-headline kn">
                {lang === 'kn' ? 'ಸುದ್ದಿ ಬರುತ್ತಿದೆ…' : 'News coming soon…'}
              </h1>
            </div>
          </section>
        )}

        {/* Latest news grid */}
        <section>
          <div className="section-head">
            <div className="section-title">
              <span className="dot"></span>
              <h2 className="kn">
                {lang === 'kn' ? 'ಇತ್ತೀಚಿನ ಸುದ್ದಿ' : 'Latest News'}
              </h2>
            </div>
          </div>
          <div className="secondary-grid">
            {secondary.map((article) => (
              <article key={article.slug}>
                <span className="tag mono kn">
                  {t(article.tag || article.category, lang)}
                </span>
                <h3 className="sec-headline kn">
                  <Link href={`/article/${article.slug}`}>
                    {t(article.title, lang)}
                  </Link>
                </h3>
                <p className="sec-dek kn">
                  {t(article.excerpt || article.dek, lang)}
                </p>
                <div className="docket">
                  <span>{t(article.category, lang)}</span>
                  <span>{article.docket}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <NoticeBand />

        {/* Feature strip */}
        <section className="feature-strip">
          <div className="feature">
            <span className="mini">
              {lang === 'kn' ? 'ನೆಲಮಟ್ಟದ ವರದಿ' : 'GROUND REPORT'}
            </span>
            <h3 className="kn">
              {lang === 'kn'
                ? 'ಜನರ ಧ್ವನಿ, ನೇರ ವರದಿ'
                : "The People's Voice, Direct Reporting"}
            </h3>
            <p className="kn">
              {lang === 'kn'
                ? 'ಸ್ಥಳೀಯ ಸಮಸ್ಯೆಗಳಿಂದ ರಾಜ್ಯದ ದೊಡ್ಡ ನಿರ್ಧಾರಗಳವರೆಗೆ — ನೆಲಮಟ್ಟದ ವರದಿಗೆ ಆದ್ಯತೆ.'
                : 'From local issues to major state decisions — we prioritize ground-level reporting.'}
            </p>
          </div>
          <div className="feature">
            <span className="mini">
              {lang === 'kn' ? 'ವಿವರಣೆ' : 'EXPLAINER'}
            </span>
            <h3 className="kn">
              {lang === 'kn' ? 'ಸುದ್ದಿಯ ಹಿಂದೆ ಏನಿದೆ?' : "What's Behind the News?"}
            </h3>
            <p className="kn">
              {lang === 'kn'
                ? 'ಸಂಕೀರ್ಣ ವಿಷಯಗಳನ್ನು ಸರಳವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.'
                : 'Understand complex issues, explained simply.'}
            </p>
          </div>
          <div className="feature">
            <span className="mini">
              {lang === 'kn' ? 'ಅಭಿಪ್ರಾಯ' : 'OPINION'}
            </span>
            <h3 className="kn">
              {lang === 'kn' ? 'ಚರ್ಚೆಗೆ ವೇದಿಕೆ' : 'A Platform for Debate'}
            </h3>
            <p className="kn">
              {lang === 'kn'
                ? 'ವಿಷಯಾಧಾರಿತ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಸಾರ್ವಜನಿಕ ಅಭಿಪ್ರಾಯ.'
                : 'Issue-based analysis and public opinion.'}
            </p>
          </div>
        </section>

        {/* Category sections */}
        {categoriesWithContent.map((cat, i) => (
          <section
            className="category-block"
            id={cat.slug}
            key={cat.slug}
            style={i > 0 ? { borderTop: '1px solid var(--line)' } : undefined}
          >
            <div className="category-rule">
              <h2 className="kn-display">{t(cat.label, lang)}</h2>
              <div className={`line ${i % 2 === 1 ? 'gold' : ''}`} />
            </div>
            <div className="card-row">
              {byCategory(cat.label.en).map((a) => (
                <CategoryCard key={a.slug} article={a} />
              ))}
            </div>
          </section>
        ))}
      </div>
      <Footer />
    </>
  );
}
