/**
 * 네이버 검색 API - 뉴스
 * https://developers.naver.com/docs/serviceapi/search/news/news.md
 *
 * 일 25,000회, 호출당 최대 100건
 */

const NEWS_URL = 'https://openapi.naver.com/v1/search/news.json';

export type NewsItem = {
  title: string;
  originallink: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function searchNews(params: {
  query: string;
  display?: number;
  sort?: 'sim' | 'date';
  start?: number;
}): Promise<{ items: NewsItem[]; total: number }> {
  const id = process.env.NAVER_CLIENT_ID;
  const secret = process.env.NAVER_CLIENT_SECRET;
  if (!id || !secret) throw new Error('NAVER_CLIENT_ID/SECRET 가 필요합니다.');

  const url = new URL(NEWS_URL);
  url.searchParams.set('query', params.query);
  url.searchParams.set('display', String(params.display ?? 30));
  url.searchParams.set('sort', params.sort ?? 'date');
  url.searchParams.set('start', String(params.start ?? 1));

  const res = await fetch(url.toString(), {
    headers: {
      'X-Naver-Client-Id': id,
      'X-Naver-Client-Secret': secret,
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Naver news HTTP ${res.status}`);
  const data = await res.json();
  return {
    items: (data.items ?? []).map((i: Record<string, unknown>) => ({
      title: stripHtml(String(i.title ?? '')),
      originallink: String(i.originallink ?? ''),
      link: String(i.link ?? ''),
      description: stripHtml(String(i.description ?? '')),
      pubDate: String(i.pubDate ?? ''),
    })),
    total: Number(data.total ?? 0),
  };
}

function stripHtml(s: string): string {
  return s
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}
