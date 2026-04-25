import { NextRequest } from 'next/server';
import { geocode as vworldGeocode } from '@/lib/api/vworld';
import { naverGeocode } from '@/lib/api/naver-geocoder';

export const runtime = 'nodejs';

/**
 * 주소 → 좌표 변환
 * 폴백 체인: V월드 Geocoder → 네이버 NCP Geocoder
 * GET /api/geocode?address=서울특별시 강남구 ...
 */
export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address');
  if (!address) {
    return Response.json({ error: 'address required' }, { status: 400 });
  }
  // 1차: V월드 (무료 한도 넉넉)
  try {
    const v = await vworldGeocode(address);
    if (v) return Response.json({ ...v, source: 'vworld' });
  } catch {
    /* fall through */
  }
  // 2차: 네이버 NCP (키 있으면 시도)
  try {
    const n = await naverGeocode(address);
    if (n) return Response.json({ ...n, source: 'naver' });
  } catch {
    /* ignore */
  }
  return Response.json({ error: 'not found' }, { status: 404 });
}
