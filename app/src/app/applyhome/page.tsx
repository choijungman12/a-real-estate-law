'use client';

import { useEffect, useState } from 'react';

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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">청약·분양 정보</h1>
      <p className="text-sm text-zinc-600">청약홈 분양정보 OPEN API · 한국부동산원</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 text-sm">
          {error}
        </div>
      )}

      {loading && <p className="text-sm text-zinc-500">조회 중...</p>}

      <div className="space-y-2">
        {items.map((it) => (
          <div key={it.pblancNo} className="bg-white border rounded p-4">
            <div className="font-semibold">{it.houseNm}</div>
            <div className="text-sm text-zinc-600 mt-1">{it.hssplyAdres}</div>
            <div className="text-xs text-zinc-500 mt-2 grid grid-cols-2 gap-1">
              <div>시공사: {it.cnstrctEnttNm}</div>
              <div>총 세대: {it.totSuplyHshldco}</div>
              <div>접수: {it.rceptBgnde} ~ {it.rceptEndde}</div>
              <div>당첨자 발표: {it.przwnerPresnatnDe}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
