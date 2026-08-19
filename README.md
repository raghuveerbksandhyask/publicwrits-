# Publicwrits

Independent Kannada/English news site. Built with Next.js 15 (App Router).

## What's included

- **Homepage** (`app/page.js`) — lead story, secondary grid, notice band, four category sections (Politics, Karnataka & Local, Economy, Opinion)
- **Article template** (`app/article/[slug]/page.js`) — dynamic route, works for any slug in `lib/articles.js`
- **Working KN/EN toggle** — top-right of the nav bar. Swaps every headline, dek, body paragraph, and UI label; remembers your choice via `localStorage` and updates `<html lang>` for accessibility/SEO
- **Design system** in `app/globals.css` — the docket/gazette visual identity (seal stamps, docket numbers, dotted tear-lines) carried over from the prototype
- Sample content: 6 bilingual placeholder articles in `lib/articles.js` — replace with real reporting before launch

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Adding a real article

Open `lib/articles.js` and add an object to the `articles` array following the existing shape — every text field is a `{ kn: '...', en: '...' }` pair. The homepage and article page pick it up automatically; no other code changes needed. Give it a unique `slug` — that becomes the URL: `/article/your-slug`.

## Deploying to publicwrits.com (Vercel — recommended)

1. Push this folder to a GitHub repo.
2. Go to [vercel.com](https://vercel.com), "Add New Project," import the repo. Vercel auto-detects Next.js — no config needed.
3. Deploy. You'll get a `*.vercel.app` URL first.
4. In the Vercel project → **Settings → Domains**, add `publicwrits.com` (and `www.publicwrits.com`).
5. At your domain registrar, point the DNS records Vercel gives you (usually an `A` record to `76.76.21.21` and a `CNAME` for `www`). Propagation typically takes anywhere from a few minutes to a few hours.
6. Once DNS resolves, Vercel auto-issues an SSL certificate — the site will be live at `https://publicwrits.com`.

Alternative hosts (Netlify, Cloudflare Pages) work too — all support Next.js with a similar "import repo → add custom domain" flow.

## Next steps worth considering before launch

- Replace placeholder articles with real reporting
- Add a real CMS or admin flow if non-developers will be publishing (options: Sanity, Contentful, or a simple Markdown-file-based setup)
- Add an `/about`, `/editorial-policy`, and `/contact` page (currently linked in the footer but not built)
- Add Open Graph / social share images per article
- Consider server-side rendering the KN/EN choice from a cookie instead of client-only localStorage, so search engines and first paint reflect language properly
