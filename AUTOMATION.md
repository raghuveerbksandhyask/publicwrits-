# PublicWrits Automation

## What was added

1. **Admin page** – `/admin/generate`
   - Password-protected one-click article generator

2. **Cron API** – `/api/cron/generate-news`
   - Runs every 2 hours (configured in `vercel.json`)
   - Fetches RSS + basic government scrape
   - Uses Grok (xAI) to write bilingual Kannada + English articles
   - Commits the resulting Markdown file to the GitHub repo

3. **Source fetcher** – `lib/fetch-sources.js`
   - RSS feeds (The Hindu Karnataka, Deccan Herald)
   - Basic Karnataka High Court notifications scraper

4. **vercel.json**
   - Cron schedule: every 2 hours

## Required Environment Variables (Vercel → Settings → Environment Variables)

| Name            | Value                                      |
|-----------------|--------------------------------------------|
| XAI_API_KEY     | Your Grok / xAI API key                    |
| GITHUB_TOKEN    | Classic GitHub PAT with `repo` scope       |
| CRON_SECRET     | Any strong password (e.g. PublicWrits-Secret-2026) |
| GITHUB_OWNER    | raghuveerbksandhyask (optional)            |
| GITHUB_REPO     | publicwrits- (optional)                    |

## How to use

1. Push this project to the GitHub repo connected to Vercel
2. Add the environment variables above
3. Redeploy
4. Visit https://www.publicwrits.com/admin/generate
5. Enter the CRON_SECRET and click Generate
