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
    hour: '2-digit',
    minute: '2-digit',
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

  const title = t(article.title, lang);
  const body = lang === 'kn' ? article.body?.kn : article.body?.en;
  const excerpt = t(article.excerpt, lang);

  return (
    <>
      <Masthead />
      <main className="shell" style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ marginBottom: '12px' }}>
          <Link href="/" style={{ fontSize: '14px', color: '#64748b' }}>
            ← {lang === 'kn' ? 'ಮುಖಪುಟ' : 'Home'}
          </Link>
        </div>

        <div style={{ marginBottom: '8px', fontSize: '13px', color: '#64748b' }}>
          <span>{article.category}</span>
          {article.docket && (
            <>
              <span> · </span>
              <span>{article.docket}</span>
            </>
          )}
        </div>

        <h1
          className="kn"
          style={{
            fontSize: '28px',
            lineHeight: 1.35,
            fontWeight: 700,
            margin: '0 0 16px',
          }}
        >
          {title}
        </h1>

        {excerpt && (
          <p style={{ fontSize: '17px', color: '#475569', marginBottom: '20px' }}>
            {excerpt}
          </p>
        )}

        <div
          style={{
            fontSize: '13px',
            color: '#64748b',
            marginBottom: '28px',
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          <span>{article.bureau}</span>
          <span>·</span>
          <span>{formatDate(article.date, lang)}</span>
        </div>

        <div
          className="kn"
          style={{
            fontSize: '17px',
            lineHeight: 1.75,
            whiteSpace: 'pre-wrap',
          }}
        >
          {body || 'No content available.'}
        </div>
      </main>
      <Footer />
    </>
  );
}
