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
  { href: '/law', label: '법령 (14주제)', icon: ScrollText },
  { href: '/study', label: '학습 커리큘럼', icon: GraduationCap },
  { href: '/news', label: '뉴스', icon: Newspaper },
  { href: '/timeline', label: '매물 타임라인', icon: Activity },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-60 lg:w-64 shrink-0 flex-col border-r border-white/5 bg-black/20 backdrop-blur-xl">
      <div className="px-5 py-5 flex items-center gap-2">
        <div className="grid place-items-center size-8 rounded-lg bg-gradient-to-br from-[color:var(--accent)] to-emerald-400 text-black font-bold">
          R
        </div>
        <div>
          <div className="font-semibold leading-none">REAL ESTATE</div>
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
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition',
                active
                  ? 'bg-white/8 text-white border border-white/10'
                  : 'text-[color:var(--text-secondary)] hover:bg-white/5 hover:text-white border border-transparent'
              )}
            >
              <Icon
                className={cn(
                  'size-4 shrink-0 transition',
                  active
                    ? 'text-[color:var(--accent)]'
                    : 'text-[color:var(--text-muted)] group-hover:text-white'
                )}
              />
              <span className="flex-1">{item.label}</span>
              {item.accent && (
                <span className="text-[9px] font-bold text-[color:var(--accent)] bg-[color:var(--accent-soft)] px-1.5 py-0.5 rounded">
                  AI
                </span>
              )}
            </a>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-white/5">
        <a
          href={withBase('/settings')}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[color:var(--text-secondary)] hover:bg-white/5 hover:text-white transition"
        >
          <Settings className="size-4" />
          <span>설정·API 키</span>
        </a>
        <div className="mt-3 px-3 py-2 rounded-xl bg-[color:var(--accent-soft)] border border-[color:var(--accent-soft)]">
          <div className="text-[10px] uppercase tracking-wider text-[color:var(--accent)]">
            국가법령정보 API
          </div>
          <div className="mt-1 text-xs text-white">
            OC: <span className="font-mono">realestate_ai_01</span>
          </div>
          <div className="text-[10px] text-[color:var(--text-muted)] mt-0.5">연결됨 ✓</div>
        </div>
      </div>
    </aside>
  );
}
