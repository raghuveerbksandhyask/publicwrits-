'use client';

import { use } from 'react';
import Link from 'next/link';
import Masthead from '../../../components/Masthead';
import Footer from '../../../components/Footer';
import { CategoryCard } from '../../../components/ArticleCard';
import { useLang, t } from '../../../lib/lang-context';
import { categories } from '../../../lib/categories';
import { articles } from '../../../lib/articles';

export default function CategoryPage({ params }) {
  const { slug } = use(params);
  const { lang } = useLang();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return (
      <>
        <Masthead />
        <main>
          <div className="article-page">
            <p className="kn" style={{ fontSize: 18 }}>
              {lang === 'kn' ? 'ಈ ವಿಭಾಗ ಕಂಡುಬಂದಿಲ್ಲ.' : 'This section could not be found.'}
            </p>
            <Link href="/" className="back-link">
              {lang === 'kn' ? '← ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ' : '← Back to homepage'}
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const items = articles.filter((a) => a.category.en === category.label.en);

  return (
    <>
      <Masthead />
      <main>
        <div className="category-block">
          <div className="category-rule">
            <h2 className="kn-display">{t(category.label, lang)}</h2>
            <div className="line" />
          </div>

          {items.length === 0 ? (
            <p className="kn" style={{ color: 'var(--ink-soft)', fontSize: 15 }}>
              {lang === 'kn'
                ? 'ಈ ವಿಭಾಗದಲ್ಲಿ ಇನ್ನೂ ವರದಿಗಳಿಲ್ಲ. ಶೀಘ್ರದಲ್ಲೇ ಸೇರಿಸಲಾಗುವುದು.'
                : 'No stories in this section yet. Check back soon.'}
            </p>
          ) : (
            <div className="card-row">
              {items.map((a) => (
                <CategoryCard key={a.slug} article={a} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
