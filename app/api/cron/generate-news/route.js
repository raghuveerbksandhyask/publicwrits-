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
  const systemPrompt = `You are a senior editor at PublicWrits (publicwrits.com).
Write neutral, factual, public-interest journalism focused on Karnataka, public records, transparency and governance.
Always reply with ONLY valid JSON (no markdown fences, no explanation) in this exact shape:

{
  "title_kn": "Kannada title",
  "title_en": "English title",
  "slug": "english-kebab-case-slug",
  "category": "ರಾಜಕೀಯ | ಕರ್ನಾಟಕ | ಸ್ಥಳೀಯ | ಆರ್ಥಿಕತೆ | ಅಭಿಪ್ರಾಯ",
  "excerpt": "One short sentence in Kannada",
  "body_kn": "Full article in Kannada (4-7 paragraphs)",
  "body_en": "Full article in English (4-7 paragraphs)"
}

Style rules:
- Clear, formal, respectful
- Always mention the source when possible
- Focus on public records, dockets, official decisions
- Never invent facts`;

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.XAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'grok-3',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Turn this raw material into a polished bilingual news article:\n\n${JSON.stringify(raw, null, 2)}`,
        },
      ],
      temperature: 0.35,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`xAI API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('Empty response from xAI');
  }

  // Extract JSON even if the model wraps it
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('AI did not return valid JSON');
  }

  return JSON.parse(jsonMatch[0]);
}

async function commitToGitHub(path, content, message) {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER || 'raghuveerbksandhyask';
  const repo = process.env.GITHUB_REPO || 'publicwrits-';

  if (!token) {
    throw new Error('GITHUB_TOKEN is not set');
  }

  const octokit = new Octokit({ auth: token });

  let sha;
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });
    if (!Array.isArray(data) && data.sha) {
      sha = data.sha;
    }
  } catch (e) {
    // File does not exist yet – that is fine
  }

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: Buffer.from(content, 'utf8').toString('base64'),
    sha,
    branch: 'main',
  });
}
