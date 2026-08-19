'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import Masthead from '../../../components/Masthead';
import Footer from '../../../components/Footer';
import { useLang } from '../../../lib/lang-context';

export default function ArticlePage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams?.slug;
  const { lang } = useLang();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;

    fetch('/api/articles?slug=' + encodeURIComponent(slug))
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (data && !data.error) {
          setArticle(data);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(function () {
        setError(true);
        setLoading(false);
      });
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

  if (error || !article) {
    return (
      <>
        <Masthead />
        <main style={{ padding: '60px 20px', textAlign: 'center' }}>
          <h1>Article not found</h1>
          <p>
            <Link href="/">← Back to home</Link>
          </p>
        </main>
        <Footer />
      </>
    );
  }

  // Safe title extraction
  let title = '';
  if (typeof article.title === 'object') {
    title = lang === 'kn' ? (article.title.kn || article.title.en) : (article.title.en || article.title.kn);
  } else {
    title = article.title || '';
  }

  // Safe body extraction
  let body = '';
  if (article.body && typeof article.body === 'object') {
    body = lang === 'kn' ? (article.body.kn || '') : (article.body.en || '');
  } else {
    body = lang === 'kn' ? (article.body_kn || '') : (article.body_en || '');
  }

  return (
    <>
      <Masthead />
      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ marginBottom: '12px', fontSize: '13px', color: '#64748b' }}>
          <Link href="/">Home</Link>
          {' / '}
          {article.category || ''}
        </div>

        <h1 style={{ fontSize: '1.7rem', lineHeight: 1.4, marginBottom: '12px' }}>
          {title}
        </h1>

        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '28px' }}>
          {article.bureau || ''}
          {article.docket ? ' • ' + article.docket : ''}
        </div>

        <div style={{ fontSize: '1.05rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
          {body}
        </div>

        <div style={{ marginTop: '48px' }}>
          <Link href="/" style={{ color: '#2563eb' }}>
            ← {lang === 'kn' ? 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ' : 'Back to home'}
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
