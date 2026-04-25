/**
 * 대한민국 정책브리핑 (korea.kr) OPEN API
 * https://www.data.go.kr/data/15083277/openapi.do
 *
 * 부동산 정책 보도자료 자동 수집
 * 출처 패턴: ref-sem2em real-estate-policy 모듈
 */

const POLICY_URL =
  'https://apis.data.go.kr/1371000/policyNewsInfoService/getPolicyNewsInfoList';

function key(): string {
  const k = process.env.DATA_GO_KR_KEY_ENCODED || process.env.DATA_GO_KR_KEY_DECODED;
  if (!k) throw new Error('DATA_GO_KR_KEY 가 필요합니다.');
  return k;
}

export type PolicyNewsItem = {
  newsItemId: string;
  title: string;
  ministryName: string;
  pressDate: string;
  url: string;
  contentSummary?: string;
};

export async function fetchPolicyNews(params: {
  page?: number;
  rows?: number;
  keyword?: string;
}): Promise<{ items: PolicyNewsItem[]; totalCount: number }> {
  const url = new URL(POLICY_URL);
  url.searchParams.set('serviceKey', key());
  url.searchParams.set('numOfRows', String(params.rows ?? 20));
  url.searchParams.set('pageNo', String(params.page ?? 1));
  url.searchParams.set('type', 'json');
  if (params.keyword) url.searchParams.set('searchWord', params.keyword);
  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) throw new Error(`Policy HTTP ${res.status}`);
  const data = await res.json();
  const list = data?.NewsItem ?? data?.response?.body?.items?.NewsItem ?? [];
  const arr = Array.isArray(list) ? list : [list];
  const items = arr.filter(Boolean).map(
    (it: Record<string, unknown>): PolicyNewsItem => ({
      newsItemId: String(it.newsItemId ?? it.newsId ?? ''),
      title: String(it.title ?? ''),
      ministryName: String(it.ministryName ?? it.ministerName ?? ''),
      pressDate: String(it.pressDate ?? it.regDate ?? ''),
      url: String(it.originalUrl ?? it.linkUrl ?? ''),
      contentSummary: it.contentSummary ? String(it.contentSummary) : undefined,
    })
  );
  return {
    items,
    totalCount: Number(data?.totalCount ?? data?.response?.body?.totalCount ?? items.length),
  };
}
