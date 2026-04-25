'use client';

import { usePathname } from 'next/navigation';
import {
  Home,
  Building2,
  Gavel,
  ScrollText,
  Newspaper,
  Sparkles,
  KeyRound,
  Settings,
  Map as MapIcon,
  Calculator,
  GraduationCap,
  Activity,
  Hammer,
  Landmark,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { withBase } from '@/lib/utils/href';

const NAV = [
  { href: '/', label: '대시보드', icon: Home },
  { href: '/map', label: 'GIS 지도', icon: MapIcon, accent: true },
  { href: '/realestate', label: '실거래가', icon: Building2 },
  { href: '/onbid', label: '공매 (온비드)', icon: Gavel },
  { href: '/auction', label: '경매 권리분석', icon: Sparkles, accent: true },
  { href: '/applyhome', label: '청약·분양', icon: KeyRound },
  { href: '/calc', label: '수지분석 계산기', icon: Calculator },
  { href: '/redev', label: '정비사업 (재개발)', icon: Hammer, accent: true },
  { href: '/redev/cashflow', label: '└ 종합 수지분석', icon: Calculator },
  { href: '/law', label: '법령 (14주제)', icon: ScrollText },
  { href: '/study', label: '학습 커리큘럼', icon: GraduationCap },
  { href: '/news', label: '뉴스', icon: Newspaper },
  { href: '/policy', label: '정부 정책', icon: Landmark },
  { href: '/timeline', label: '매물 타임라인', icon: Activity },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-60 lg:w-64 shrink-0 flex-col border-r border-[color:var(--border-subtle)] bg-white">
      <div className="px-5 py-5 flex items-center gap-2.5">
        <div className="grid place-items-center size-9 rounded-xl bg-[color:var(--accent)] text-white font-bold text-base shadow-md shadow-[color:var(--accent-glow)]">
          R
        </div>
        <div>
          <div className="font-bold leading-none text-[color:var(--text-primary)]">REAL ESTATE</div>
          <div className="text-[10px] uppercase tracking-widest text-[color:var(--text-muted)] mt-1">
            AI · LAW · MARKET
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== '/' && pathname?.startsWith(item.href));
          return (
            <a
              key={item.href}
              href={withBase(item.href)}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition border',
                active
                  ? 'bg-[color:var(--accent-soft)] text-[color:var(--accent)] border-[color:var(--accent-soft)] font-semibold'
                  : 'text-[color:var(--text-secondary)] hover:bg-[color:var(--surface-hover)] hover:text-[color:var(--text-primary)] border-transparent'
              )}
            >
              <Icon
                className={cn(
                  'size-4 shrink-0 transition',
                  active
                    ? 'text-[color:var(--accent)]'
                    : 'text-[color:var(--text-muted)] group-hover:text-[color:var(--text-primary)]'
                )}
              />
              <span className="flex-1">{item.label}</span>
              {item.accent && (
                <span className="text-[9px] font-bold text-white bg-[color:var(--warm)] px-1.5 py-0.5 rounded">
                  AI
                </span>
              )}
            </a>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-[color:var(--border-subtle)]">
        <a
          href={withBase('/settings')}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[color:var(--text-secondary)] hover:bg-[color:var(--surface-hover)] transition"
        >
          <Settings className="size-4" />
          <span>설정·API 키</span>
        </a>
        <div className="mt-3 px-3 py-2.5 rounded-xl bg-[color:var(--accent-soft)] border border-[color:var(--accent-soft)]">
          <div className="text-[10px] uppercase tracking-wider text-[color:var(--accent)] font-bold">
            국가법령정보 API
          </div>
          <div className="mt-1 text-xs text-[color:var(--text-primary)] font-medium">
            OC: <span className="font-mono">realestate_ai_01</span>
          </div>
          <div className="text-[10px] text-[color:var(--text-secondary)] mt-0.5">연결됨 ✓</div>
        </div>
      </div>
    </aside>
  );
}
