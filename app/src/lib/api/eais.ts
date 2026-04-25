/**
 * 건축HUB 건축물대장 OPEN API
 * https://www.data.go.kr/data/15134735/openapi.do
 *
 * 표제부 (총괄·표제부·층별), 부속지번, 전유공용면적, 주택가격 등
 */
import { XMLParser } from 'fast-xml-parser';

const PARSER = new XMLParser({ ignoreAttributes: true });

const TITLE_URL =
  'https://apis.data.go.kr/1613000/BldRgstHubService/getBrTitleInfo';

function key(): string {
  const k = process.env.DATA_GO_KR_KEY_ENCODED || process.env.DATA_GO_KR_KEY_DECODED;
  if (!k) throw new Error('DATA_GO_KR_KEY 가 필요합니다.');
  return k;
}

export type BuildingTitle = {
  bldNm: string;
  mainPurpsCdNm: string;
  totArea: number;
  archArea: number;
  bcRat: number;
  vlRatEstmTotArea: number;
  vlRat: number;
  grndFlrCnt: number;
  ugrndFlrCnt: number;
  useAprDay?: string;
  rnum?: string;
};

export async function fetchBuildingTitle(params: {
  sigunguCd: string;
  bjdongCd: string;
  bun?: string;
  ji?: string;
  page?: number;
  rows?: number;
}): Promise<BuildingTitle[]> {
  const url = new URL(TITLE_URL);
  url.searchParams.set('ServiceKey', key());
  url.searchParams.set('sigunguCd', params.sigunguCd);
  url.searchParams.set('bjdongCd', params.bjdongCd);
  if (params.bun) url.searchParams.set('bun', params.bun);
  if (params.ji) url.searchParams.set('ji', params.ji);
  url.searchParams.set('numOfRows', String(params.rows ?? 20));
  url.searchParams.set('pageNo', String(params.page ?? 1));

  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) throw new Error(`EAIS HTTP ${res.status}`);
  const text = await res.text();
  const parsed = PARSER.parse(text);
  const list = parsed?.response?.body?.items?.item ?? [];
  const arr = Array.isArray(list) ? list : [list];
  return arr.filter(Boolean).map(
    (it: Record<string, unknown>): BuildingTitle => ({
      bldNm: String(it.bldNm ?? ''),
      mainPurpsCdNm: String(it.mainPurpsCdNm ?? ''),
      totArea: Number(it.totArea ?? 0),
      archArea: Number(it.archArea ?? 0),
      bcRat: Number(it.bcRat ?? 0),
      vlRatEstmTotArea: Number(it.vlRatEstmTotArea ?? 0),
      vlRat: Number(it.vlRat ?? 0),
      grndFlrCnt: Number(it.grndFlrCnt ?? 0),
      ugrndFlrCnt: Number(it.ugrndFlrCnt ?? 0),
      useAprDay: it.useAprDay ? String(it.useAprDay) : undefined,
    })
  );
}
