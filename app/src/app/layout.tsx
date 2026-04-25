import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import MobileNav from '@/components/layout/MobileNav';

export const metadata: Metadata = {
  title: 'Real Estate AI — 경공매·실거래가·권리분석',
  description:
    '한국 부동산 종합 플랫폼: 지지옥션 PDF AI 권리분석, 공매(온비드), 실거래가, 청약, 14개 주제 법령 카탈로그',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="min-h-screen flex">
        <Sidebar />
        <div className="flex-1 min-w-0 flex flex-col">
          <Topbar />
          <main className="flex-1 px-4 md:px-8 py-6 md:py-8 pb-24 md:pb-8">{children}</main>
        </div>
        <MobileNav />
      </body>
    </html>
  );
}
