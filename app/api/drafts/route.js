import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const draftsDir = path.join(process.cwd(), 'content/drafts');

function getDraftsFromDisk() {
  if (!fs.existsSync(draftsDir)) return [];

  const files = fs.readdirSync(draftsDir).filter((f) => f.endsWith('.md'));

  return files.map((file) => {
    const content = fs.readFileSync(path.join(draftsDir, file), 'utf8');
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    const data = {};

    if (match) {
      match[1].split('\n').forEach((line) => {
        const idx = line.indexOf(':');
        if (idx === -1) return;
        const key = line.slice(0, idx).trim();
        let value = line.slice(idx + 1).trim();
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        data[key] = value;
      });
    }

    return {
      slug: data.slug || file.replace('.md', ''),
      title_kn: data.title || '',
      title_en: data.title_en || '',
      date: data.date || '',
      category: data.category || '',
      filename: file,
    };
  });
}

export async function GET(req) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const drafts = getDraftsFromDisk();
    return NextResponse.json({ drafts });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, slug } = body;

    if (!slug || !action) {
      return NextResponse.json({ error: 'Missing slug or action' }, { status: 400 });
    }

    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER || 'raghuveerbksandhyask';
    const repo = process.env.GITHUB_REPO || 'publicwrits-';
    const octokit = new Octokit({ auth: token });

    const draftPath = `content/drafts/${slug}.md`;

    // Get the draft file
    const { data: fileData } = await octokit.repos.getContent({
      owner,
      repo,
      path: draftPath,
    });

    if (Array.isArray(fileData) || !fileData.content) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 });
    }

    const content = Buffer.from(fileData.content, 'base64').toString('utf8');

    if (action === 'approve') {
      // Move to live articles
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const livePath = `content/articles/\( {year}/ \){month}/${slug}.md`;

      // Create live article
      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: livePath,
        message: `Publish: ${slug}`,
        content: fileData.content, // already base64
        branch: 'main',
      });

      // Delete the draft
      await octokit.repos.deleteFile({
        owner,
        repo,
        path: draftPath,
        message: `Remove draft after publish: ${slug}`,
        sha: fileData.sha,
        branch: 'main',
      });

      return NextResponse.json({ success: true, status: 'published', path: livePath });
    }

    if (action === 'delete') {
      await octokit.repos.deleteFile({
        owner,
        repo,
        path: draftPath,
        message: `Delete draft: ${slug}`,
        sha: fileData.sha,
        branch: 'main',
      });

      return NextResponse.json({ success: true, status: 'deleted' });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('[drafts]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
