import {
  Baloo_Tamma_2,
  Noto_Sans_Kannada,
  Fraunces,
  Source_Serif_4,
  JetBrains_Mono,
} from 'next/font/google';
import './globals.css';
import { LangProvider } from '../lib/lang-context';

const balooTamma = Baloo_Tamma_2({
  subsets: ['kannada', 'latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display-kn',
  display: 'swap',
});

const notoSansKannada = Noto_Sans_Kannada({
  subsets: ['kannada'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-body-kn',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display-en',
  display: 'swap',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-body-en',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: 'Publicwrits — ಸತ್ಯ · ದಾಖಲೆ · ಜನಹಿತ',
  description: 'Independent news and public-record reporting from Karnataka, in Kannada and English.',
  metadataBase: new URL('https://publicwrits.com'),
};

export default function RootLayout({ children }) {
  return (
    <html lang="kn">
      <body
        className={[
          balooTamma.variable,
          notoSansKannada.variable,
          fraunces.variable,
          sourceSerif.variable,
          jetbrainsMono.variable,
        ].join(' ')}
      >
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
