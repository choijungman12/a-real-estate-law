/**
 * GitHub Pages basePath 처리용 헬퍼.
 * static export 시 NEXT_PUBLIC_BASE_PATH=/a-real-estate-law 가 주입됨.
 * dev/Vercel 환경에서는 빈 문자열.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function withBase(href: string): string {
  if (!href.startsWith('/')) return href;
  if (BASE && href.startsWith(BASE)) return href;
  return `${BASE}${href}`;
}
