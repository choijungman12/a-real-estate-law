/**
 * LH 한국토지주택공사 OPEN API
 * https://www.data.go.kr/data/15056765/openapi.do (분양임대공고별 공급정보)
 * https://www.data.go.kr/data/15057999/openapi.do (분양임대공고별 상세정보)
 */
import { XMLParser } from 'fast-xml-parser';

const PARSER = new XMLParser({ ignoreAttributes: true });

const SUPPLY_URL =
  'http://apis.data.go.kr/B552555/lhLeaseNoticeInfo1/lhLeaseNoticeInfo1';

function key(): string {
  const k = process.env.DATA_GO_KR_KEY_ENCODED || process.env.DATA_GO_KR_KEY_DECODED;
  if (!k) throw new Error('DATA_GO_KR_KEY 가 필요합니다.');
  return k;
}

export type LHNotice = {
  pblancId: string;
  pblancNm: string;
  suplyTyNm: string;
  pblancUrl?: string;
  rcritPblancDe: string;
  ccrCnntSysUrl?: string;
};

export async function fetchLHNotices(params: {
  page?: number;
  rows?: number;
}): Promise<LHNotice[]> {
  const url = new URL(SUPPLY_URL);
  url.searchParams.set('serviceKey', key());
  url.searchParams.set('PG_SZ', String(params.rows ?? 20));
  url.searchParams.set('PAGE', String(params.page ?? 1));

  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) throw new Error(`LH HTTP ${res.status}`);
  const text = await res.text();
  const parsed = PARSER.parse(text);
  const list = parsed?.response?.body?.items?.item ?? [];
  const arr = Array.isArray(list) ? list : [list];
  return arr
    .filter(Boolean)
    .map((it: Record<string, unknown>) => ({
      pblancId: String(it.PAN_ID ?? it.pblancId ?? ''),
      pblancNm: String(it.PAN_NM ?? it.pblancNm ?? ''),
      suplyTyNm: String(it.SPL_TP_CD ?? it.suplyTyNm ?? ''),
      rcritPblancDe: String(it.PAN_NT_ST_DT ?? it.rcritPblancDe ?? ''),
      pblancUrl: it.DTL_URL_ADR ? String(it.DTL_URL_ADR) : undefined,
    }));
}
