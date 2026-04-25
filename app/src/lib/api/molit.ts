/**
 * 국토교통부 실거래가 OPEN API 클라이언트
 * https://www.data.go.kr/data/15126469/openapi.do (아파트 매매)
 * https://www.data.go.kr/data/15126474/openapi.do (아파트 전월세)
 *
 * 응답: XML. fast-xml-parser로 파싱.
 */
import { XMLParser } from 'fast-xml-parser';
import type { AptTradeRecord, AptRentRecord } from '@/types/realestate';

const PARSER = new XMLParser({
  ignoreAttributes: true,
  parseTagValue: true,
});

const APT_TRADE_URL =
  'https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev';
const APT_RENT_URL =
  'https://apis.data.go.kr/1613000/RTMSDataSvcAptRent/getRTMSDataSvcAptRent';

function getServiceKey(): string {
  const k = process.env.DATA_GO_KR_KEY_DECODED || process.env.DATA_GO_KR_KEY_ENCODED;
  if (!k) {
    throw new Error('DATA_GO_KR_KEY_DECODED 또는 DATA_GO_KR_KEY_ENCODED 환경변수가 필요합니다.');
  }
  return k;
}

function asArray<T>(v: T | T[] | undefined): T[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

function parseDealAmount(raw: string | number): number {
  if (typeof raw === 'number') return raw * 10_000;
  return Number(String(raw).replace(/,/g, '').trim()) * 10_000;
}

export async function fetchAptTrades(params: {
  sigunguCode: string;
  dealYearMonth: string; // YYYYMM
  page?: number;
  rows?: number;
}): Promise<{ items: AptTradeRecord[]; totalCount: number }> {
  const url = new URL(APT_TRADE_URL);
  url.searchParams.set('serviceKey', getServiceKey());
  url.searchParams.set('LAWD_CD', params.sigunguCode);
  url.searchParams.set('DEAL_YMD', params.dealYearMonth);
  url.searchParams.set('pageNo', String(params.page ?? 1));
  url.searchParams.set('numOfRows', String(params.rows ?? 100));

  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`MOLIT API HTTP ${res.status}`);
  }
  const text = await res.text();
  const parsed = PARSER.parse(text);

  const header = parsed?.response?.header;
  if (header?.resultCode !== '000' && header?.resultCode !== 0) {
    throw new Error(`MOLIT API error: ${header?.resultMsg ?? 'unknown'}`);
  }

  const totalCount = Number(parsed?.response?.body?.totalCount ?? 0);
  const rawItems = asArray(parsed?.response?.body?.items?.item);

  const items: AptTradeRecord[] = rawItems.map((it: Record<string, unknown>) => ({
    apartmentName: String(it.aptNm ?? it.aptDong ?? ''),
    dealAmount: parseDealAmount(it.dealAmount as string | number),
    dealYear: Number(it.dealYear),
    dealMonth: Number(it.dealMonth),
    dealDay: Number(it.dealDay),
    exclusiveArea: Number(it.excluUseAr ?? 0),
    floor: Number(it.floor ?? 0),
    buildYear: Number(it.buildYear ?? 0),
    jibun: String(it.jibun ?? ''),
    dong: String(it.umdNm ?? it.dong ?? ''),
    sigunguCode: params.sigunguCode,
    rgstDate: it.rgstDate ? String(it.rgstDate) : undefined,
  }));

  return { items, totalCount };
}

export async function fetchAptRents(params: {
  sigunguCode: string;
  dealYearMonth: string;
  page?: number;
  rows?: number;
}): Promise<{ items: AptRentRecord[]; totalCount: number }> {
  const url = new URL(APT_RENT_URL);
  url.searchParams.set('serviceKey', getServiceKey());
  url.searchParams.set('LAWD_CD', params.sigunguCode);
  url.searchParams.set('DEAL_YMD', params.dealYearMonth);
  url.searchParams.set('pageNo', String(params.page ?? 1));
  url.searchParams.set('numOfRows', String(params.rows ?? 100));

  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) throw new Error(`MOLIT Rent HTTP ${res.status}`);
  const text = await res.text();
  const parsed = PARSER.parse(text);

  const header = parsed?.response?.header;
  if (header?.resultCode !== '000' && header?.resultCode !== 0) {
    throw new Error(`MOLIT Rent error: ${header?.resultMsg ?? 'unknown'}`);
  }

  const totalCount = Number(parsed?.response?.body?.totalCount ?? 0);
  const rawItems = asArray(parsed?.response?.body?.items?.item);

  const items: AptRentRecord[] = rawItems.map((it: Record<string, unknown>) => ({
    apartmentName: String(it.aptNm ?? ''),
    deposit: Number(String(it.deposit ?? '0').replace(/,/g, '')) * 10_000,
    monthlyRent: Number(String(it.monthlyRent ?? '0').replace(/,/g, '')) * 10_000,
    contractYear: Number(it.dealYear),
    contractMonth: Number(it.dealMonth),
    contractDay: Number(it.dealDay),
    exclusiveArea: Number(it.excluUseAr ?? 0),
    floor: Number(it.floor ?? 0),
    buildYear: Number(it.buildYear ?? 0),
    jibun: String(it.jibun ?? ''),
    dong: String(it.umdNm ?? ''),
    sigunguCode: params.sigunguCode,
    contractType: it.contractType ? String(it.contractType) : undefined,
  }));

  return { items, totalCount };
}
