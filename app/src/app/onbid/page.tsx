'use client';

import { useEffect, useState } from 'react';
import { formatKRW } from '@/lib/utils/cn';
import { GlassCard, Badge, SectionHeader } from '@/components/ui/Glass';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { OnbidItem } from '@/lib/api/onbid';

export default function OnbidPage() {
  const [items, setItems] = useState<OnbidItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  async function load(p: number) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/onbid?page=${p}&rows=30`);
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error ?? 'API 오류');
      }
      const j = await res.json();
      setItems(j.items);
      setTotal(j.totalCount);
    } catch (e) {
      setError(e instanceof Error ? e.message : '오류');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(page);
  }, [page]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SectionHeader
        title="공매 (온비드)"
        subtitle="한국자산관리공사 KAMCO 캠코공매물건 OPEN API"
        action={<Badge tone="accent">KAMCO</Badge>}
      />

      {error && (
        <GlassCard className="border-red-500/30 bg-red-500/5 text-red-300 text-sm">
          {error}
        </GlassCard>
      )}

      <GlassCard className="p-0 overflow-hidden">
        <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
          <div className="text-sm">
            총 <span className="font-semibold text-[color:var(--accent)]">{total}</span>건
            <span className="text-[color:var(--text-muted)] ml-2">· {page} 페이지</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="grid place-items-center size-8 rounded-lg bg-white/5 border border-white/10 disabled:opacity-30"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={loading}
              className="grid place-items-center size-8 rounded-lg bg-white/5 border border-white/10 disabled:opacity-30"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[color:var(--text-muted)] text-xs uppercase tracking-wider">
              <tr className="border-b border-white/5">
                <th className="px-4 py-3 text-left">물건명</th>
                <th className="px-4 py-3 text-left">소재지</th>
                <th className="px-4 py-3 text-left">용도</th>
                <th className="px-4 py-3 text-right">감정가</th>
                <th className="px-4 py-3 text-right">최저입찰가</th>
                <th className="px-4 py-3 text-left">입찰기간</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-[color:var(--text-muted)]">
                    조회 중…
                  </td>
                </tr>
              )}
              {!loading &&
                items.map((it) => (
                  <tr
                    key={`${it.cltrNo}-${it.pbctNo}`}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="px-4 py-3 font-medium">{it.cltrNm}</td>
                    <td className="px-4 py-3 text-[color:var(--text-secondary)]">
                      {it.cltrAddr}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone="neutral">
                        {it.cltrUseLclsfNm}/{it.cltrUseMclsfNm}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right text-[color:var(--text-secondary)] tabular-nums">
                      {formatKRW(it.apprAmt)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-[color:var(--accent)] tabular-nums">
                      {formatKRW(it.minBidPrc)}
                    </td>
                    <td className="px-4 py-3 text-xs text-[color:var(--text-muted)] tabular-nums">
                      {it.pbctBgngDtm}
                      <br />~ {it.pbctEndDtm}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
