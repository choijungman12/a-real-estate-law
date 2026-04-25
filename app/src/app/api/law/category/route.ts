import { NextRequest } from 'next/server';
import { searchLaws, type LawSummary } from '@/lib/api/law';
import { categoriesIndex, getCategory, type LawCategory } from '@/lib/law/catalog';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const cat = req.nextUrl.searchParams.get('category') as LawCategory | null;

  if (!cat) {
    return Response.json({ categories: categoriesIndex() });
  }

  const seed = getCategory(cat);
  if (!seed) {
    return Response.json({ error: `unknown category: ${cat}` }, { status: 400 });
  }

  const results = await Promise.all(
    seed.laws.map(async (lawName) => {
      try {
        const items = await searchLaws({ query: lawName, display: 3 });
        return {
          query: lawName,
          items: items.slice(0, 3),
        };
      } catch (e) {
        return {
          query: lawName,
          items: [] as LawSummary[],
          error: e instanceof Error ? e.message : 'error',
        };
      }
    })
  );

  return Response.json({
    category: cat,
    title: seed.title,
    description: seed.description,
    results,
  });
}
