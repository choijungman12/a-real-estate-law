/**
 * V월드 OPEN API 클라이언트
 * https://www.vworld.kr/dev/v4dv_2ddataguide2_s001.do
 *
 * - Geocoder: 주소 → 좌표
 * - Address: 좌표 → 주소
 * - Search: 키워드 검색 (장소·주소·도로명)
 */

const GEOCODER = 'https://api.vworld.kr/req/address';
const SEARCH = 'https://api.vworld.kr/req/search';

function key(): string {
  const k = process.env.VWORLD_API_KEY;
  if (!k) throw new Error('VWORLD_API_KEY 가 필요합니다.');
  return k;
}

export async function geocode(address: string): Promise<{
  x: number;
  y: number;
  matched: string;
} | null> {
  const url = new URL(GEOCODER);
  url.searchParams.set('service', 'address');
  url.searchParams.set('request', 'getCoord');
  url.searchParams.set('version', '2.0');
  url.searchParams.set('crs', 'EPSG:4326');
  url.searchParams.set('address', address);
  url.searchParams.set('format', 'json');
  url.searchParams.set('type', 'road');
  url.searchParams.set('key', key());

  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) return null;
  const data = await res.json();
  if (data?.response?.status !== 'OK') {
    url.searchParams.set('type', 'parcel');
    const r2 = await fetch(url.toString(), { cache: 'no-store' });
    if (!r2.ok) return null;
    const d2 = await r2.json();
    if (d2?.response?.status !== 'OK') return null;
    const p = d2.response.result.point;
    return { x: Number(p.x), y: Number(p.y), matched: d2.response.refined?.text ?? '' };
  }
  const p = data.response.result.point;
  return { x: Number(p.x), y: Number(p.y), matched: data.response.refined?.text ?? '' };
}

export async function searchPlaces(query: string): Promise<
  Array<{ id: string; title: string; address: string; x: number; y: number }>
> {
  const url = new URL(SEARCH);
  url.searchParams.set('service', 'search');
  url.searchParams.set('request', 'search');
  url.searchParams.set('version', '2.0');
  url.searchParams.set('crs', 'EPSG:4326');
  url.searchParams.set('size', '20');
  url.searchParams.set('page', '1');
  url.searchParams.set('query', query);
  url.searchParams.set('type', 'place');
  url.searchParams.set('format', 'json');
  url.searchParams.set('errorformat', 'json');
  url.searchParams.set('key', key());

  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();
  const items = data?.response?.result?.items ?? [];
  return items.map((it: Record<string, unknown>) => ({
    id: String(it.id ?? ''),
    title: String(it.title ?? ''),
    address: String(
      ((it.address as Record<string, unknown> | undefined)?.road as string) ??
        ((it.address as Record<string, unknown> | undefined)?.parcel as string) ??
        ''
    ),
    x: Number((it.point as Record<string, unknown>)?.x ?? 0),
    y: Number((it.point as Record<string, unknown>)?.y ?? 0),
  }));
}
