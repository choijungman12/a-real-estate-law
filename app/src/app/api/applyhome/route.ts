import { NextRequest } from 'next/server';
import { fetchAptApplications } from '@/lib/api/applyhome';

export async function GET(req: NextRequest) {
  const page = Number(req.nextUrl.searchParams.get('page') ?? '1');
  const perPage = Number(req.nextUrl.searchParams.get('perPage') ?? '30');
  try {
    const data = await fetchAptApplications({ page, perPage });
    return Response.json(data);
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : 'error' },
      { status: 500 }
    );
  }
}
