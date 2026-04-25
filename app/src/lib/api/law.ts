/**
 * 국가법령정보 OPEN API 클라이언트
 * https://open.law.go.kr/LSO/openApi/guideList.do
 *
 * 응답 포맷: XML / JSON 둘 다 지원. JSON 사용 (type=JSON).
 * 인증: OC = 가입 이메일 ID 앞부분
 */

const LAW_SEARCH_URL = 'https://www.law.go.kr/DRF/lawSearch.do';
const LAW_DETAIL_URL = 'https://www.law.go.kr/DRF/lawService.do';

function oc(): string {
  const o = process.env.LAW_GO_KR_OC;
  if (!o) throw new Error('LAW_GO_KR_OC 환경변수가 필요합니다.');
  return o;
}

export type LawSummary = {
  lawId: string;
  lawName: string;
  promulgationDate?: string;
  effectiveDate?: string;
  ministry?: string;
};

export async function searchLaws(params: {
  query: string;
  page?: number;
  display?: number;
}): Promise<LawSummary[]> {
  const url = new URL(LAW_SEARCH_URL);
  url.searchParams.set('OC', oc());
  url.searchParams.set('target', 'law');
  url.searchParams.set('type', 'JSON');
  url.searchParams.set('query', params.query);
  url.searchParams.set('page', String(params.page ?? 1));
  url.searchParams.set('display', String(params.display ?? 20));

  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) throw new Error(`Law search HTTP ${res.status}`);
  const data = await res.json();
  const list = data?.LawSearch?.law ?? [];
  const arr = Array.isArray(list) ? list : [list];

  return arr.map((l: Record<string, unknown>) => ({
    lawId: String(l.법령ID ?? l.lawId ?? ''),
    lawName: String(l.법령명한글 ?? l.lawName ?? ''),
    promulgationDate: l.공포일자 ? String(l.공포일자) : undefined,
    effectiveDate: l.시행일자 ? String(l.시행일자) : undefined,
    ministry: l.소관부처명 ? String(l.소관부처명) : undefined,
  }));
}

export async function fetchLawDetail(lawId: string): Promise<unknown> {
  const url = new URL(LAW_DETAIL_URL);
  url.searchParams.set('OC', oc());
  url.searchParams.set('target', 'law');
  url.searchParams.set('type', 'JSON');
  url.searchParams.set('ID', lawId);

  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) throw new Error(`Law detail HTTP ${res.status}`);
  return await res.json();
}
