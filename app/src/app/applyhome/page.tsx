'use client';

import { useEffect, useState } from 'react';
import { GlassCard, Badge, SectionHeader } from '@/components/ui/Glass';
import { KeyRound, Building2 } from 'lucide-react';

type Item = {
  pblancNo: string;
  houseNm: string;
  rceptBgnde: string;
  rceptEndde: string;
  bsnsMbyNm: string;
  hssplyAdres: string;
  totSuplyHshldco: number;
  rcritPblancDe: string;
  przwnerPresnatnDe: string;
  cnstrctEnttNm: string;
};

export default function ApplyhomePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/applyhome');
        if (!res.ok) throw new Error((await res.json()).error ?? 'error');
        const j = await res.json();
        setItems(j.items);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <SectionHeader
        title="청약·분양 정보"
        subtitle="청약홈 분양정보 OPEN API · 한국부동산원"
        action={<Badge tone="accent">REB</Badge>}
      />

      {error && (
        <GlassCard className="border-red-500/30 bg-red-500/5 text-red-300 text-sm">
          {error}
        </GlassCard>
      )}

      {loading && (
        <GlassCard className="text-sm text-[color:var(--text-muted)] text-center">
          조회 중…
        </GlassCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((it) => (
          <GlassCard key={it.pblancNo} className="hover:border-white/20 transition">
            <div className="flex items-start gap-3">
              <div className="grid place-items-center size-10 rounded-xl bg-white/5 border border-white/10 shrink-0">
                <KeyRound className="size-4 text-[color:var(--accent)]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{it.houseNm}</div>
                <div className="text-xs text-[color:var(--text-secondary)] mt-1 truncate">
                  {it.hssplyAdres}
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-[color:var(--text-muted)]">
                  <div>
                    <Building2 className="inline size-3 mr-1" />
                    {it.cnstrctEnttNm || '-'}
                  </div>
                  <div className="text-right">총 {it.totSuplyHshldco}세대</div>
                  <div className="col-span-2 border-t border-white/5 pt-2 mt-1">
                    접수 {it.rceptBgnde} ~ {it.rceptEndde}
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
