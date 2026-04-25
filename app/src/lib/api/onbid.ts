/**
 * 온비드(공매) OPEN API 클라이언트
 * https://www.data.go.kr/data/15000851/openapi.do
 *
 * 캠코공매물건 조회 서비스
 */
import { XMLParser } from 'fast-xml-parser';

const PARSER = new XMLParser({ ignoreAttributes: true });

const ONBID_BASE =
  'https://openapi.onbid.co.kr/openapi/services/KamcoPbctCltrService/getKamcoPbctCltrInfo';

export type OnbidItem = {
  cltrNo: string;
  cltrNm: string;
  pbctNo: string;
  apprAmt: number;
  minBidPrc: number;
  pbctBgngDtm: string;
  pbctEndDtm: string;
  cltrAddr: string;
  cltrSttsCd: string;
  cltrUseLclsfNm: string;
  cltrUseMclsfNm: string;
  bidMnbdNm: string;
};

export async function fetchOnbidItems(params: {
  page?: number;
  rows?: number;
  cltrSttsCd?: string;
  pbctBgngYmd?: string;
  pbctEndYmd?: string;
}): Promise<{ items: OnbidItem[]; totalCount: number }> {
  const key =
    process.env.DATA_GO_KR_KEY_ENCODED || process.env.DATA_GO_KR_KEY_DECODED;
  if (!key) throw new Error('DATA_GO_KR_KEY_ENCODED 가 필요합니다.');

  const url = new URL(ONBID_BASE);
  // 공공데이터포털 통일 표기는 serviceKey (소문자 s); 온비드 문서는 ServiceKey 표기지만 둘 다 동작
  url.searchParams.set('serviceKey', key);
  url.searchParams.set('numOfRows', String(params.rows ?? 30));
  url.searchParams.set('pageNo', String(params.page ?? 1));
  if (params.cltrSttsCd) url.searchParams.set('CLTR_STTS_CD', params.cltrSttsCd);
  if (params.pbctBgngYmd) url.searchParams.set('PBCT_BGNG_YMD', params.pbctBgngYmd);
  if (params.pbctEndYmd) url.searchParams.set('PBCT_END_YMD', params.pbctEndYmd);

  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) throw new Error(`Onbid HTTP ${res.status}`);
  const xml = await res.text();
  const parsed = PARSER.parse(xml);

  const body = parsed?.response?.body;
  const totalCount = Number(body?.totalCount ?? 0);
  const raw = body?.items?.item;
  const list = !raw ? [] : Array.isArray(raw) ? raw : [raw];

  const items: OnbidItem[] = list.map(
    (it: Record<string, unknown>): OnbidItem => ({
      cltrNo: String(it.CLTR_NO ?? ''),
      cltrNm: String(it.CLTR_NM ?? ''),
      pbctNo: String(it.PBCT_NO ?? ''),
      apprAmt: Number(it.APPR_AMT ?? 0),
      minBidPrc: Number(it.MIN_BID_PRC ?? 0),
      pbctBgngDtm: String(it.PBCT_BGNG_DTM ?? ''),
      pbctEndDtm: String(it.PBCT_END_DTM ?? ''),
      cltrAddr: String(it.LDNM_ADDR ?? it.CLTR_ADDR ?? ''),
      cltrSttsCd: String(it.CLTR_STTS_CD ?? ''),
      cltrUseLclsfNm: String(it.USCBC_NM ?? it.CLTR_USE_LCLSF_NM ?? ''),
      cltrUseMclsfNm: String(it.CLTR_USE_MCLSF_NM ?? ''),
      bidMnbdNm: String(it.BID_MNBD_NM ?? ''),
    })
  );

  return { items, totalCount };
}
