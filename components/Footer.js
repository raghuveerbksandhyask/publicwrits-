'use client';

import Link from 'next/link';
import { useLang, t } from '../lib/lang-context';
import { strings } from '../lib/strings';

export default function Footer() {
  const { lang } = useLang();

  return (
    <footer>
      <div className="footer-inner">
        <div>
          <div className="public-writs-logo">
            <span className="logo-public">PUBLIC</span>
            <span className="logo-writs">WRITS</span>
          </div>
          <p className="kn brand-tagline" style={{ display: 'block', fontSize: 12, marginTop: 22 }}>
            {t(strings.tagline, lang)}
          </p>
          <p className="kn">{t(strings.footer.description, lang)}</p>
        </div>
        <div className="footer-col">
          <h4>{t(strings.footer.sections, lang)}</h4>
          <Link href="/category/politics" className="kn">{t(strings.nav.politics, lang)}</Link>
          <Link href="/category/karnataka" className="kn">{t(strings.nav.karnataka, lang)}</Link>
          <Link href="/category/economy" className="kn">{t(strings.nav.economy, lang)}</Link>
          <Link href="/category/opinion" className="kn">{t(strings.nav.opinion, lang)}</Link>
        </div>
        <div className="footer-col">
          <h4>{t(strings.footer.masthead, lang)}</h4>
          <Link href="/about" className="kn">{t(strings.footer.about, lang)}</Link>
          <Link href="/editorial-policy" className="kn">{t(strings.footer.editorialPolicy, lang)}</Link>
          <Link href="/contact" className="kn">{t(strings.footer.contact, lang)}</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>{t(strings.footer.rights, lang)}</span>
        <span>{t(strings.footer.registration, lang)}</span>
      </div>
    </footer>
  );
}
