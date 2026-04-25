'use client';

import { useEffect, useState } from 'react';
import type { LawSummary } from '@/lib/api/law';
import type { LawCategory } from '@/lib/law/catalog';

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
      const j = await res.json();
      setCategoryData(j);
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
      const j = await res.json();
      setSearch(j);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">법령 검색 — 국가법령정보센터</h1>
        <p className="text-sm text-zinc-600 mt-1">
          OPEN API 인증키(OC): <code className="bg-zinc-100 px-1 rounded">realestate_ai_01</code>{' '}
          · 14개 부동산 주제별 카탈로그 + 자유 검색
        </p>
      </div>

      <div className="flex gap-2 border-b">
        <button
          onClick={() => setTab('category')}
          className={`px-4 py-2 text-sm ${
            tab === 'category' ? 'border-b-2 border-zinc-900 font-semibold' : 'text-zinc-500'
          }`}
        >
          주제별 카탈로그
        </button>
        <button
          onClick={() => setTab('search')}
          className={`px-4 py-2 text-sm ${
            tab === 'search' ? 'border-b-2 border-zinc-900 font-semibold' : 'text-zinc-500'
          }`}
        >
          자유 검색
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 text-sm">
          {error}
        </div>
      )}

      {tab === 'category' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            {categories.map((c) => (
              <button
                key={c.category}
                onClick={() => loadCategory(c.category)}
                className={`w-full text-left p-3 rounded border bg-white hover:shadow ${
                  selected === c.category ? 'ring-2 ring-zinc-900' : ''
                }`}
              >
                <div className="font-semibold text-sm">{c.title}</div>
                <div className="text-xs text-zinc-500 mt-1 line-clamp-2">
                  {c.description}
                </div>
                <div className="text-xs text-zinc-400 mt-1">{c.count}개 법령</div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2 bg-white border rounded-xl p-5 min-h-[400px]">
            {!selected && (
              <p className="text-sm text-zinc-500">왼쪽에서 주제를 선택하세요.</p>
            )}
            {loading && <p className="text-sm text-zinc-500">법령 조회 중...</p>}
            {categoryData && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">{categoryData.title}</h3>
                  <p className="text-xs text-zinc-500 mt-1">{categoryData.description}</p>
                </div>
                {categoryData.results.map((r) => (
                  <div key={r.query} className="border-t pt-3">
                    <div className="font-medium text-sm">{r.query}</div>
                    {r.items.length === 0 && (
                      <div className="text-xs text-zinc-400 mt-1">
                        검색 결과 없음 {r.error ? `(${r.error})` : ''}
                      </div>
                    )}
                    <ul className="mt-2 space-y-1">
                      {r.items.map((it) => (
                        <li key={it.lawId} className="text-xs">
                          <span className="font-medium">{it.lawName}</span>
                          <span className="text-zinc-500 ml-2">
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
          </div>
        </div>
      )}

      {tab === 'search' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && doSearch()}
              placeholder="법령명 또는 키워드"
              className="border rounded px-3 py-2 flex-1"
            />
            <button
              onClick={doSearch}
              disabled={loading}
              className="bg-zinc-900 text-white rounded px-5 py-2"
            >
              {loading ? '...' : '검색'}
            </button>
          </div>
          <div className="bg-white border rounded-xl divide-y">
            {search?.items.map((it) => (
              <div key={it.lawId} className="p-4">
                <div className="font-semibold">{it.lawName}</div>
                <div className="text-xs text-zinc-500 mt-1">
                  {it.ministry && `소관: ${it.ministry} · `}
                  {it.promulgationDate && `공포: ${it.promulgationDate} · `}
                  {it.effectiveDate && `시행: ${it.effectiveDate}`}
                </div>
              </div>
            ))}
            {!loading && search && search.items.length === 0 && (
              <div className="p-6 text-center text-sm text-zinc-500">
                검색 결과가 없습니다.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
