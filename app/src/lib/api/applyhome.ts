/**
 * 청약홈 분양정보 OPEN API
 * https://www.data.go.kr/data/15098547/openapi.do
 *
 * APT, 오피스텔, 도시형, 민간임대, 무순위 등 분양정보 조회
 */

const APT_LIST_URL =
  'https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getAPTLttotPblancDetail';

function key(): string {
  const k = process.env.DATA_GO_KR_KEY_ENCODED || process.env.DATA_GO_KR_KEY_DECODED;
  if (!k) throw new Error('DATA_GO_KR_KEY 가 필요합니다.');
  return k;
}

export type ApplyAptItem = {
  pblancNo: string;
  houseNm: string;
  rceptBgnde: string;
  rceptEndde: string;
  bsnsMbyNm: string;
  hssplyAdres: string;
  totSuplyHshldco: number;
  rcritPblancDe: string;
  przwnerPresnatnDe: string;
  cnstrctEnttNm: string;
};

export async function fetchAptApplications(params: {
  page?: number;
  perPage?: number;
}): Promise<{ items: ApplyAptItem[]; totalCount: number }> {
  const url = new URL(APT_LIST_URL);
  url.searchParams.set('page', String(params.page ?? 1));
  url.searchParams.set('perPage', String(params.perPage ?? 30));
  url.searchParams.set('serviceKey', key());

  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) throw new Error(`Applyhome HTTP ${res.status}`);
  const data = await res.json();
  const items = (data.data ?? []).map((d: Record<string, unknown>) => ({
    pblancNo: String(d.PBLANC_NO ?? ''),
    houseNm: String(d.HOUSE_NM ?? ''),
    rceptBgnde: String(d.RCEPT_BGNDE ?? ''),
    rceptEndde: String(d.RCEPT_ENDDE ?? ''),
    bsnsMbyNm: String(d.BSNS_MBY_NM ?? ''),
    hssplyAdres: String(d.HSSPLY_ADRES ?? ''),
    totSuplyHshldco: Number(d.TOT_SUPLY_HSHLDCO ?? 0),
    rcritPblancDe: String(d.RCRIT_PBLANC_DE ?? ''),
    przwnerPresnatnDe: String(d.PRZWNER_PRESNATN_DE ?? ''),
    cnstrctEnttNm: String(d.CNSTRCT_ENTT_NM ?? ''),
  }));
  return { items, totalCount: Number(data.totalCount ?? items.length) };
}
