import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { fetchSources } from '../../../../lib/fetch-sources';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function GET(req) {
  // Security: only allow cron or requests with the correct secret
  const authHeader = req.headers.get('authorization');
  const isCron = req.headers.get('user-agent') === 'vercel-cron/1.0';

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && !isCron) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const rawItems = await fetchSources();

    if (!rawItems || rawItems.length === 0) {
      return NextResponse.json({ message: 'No new items found' });
    }

    // Use the first (most recent) item
    const article = await generateArticleWithAI(rawItems[0]);

    const slug = article.slug;
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const filePath = `content/articles/${year}/${month}/${slug}.md`;

    const markdown = `---
title: "${escapeFrontmatter(article.title_kn)}"
title_en: "${escapeFrontmatter(article.title_en)}"
slug: ${slug}
date: ${date.toISOString()}
category: ${article.category}
docket: PW/${year}/${String(Math.floor(Math.random() * 900000) + 100000)}
bureau: ಬೆಂಗಳೂರು ಬ್ಯೂರೋ
excerpt: "${escapeFrontmatter(article.excerpt)}"
---

${article.body_kn}

---

**English version**

${article.body_en}
`;

    await commitToGitHub(filePath, markdown, `Auto: ${article.title_en}`);

    return NextResponse.json({
      success: true,
      slug,
      path: filePath,
      title: article.title_en,
    });
  } catch (error) {
    console.error('[generate-news]', error);
    return NextResponse.json(
      { error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}

function escapeFrontmatter(str) {
  if (!str) return '';
  return String(str).replace(/"/g, '\\"').replace(/\n/g, ' ');
}

async function generateArticleWithAI(raw) {
 const systemPrompt = `You are a senior investigative editor at PublicWrits (publicwrits.com), an independent Kannada-English news platform focused on Karnataka public records, court proceedings, government transparency, and accountability.

Write high-quality, fully developed news reports. Never write short summaries.

Always reply with ONLY valid JSON (no markdown fences, no explanation) in this exact shape:

{
  "title_kn": "Natural, strong Kannada headline (not a literal translation)",
  "title_en": "Clear, professional English headline",
  "slug": "english-kebab-case-slug",
  "category": "ರಾಜಕೀಯ | ಕರ್ನಾಟಕ | ಸ್ಥಳೀಯ | ಆರ್ಥಿಕತೆ | ಅಭಿಪ್ರಾಯ",
  "excerpt": "One natural sentence in Kannada that captures the core of the story",
  "body_kn": "Full detailed article in natural, fluent Kannada (minimum 6-9 paragraphs)",
  "body_en": "Full detailed article in clear, professional English (minimum 6-9 paragraphs)"
}

Writing rules:

1. Structure the article properly:
   - Opening: What happened + who + where + when
   - Middle: Background, key details, official statements, what the records show
   - Context: Why this matters for the public
   - Closing: Current status or next steps

2. Kannada (body_kn):
   - Write natural, human Kannada — the way a good reporter would write for Prajavani or The Hindu Kannada
   - Avoid stiff, machine-like translation
   - Use proper journalistic Kannada vocabulary

3. English (body_en):
   - Clear, formal but readable
   - Do not simply translate the Kannada word-for-word
   - Write it as an independent English report of the same facts

4. Always mention the source of the information when available
5. Stick strictly to facts present in the raw material — never invent details, names, or numbers
6. Focus on public records, court orders, government decisions, and accountability`;
