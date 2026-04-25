/**
 * 네이버 클라우드 Maps Geocoding (대체 폴백용)
 * https://api.ncloud-docs.com/docs/application-maps-geocoding
 *
 * V월드 Geocoder가 실패하거나 키 미설정 시 폴백.
 */

const NCP_GEOCODE = 'https://maps.apigw.ntruss.com/map-geocode/v2/geocode';

export async function naverGeocode(
  address: string
): Promise<{ x: number; y: number; matched: string } | null> {
  const id = process.env.NCP_API_KEY_ID;
  const secret = process.env.NCP_API_KEY;
  if (!id || !secret) return null;
  const url = new URL(NCP_GEOCODE);
  url.searchParams.set('query', address);
  const res = await fetch(url.toString(), {
    headers: {
      'X-NCP-APIGW-API-KEY-ID': id,
      'X-NCP-APIGW-API-KEY': secret,
    },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const data = await res.json();
  const r0 = data?.addresses?.[0];
  if (!r0) return null;
  return {
    x: Number(r0.x),
    y: Number(r0.y),
    matched: r0.roadAddress || r0.jibunAddress || '',
  };
}
