'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import Masthead from '../../../components/Masthead';
import Footer from '../../../components/Footer';
import { useLang, t } from '../../../lib/lang-context';

function formatDate(dateStr, lang) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleString(lang === 'kn' ? 'kn-IN' : 'en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function ArticlePage({ params }) {
  const { slug } = use(params);
  const { lang } = useLang();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/articles?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) setArticle(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <>
        <Masthead />
        <main style={{ padding: '60px 20px', textAlign: 'center' }}>
          <p>Loading…</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!article) {
    return (
      <>
        <Masthead />
        <main style={{ padding: '60px 20px', textAlign: 'center' }}>
          <h1>Article not found</h1>
          <Link href="/">← Back to home</Link>
        </main>
        <Footer />
      </>
    );
  }

  const title = t(article.title, lang) || article.title?.kn || article.title?.en || '';
  const body = lang === 'kn' 
    ? (article.body?.kn || article.body_kn || '') 
    : (article.body?.en || article.body_en || '');

  return (
    <>
      <Masthead />
      <main className="shell" style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ marginBottom: '12px', fontSize: '13px', color: '#64748b' }}>
          <Link href="/">Home</Link> / {article.category}
        </div>

        <h1 className="kn" style={{ fontSize: '1.8rem', lineHeight: 1.35, marginBottom: '12px' }}>
          {title}
        </h1>

        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
          <span>{article.bureau}</span>
          <span> • </span>
          <span>{article.docket}</span>
          <span> • </span>
          <span>{formatDate(article.date, lang)}</span>
        </div>

        <div 
          className="kn" 
          style={{ fontSize: '1.05rem', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}
        >
          {body}
        </div>

        <div style={{ marginTop: '40px' }}>
          <Link href="/" style={{ color: '#2563eb' }}>
            ← {lang === 'kn' ? 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ' : 'Back to home'}
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
