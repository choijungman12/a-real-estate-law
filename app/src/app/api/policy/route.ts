import { NextRequest } from 'next/server';
import { fetchPolicyNews } from '@/lib/api/policy';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const page = Number(req.nextUrl.searchParams.get('page') ?? '1');
  const rows = Number(req.nextUrl.searchParams.get('rows') ?? '30');
  const keyword = req.nextUrl.searchParams.get('q') ?? '부동산';
  try {
    const data = await fetchPolicyNews({ page, rows, keyword });
    return Response.json(data);
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : 'error' },
      { status: 500 }
    );
  }
}
