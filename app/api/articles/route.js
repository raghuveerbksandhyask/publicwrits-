import { NextResponse } from 'next/server';
import { getAllArticles, getArticleBySlug } from '../../../lib/get-articles';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  try {
    if (slug) {
      const article = getArticleBySlug(slug);
      if (!article) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      return NextResponse.json(article);
    }

    const articles = getAllArticles();
    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
