import { NextRequest } from 'next/server';
import { searchNews } from '@/lib/api/naver-news';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q') ?? '부동산';
  const display = Number(req.nextUrl.searchParams.get('display') ?? '30');
  try {
    const data = await searchNews({ query, display });
    return Response.json(data);
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : 'unknown error' },
      { status: 500 }
    );
  }
}
