'use client';

import Link from 'next/link';
import { useLang, t } from '../lib/lang-context';
import { strings } from '../lib/strings';

export function SecondaryCard({ article }) {
  const { lang } = useLang();
  return (
    <article>
      <span className="tag">{t(article.tag, lang)}</span>
      <h3 className="sec-headline kn">
        <Link href={`/article/${article.slug}`}>{t(article.title, lang)}</Link>
      </h3>
      <p className="sec-dek kn">{t(article.dek, lang)}</p>
      <span className="docket">{article.docket}</span>
    </article>
  );
}

export function CategoryCard({ article }) {
  const { lang } = useLang();
  return (
    <div className="card">
      <span className="tag mono">{t(article.tag, lang)}</span>
      <h3 className="kn">
        <Link href={`/article/${article.slug}`}>{t(article.title, lang)}</Link>
      </h3>
      <p className="kn">{t(article.dek, lang)}</p>
      <div className="docket">
        <span>{t(article.category, lang)}</span>
        <span>{article.docket}</span>
      </div>
    </div>
  );
}

export function RelatedCard({ article }) {
  const { lang } = useLang();
  return (
    <Link href={`/article/${article.slug}`} className="related-card">
      <span className="tag">{t(article.tag, lang)}</span>
      <h4 className="kn">{t(article.title, lang)}</h4>
      <span className="docket">{article.docket}</span>
    </Link>
  );
}

export function NoticeBand() {
  const { lang } = useLang();
  return (
    <div className="notice-band">
      <span className="stamp-mini mono">{t(strings.notice ? { kn: 'ಸೂಚನೆ', en: 'NOTICE' } : {}, lang)}</span>
      <p className="kn">{t(strings.notice, lang)}</p>
    </div>
  );
}
