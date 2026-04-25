'use client';

import { useEffect, useState } from 'react';
import { GlassCard, Badge, SectionHeader } from '@/components/ui/Glass';
import { Search, ExternalLink } from 'lucide-react';

type NewsItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  originallink: string;
};

const QUICK = ['부동산', '재건축', '청약', 'LH', '금리', '경매', '아파트', '도시개발'];

export default function NewsPage() {
  const [query, setQuery] = useState('부동산');
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load(q?: string) {
    const target = q ?? query;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/news?q=${encodeURIComponent(target)}&display=50`);
      if (!res.ok) throw new Error((await res.json()).error ?? 'API 오류');
      const j = await res.json();
      setItems(j.items);
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
        title="부동산 뉴스"
        subtitle="네이버 검색 API · 일 25,000회 한도"
        action={<Badge tone="accent">NAVER</Badge>}
      />

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
        <GlassCard className="border-red-500/30 bg-red-500/5 text-red-300 text-sm">
          {error}
        </GlassCard>
      )}

      <div className="space-y-2">
        {items.map((n, i) => (
          <a key={i} href={n.link} target="_blank" rel="noreferrer">
            <GlassCard className="hover:border-white/20 transition">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{n.title}</div>
                  <p className="text-xs text-[color:var(--text-secondary)] mt-1.5 line-clamp-2">
                    {n.description}
                  </p>
                  <div className="text-[10px] text-[color:var(--text-muted)] mt-2">
                    {n.pubDate}
                  </div>
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
