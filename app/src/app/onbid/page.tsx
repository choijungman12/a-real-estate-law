'use client';

import { useEffect, useState } from 'react';
import { formatKRW } from '@/lib/utils/cn';
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">공매 물건 (온비드)</h1>
        <p className="text-sm text-zinc-600 mt-1">
          한국자산관리공사(KAMCO) 캠코공매물건 OPEN API · 공공데이터포털
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b bg-zinc-50 text-sm flex justify-between">
          <span>총 {total}건 (페이지 {page})</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="border rounded px-3 py-1 text-xs disabled:opacity-50"
            >
              이전
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={loading}
              className="border rounded px-3 py-1 text-xs disabled:opacity-50"
            >
              다음
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-left">
              <tr>
                <th className="px-3 py-2">물건명</th>
                <th className="px-3 py-2">소재지</th>
                <th className="px-3 py-2">용도</th>
                <th className="px-3 py-2 text-right">감정가</th>
                <th className="px-3 py-2 text-right">최저입찰가</th>
                <th className="px-3 py-2">입찰기간</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-zinc-500">
                    조회 중...
                  </td>
                </tr>
              )}
              {!loading &&
                items.map((it) => (
                  <tr key={`${it.cltrNo}-${it.pbctNo}`} className="border-t">
                    <td className="px-3 py-2">{it.cltrNm}</td>
                    <td className="px-3 py-2 text-zinc-600">{it.cltrAddr}</td>
                    <td className="px-3 py-2 text-xs">
                      {it.cltrUseLclsfNm} / {it.cltrUseMclsfNm}
                    </td>
                    <td className="px-3 py-2 text-right">{formatKRW(it.apprAmt)}</td>
                    <td className="px-3 py-2 text-right font-medium">
                      {formatKRW(it.minBidPrc)}
                    </td>
                    <td className="px-3 py-2 text-xs">
                      {it.pbctBgngDtm} ~ {it.pbctEndDtm}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
