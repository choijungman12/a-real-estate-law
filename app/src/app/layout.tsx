import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '부동산 플랫폼 — 경공매·실거래가·권리분석',
  description:
    '한국 부동산 종합 플랫폼: 지지옥션 PDF 권리분석, 공매(온비드), 실거래가, 청약, 법령',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="bg-zinc-50 text-zinc-900 min-h-screen">
        <header className="border-b bg-white">
          <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <a href="/" className="font-bold text-lg">
              🏠 부동산 플랫폼
            </a>
            <div className="flex gap-4 text-sm">
              <a href="/realestate" className="hover:underline">
                실거래가
              </a>
              <a href="/onbid" className="hover:underline">
                공매
              </a>
              <a href="/auction" className="hover:underline">
                경매 권리분석
              </a>
              <a href="/applyhome" className="hover:underline">
                청약
              </a>
              <a href="/law" className="hover:underline">
                법령
              </a>
              <a href="/news" className="hover:underline">
                뉴스
              </a>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        <footer className="mx-auto max-w-6xl px-4 py-8 text-xs text-zinc-500 border-t mt-12">
          데이터 출처: 국토교통부, 한국자산관리공사(온비드), 한국부동산원, 국가법령정보센터, V월드, LH, 카카오맵, 네이버
        </footer>
      </body>
    </html>
  );
}
