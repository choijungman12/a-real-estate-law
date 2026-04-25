'use client';

import { useEffect, useState } from 'react';
import type { LawSummary } from '@/lib/api/law';
import type { LawCategory } from '@/lib/law/catalog';
import { GlassCard, Badge, SectionHeader } from '@/components/ui/Glass';
import { CategoryDiagram } from '@/components/diagrams';
import { Search, ScrollText, Sparkles } from 'lucide-react';

type CatItem = { category: LawCategory; title: string; description: string; count: number };
type SearchResp = { items: LawSummary[]; total: number };
type CategoryResp = {
  category: LawCategory;
  title: string;
  description: string;
  results: { query: string; items: LawSummary[]; error?: string }[];
};

export default function LawPage() {
  const [tab, setTab] = useState<'category' | 'search'>('category');
  const [categories, setCategories] = useState<CatItem[]>([]);
  const [selected, setSelected] = useState<LawCategory | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryResp | null>(null);
  const [query, setQuery] = useState('주택임대차보호법');
  const [search, setSearch] = useState<SearchResp | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/law/category')
      .then((r) => r.json())
      .then((d) => setCategories(d.categories ?? []));
  }, []);

  async function loadCategory(cat: LawCategory) {
    setSelected(cat);
    setLoading(true);
    setError(null);
    setCategoryData(null);
    try {
      const res = await fetch(`/api/law/category?category=${cat}`);
      if (!res.ok) throw new Error((await res.json()).error ?? 'error');
      setCategoryData(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'error');
    } finally {
      setLoading(false);
    }
  }

  async function doSearch() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/law/search?query=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error((await res.json()).error ?? 'error');
      setSearch(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SectionHeader
        title="법령 14주제 카탈로그"
        subtitle="국가법령정보센터 OPEN API · 부동산 14주제별 핵심 법령 자동 매핑"
        action={
          <Badge tone="accent">
            <Sparkles className="size-3" /> OC: realestate_ai_01
          </Badge>
        }
      />

      <div className="flex gap-1 rounded-xl glass p-1 w-fit">
        {(['category', 'search'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 text-sm rounded-lg transition ${
              tab === t
                ? 'bg-white/10 text-white'
                : 'text-[color:var(--text-muted)] hover:text-white'
            }`}
          >
            {t === 'category' ? '주제별 카탈로그' : '자유 검색'}
          </button>
        ))}
      </div>

      {error && (
        <GlassCard className="border-red-500/30 bg-red-500/5 text-red-300 text-sm">
          {error}
        </GlassCard>
      )}

      {tab === 'category' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-2 lg:max-h-[70vh] lg:overflow-y-auto pr-1">
            {categories.map((c) => (
              <button
                key={c.category}
                onClick={() => loadCategory(c.category)}
                className={`w-full text-left p-3.5 rounded-xl border transition ${
                  selected === c.category
                    ? 'glass-strong border-[color:var(--accent)]/40'
                    : 'glass hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-sm">{c.title}</div>
                  <Badge tone={selected === c.category ? 'accent' : 'neutral'}>
                    {c.count}
                  </Badge>
                </div>
                <div className="text-xs text-[color:var(--text-secondary)] mt-1.5 line-clamp-2">
                  {c.description}
                </div>
              </button>
            ))}
          </div>

          <GlassCard className="lg:col-span-2 min-h-[400px]">
            {!selected && (
              <div className="grid place-items-center h-64 text-center">
                <div>
                  <ScrollText className="size-10 text-[color:var(--text-muted)] mx-auto mb-3" />
                  <p className="text-sm text-[color:var(--text-muted)]">
                    왼쪽 14개 주제 중 하나를 선택하세요.
                  </p>
                </div>
              </div>
            )}
            {loading && (
              <p className="text-sm text-[color:var(--text-muted)]">법령 조회 중…</p>
            )}
            {categoryData && (
              <div className="space-y-4">
                <div className="pb-3 border-b border-white/5">
                  <h3 className="font-semibold text-base">{categoryData.title}</h3>
                  <p className="text-xs text-[color:var(--text-secondary)] mt-1">
                    {categoryData.description}
                  </p>
                </div>

                {/* 초보자용 시각화 (해당 카테고리만) */}
                <CategoryDiagram category={categoryData.category} />

                {categoryData.results.map((r) => (
                  <div key={r.query} className="space-y-2">
                    <div className="font-medium text-sm flex items-center gap-2">
                      <span className="block size-1.5 rounded-full bg-[color:var(--accent)]" />
                      {r.query}
                    </div>
                    {r.items.length === 0 && (
                      <div className="text-xs text-[color:var(--text-muted)] pl-4">
                        검색 결과 없음 {r.error && `(${r.error})`}
                      </div>
                    )}
                    <ul className="pl-4 space-y-1">
                      {r.items.map((it) => (
                        <li
                          key={it.lawId}
                          className="text-xs flex items-center gap-2 py-1"
                        >
                          <span className="font-medium">{it.lawName}</span>
                          <span className="text-[color:var(--text-muted)]">
                            {it.ministry}
                            {it.effectiveDate && ` · 시행 ${it.effectiveDate}`}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      )}

      {tab === 'search' && (
        <div className="space-y-4">
          <GlassCard className="p-3">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[color:var(--text-muted)]" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && doSearch()}
                  placeholder="법령명 또는 키워드"
                  className="w-full bg-transparent border-none px-9 py-2 text-sm focus:outline-none"
                />
              </div>
              <button
                onClick={doSearch}
                disabled={loading}
                className="rounded-lg bg-[color:var(--accent)] text-black px-5 py-2 text-sm font-semibold disabled:opacity-50"
              >
                검색
              </button>
            </div>
          </GlassCard>
          <GlassCard className="p-0">
            {search?.items.map((it) => (
              <div
                key={it.lawId}
                className="px-5 py-4 border-b border-white/5 hover:bg-white/5"
              >
                <div className="font-semibold text-sm">{it.lawName}</div>
                <div className="text-xs text-[color:var(--text-muted)] mt-1">
                  {it.ministry && `소관: ${it.ministry} · `}
                  {it.promulgationDate && `공포: ${it.promulgationDate} · `}
                  {it.effectiveDate && `시행: ${it.effectiveDate}`}
                </div>
              </div>
            ))}
            {!loading && search && search.items.length === 0 && (
              <div className="p-8 text-center text-sm text-[color:var(--text-muted)]">
                검색 결과가 없습니다.
              </div>
            )}
          </GlassCard>
        </div>
      )}
    </div>
  );
}
