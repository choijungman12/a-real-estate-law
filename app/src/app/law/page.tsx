'use client';

import { useState } from 'react';
import type { LawSummary } from '@/lib/api/law';

export default function LawPage() {
  const [query, setQuery] = useState('주택임대차보호법');
  const [items, setItems] = useState<LawSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function search() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/law/search?query=${encodeURIComponent(query)}`);
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error ?? 'API 오류');
      }
      const j = await res.json();
      setItems(j.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : '오류');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">법령 검색</h1>
      <p className="text-sm text-zinc-600">국가법령정보센터 OPEN API</p>

      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && search()}
          placeholder="법령명 또는 키워드"
          className="border rounded px-3 py-2 flex-1"
        />
        <button
          onClick={search}
          disabled={loading}
          className="bg-zinc-900 text-white rounded px-5 py-2 hover:bg-zinc-800 disabled:opacity-50"
        >
          {loading ? '...' : '검색'}
        </button>
      </div>

      <div className="text-xs text-zinc-500">
        추천 검색: 민사집행법 / 주택임대차보호법 / 상가건물임대차보호법 / 가등기담보 등에 관한 법률 / 국토의 계획 및 이용에 관한 법률
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border rounded-xl divide-y">
        {items.map((it) => (
          <div key={it.lawId} className="p-4">
            <div className="font-semibold">{it.lawName}</div>
            <div className="text-xs text-zinc-500 mt-1">
              {it.ministry && `소관: ${it.ministry} · `}
              {it.promulgationDate && `공포: ${it.promulgationDate} · `}
              {it.effectiveDate && `시행: ${it.effectiveDate}`}
            </div>
          </div>
        ))}
        {!loading && items.length === 0 && (
          <div className="p-6 text-center text-sm text-zinc-500">
            검색 결과가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
