'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLang, t } from '../lib/lang-context';
import { strings } from '../lib/strings';
import { categories } from '../lib/categories';
import { articles } from '../lib/articles';

function formatDate(lang) {
  const d = new Date();
  return d.toLocaleDateString(lang === 'kn' ? 'kn-IN' : 'en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const PRIORITY_COUNT = 3;

export default function Masthead() {
  const { lang, toggleLang } = useLang();
  const [expanded, setExpanded] = useState(false);

  const priorityCategories = categories.slice(0, PRIORITY_COUNT);
  const moreCategories = categories.slice(PRIORITY_COUNT);
  const tickerItems = articles.slice(0, 5).map((a) => t(a.title, lang));

  return (
    <>
      <div className="top-bar">
        <span>PUBLICWRITS.COM</span>
        <span><i className="live-dot"></i>{lang === 'kn' ? 'ಲೈವ್ ಸುದ್ದಿ' : 'LIVE NEWS'}</span>
      </div>

      <div className="shell">
        <header className="masthead">
          <div>
            <Link href="/" className="public-writs-logo" style={{ textDecoration: 'none' }}>
              <span className="logo-public">PUBLIC</span>
              <span className="logo-writs">WRITS</span>
            </Link>
            <span className="brand-tagline kn" style={{ marginTop: 10 }}>{t(strings.tagline, lang)}</span>
          </div>
          <div className="masthead-date kn">{formatDate(lang)}</div>
        </header>

        <div className="nav-wrap">
          {/* Desktop / wide nav */}
          <nav className="primary-nav nav-full">
            <Link href="/" className="kn active">{t(strings.nav.home, lang)}</Link>
            {categories.map((c) => (
              <Link key={c.slug} href={`/category/${c.slug}`} className="kn">
                {t(c.label, lang)}
              </Link>
            ))}
            <button
              type="button"
              className="lang-toggle"
              onClick={toggleLang}
              aria-label="Toggle language between Kannada and English"
            >
              <span className={lang === 'kn' ? 'lang-active' : ''}>KN</span>
              <span>/</span>
              <span className={lang === 'en' ? 'lang-active' : ''}>EN</span>
            </button>
          </nav>

          {/* Mobile nav: top 3 + expandable "More" */}
          <nav className="primary-nav nav-compact">
            <Link href="/" className="kn active">{t(strings.nav.home, lang)}</Link>
            {priorityCategories.map((c) => (
              <Link key={c.slug} href={`/category/${c.slug}`} className="kn">
                {t(c.label, lang)}
              </Link>
            ))}
            <button
              type="button"
              className="more-toggle mono"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
            >
              {expanded ? (lang === 'kn' ? '− ಕಡಿಮೆ' : '− Less') : (lang === 'kn' ? '+ ಇನ್ನಷ್ಟು' : '+ More')}
            </button>
          </nav>
        </div>

        {expanded && (
          <div className="more-panel kn">
            {moreCategories.map((c) => (
              <Link key={c.slug} href={`/category/${c.slug}`}>
                {t(c.label, lang)}
              </Link>
            ))}
          </div>
        )}

        <div className="lang-toggle-mobile">
          <button
            type="button"
            className="lang-toggle"
            onClick={toggleLang}
            aria-label="Toggle language between Kannada and English"
          >
            <span className={lang === 'kn' ? 'lang-active' : ''}>KN</span>
            <span>/</span>
            <span className={lang === 'en' ? 'lang-active' : ''}>EN</span>
          </button>
        </div>

        {tickerItems.length > 0 && (
          <div className="ticker">
            <span className="ticker-label mono">{t(strings.breaking, lang)}</span>
            <div className="ticker-viewport">
              <div className="ticker-track kn">
                {tickerItems.join('   •   ')}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
