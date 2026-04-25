import { NextRequest } from 'next/server';
import { geocode } from '@/lib/api/vworld';

export const runtime = 'nodejs';

/**
 * 주소 → 좌표 변환 (V월드 Geocoder)
 * GET /api/geocode?address=서울특별시 강남구 ...
 */
export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address');
  if (!address) {
    return Response.json({ error: 'address required' }, { status: 400 });
  }
  try {
    const r = await geocode(address);
    if (!r) return Response.json({ error: 'not found' }, { status: 404 });
    return Response.json(r);
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : 'error' },
      { status: 500 }
    );
  }
}
