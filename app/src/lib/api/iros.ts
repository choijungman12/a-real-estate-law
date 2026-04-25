/**
 * 법원 등기정보광장 OPEN API (data.iros.go.kr)
 * 등기부등본 요약·권리관계 자동 수집
 *
 * 발급: https://data.iros.go.kr/rp/oa/openOapiAppl.do
 * 인증: ServiceKey (공공데이터포털과 별개)
 *
 * ⚠️ 주의: 본 API는 본인 또는 정당한 이해관계자만 등기부 열람 가능.
 * 무차별 조회는 약관 위반 가능 — 사용자가 본인 명의·동의 매물에만 사용.
 */

const IROS_BASE = 'https://data.iros.go.kr/rp/oa/api/v1';

function key(): string {
  const k = process.env.IROS_API_KEY;
  if (!k) throw new Error('IROS_API_KEY 가 필요합니다 (data.iros.go.kr).');
  return k;
}

export type IrosRegistry = {
  pinNumber?: string; // 부동산 고유번호
  address: string;
  ownerName?: string;
  rightsCount?: number;
  lastUpdated?: string;
  raw?: unknown;
};

/**
 * 부동산 고유번호(PIN)로 등기부 요약 조회
 * 실제 사용 시 IROS 콘솔에서 정확한 엔드포인트·파라미터 확인 필수
 */
export async function fetchRegistryByPin(pin: string): Promise<IrosRegistry | null> {
  const url = new URL(`${IROS_BASE}/registry/${encodeURIComponent(pin)}`);
  url.searchParams.set('serviceKey', key());
  try {
    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      pinNumber: pin,
      address: data?.address ?? '',
      ownerName: data?.ownerName,
      rightsCount: data?.rights?.length,
      lastUpdated: data?.lastUpdated,
      raw: data,
    };
  } catch {
    return null;
  }
}

/**
 * 주소로 부동산 고유번호 검색
 */
export async function searchPinByAddress(
  address: string
): Promise<string[]> {
  const url = new URL(`${IROS_BASE}/search`);
  url.searchParams.set('address', address);
  url.searchParams.set('serviceKey', key());
  try {
    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.items ?? []).map((it: { pin: string }) => it.pin);
  } catch {
    return [];
  }
}
