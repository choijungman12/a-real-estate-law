'use client';

import { usePathname } from 'next/navigation';
import { Home, Sparkles, Map as MapIcon, Calculator, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { withBase } from '@/lib/utils/href';

const NAV = [
  { href: '/', label: '홈', icon: Home },
  { href: '/map', label: '지도', icon: MapIcon },
  { href: '/auction', label: 'AI', icon: Sparkles },
  { href: '/calc', label: '계산', icon: Calculator },
  { href: '/study', label: '학습', icon: GraduationCap },
];

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[color:var(--border-subtle)] bg-white shadow-[0_-2px_12px_rgba(15,23,42,0.06)]">
      <div className="grid grid-cols-5">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          return (
            <a
              key={item.href}
              href={withBase(item.href)}
              className={cn(
                'flex flex-col items-center gap-1 py-3 text-[10px]',
                active ? 'text-[color:var(--accent)]' : 'text-[color:var(--text-muted)]'
              )}
            >
              <Icon className="size-5" />
              {item.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
