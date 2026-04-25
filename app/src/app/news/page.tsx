'use client';

import { useEffect, useState } from 'react';

type NewsItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  originallink: string;
};

export default function NewsPage() {
  const [query, setQuery] = useState('부동산');
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/news?q=${encodeURIComponent(query)}&display=50`);
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

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">부동산 뉴스</h1>
      <p className="text-sm text-zinc-600">네이버 검색 API · 일 25,000회 한도</p>

      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load()}
          placeholder="검색 키워드 (예: 재건축, 청약, LH, 금리)"
          className="border rounded px-3 py-2 flex-1"
        />
        <button
          onClick={load}
          disabled={loading}
          className="bg-zinc-900 text-white rounded px-5 py-2"
        >
          검색
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        {items.map((n, i) => (
          <a
            key={i}
            href={n.link}
            target="_blank"
            rel="noreferrer"
            className="block bg-white border rounded p-4 hover:shadow"
          >
            <div className="font-semibold">{n.title}</div>
            <div className="text-sm text-zinc-600 mt-1 line-clamp-2">
              {n.description}
            </div>
            <div className="text-xs text-zinc-400 mt-2">{n.pubDate}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
