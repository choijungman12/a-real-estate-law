'use client';

import { usePathname } from 'next/navigation';
import { Home, Building2, Gavel, Sparkles, ScrollText } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { withBase } from '@/lib/utils/href';

const NAV = [
  { href: '/', label: '홈', icon: Home },
  { href: '/realestate', label: '시세', icon: Building2 },
  { href: '/auction', label: 'AI', icon: Sparkles },
  { href: '/onbid', label: '공매', icon: Gavel },
  { href: '/law', label: '법령', icon: ScrollText },
];

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/10 bg-black/70 backdrop-blur-xl">
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
