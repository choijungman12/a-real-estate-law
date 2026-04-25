'use client';

import { useEffect, useState } from 'react';
import { GlassCard, Badge, SectionHeader } from '@/components/ui/Glass';
import AutoBanner from '@/components/common/AutoBanner';
import { Search, ExternalLink, FileText } from 'lucide-react';

type PolicyItem = {
  newsItemId: string;
  title: string;
  ministryName: string;
  pressDate: string;
  url: string;
  contentSummary?: string;
};

const QUICK = ['부동산', '주택공급', '재건축', '청약', '대출', 'LH', '도시개발'];

export default function PolicyPage() {
  const [query, setQuery] = useState('부동산');
  const [items, setItems] = useState<PolicyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  async function load(q?: string) {
    const target = q ?? query;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/policy?q=${encodeURIComponent(target)}&rows=30`);
      if (!res.ok) throw new Error((await res.json()).error ?? 'API 오류');
      const j = await res.json();
      setItems(j.items ?? []);
      setTotal(j.totalCount ?? 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : '오류');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <SectionHeader
        title="정부 정책 브리핑"
        subtitle="대한민국 정책브리핑 (korea.kr) · 부동산 정책 보도자료 자동 수집"
        action={<Badge tone="accent">POLICY</Badge>}
      />

      <AutoBanner required={['data_go_kr']} />

      <GlassCard className="p-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[color:var(--text-muted)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && load()}
              placeholder="검색 키워드"
              className="w-full bg-transparent border-none px-9 py-2 text-sm focus:outline-none"
            />
          </div>
          <button
            onClick={() => load()}
            disabled={loading}
            className="rounded-lg bg-[color:var(--accent)] text-black px-5 py-2 text-sm font-semibold disabled:opacity-50"
          >
            검색
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {QUICK.map((q) => (
            <button
              key={q}
              onClick={() => {
                setQuery(q);
                load(q);
              }}
              className={`text-xs px-2.5 py-1 rounded-full border transition ${
                query === q
                  ? 'bg-[color:var(--accent-soft)] border-[color:var(--accent-soft)] text-[color:var(--accent)]'
                  : 'bg-white/5 border-white/10 text-[color:var(--text-secondary)] hover:bg-white/10'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </GlassCard>

      {error && (
        <GlassCard className="border-red-500/30 bg-red-500/5 text-red-300 text-sm">{error}</GlassCard>
      )}

      <div className="text-xs text-[color:var(--text-muted)]">
        총 <span className="text-[color:var(--accent)] font-semibold">{total}</span>건
      </div>

      <div className="space-y-2">
        {items.map((p) => (
          <a key={p.newsItemId || p.url} href={p.url} target="_blank" rel="noreferrer">
            <GlassCard className="hover:border-white/20 transition">
              <div className="flex items-start gap-3">
                <FileText className="size-4 text-[color:var(--accent)] shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{p.title}</div>
                  <div className="text-xs text-[color:var(--text-muted)] mt-1">
                    {p.ministryName} · {p.pressDate}
                  </div>
                  {p.contentSummary && (
                    <p className="text-xs text-[color:var(--text-secondary)] mt-2 line-clamp-2">
                      {p.contentSummary}
                    </p>
                  )}
                </div>
                <ExternalLink className="size-4 text-[color:var(--text-muted)] shrink-0" />
              </div>
            </GlassCard>
          </a>
        ))}
      </div>
    </div>
  );
}
