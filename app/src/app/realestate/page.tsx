'use client';

import { useState } from 'react';
import { formatKRW, formatArea } from '@/lib/utils/cn';
import type { AptTradeRecord, AptRentRecord } from '@/types/realestate';

type TradeResp = { items: AptTradeRecord[]; totalCount: number };
type RentResp = { items: AptRentRecord[]; totalCount: number };

export default function RealEstatePage() {
  const [type, setType] = useState<'trade' | 'rent'>('trade');
  const [sigunguCode, setSigunguCode] = useState('11680'); // 강남구
  const [ym, setYm] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [data, setData] = useState<TradeResp | RentResp | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function search() {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch(
        `/api/realestate?type=${type}&sigunguCode=${sigunguCode}&ym=${ym}&rows=200`
      );
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error ?? 'API 오류');
      }
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : '오류');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">실거래가 검색</h1>
      <p className="text-sm text-zinc-600">
        국토교통부 실거래가 OPEN API (시군구코드 5자리 + 계약 연월 6자리)
      </p>

      <div className="bg-white border rounded-xl p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as 'trade' | 'rent')}
          className="border rounded px-3 py-2"
        >
          <option value="trade">매매</option>
          <option value="rent">전월세</option>
        </select>
        <input
          value={sigunguCode}
          onChange={(e) => setSigunguCode(e.target.value)}
          placeholder="시군구코드 5자리"
          className="border rounded px-3 py-2"
        />
        <input
          value={ym}
          onChange={(e) => setYm(e.target.value)}
          placeholder="YYYYMM"
          className="border rounded px-3 py-2"
        />
        <button
          onClick={search}
          disabled={loading}
          className="bg-zinc-900 text-white rounded px-4 py-2 hover:bg-zinc-800 disabled:opacity-50"
        >
          {loading ? '조회 중...' : '검색'}
        </button>
      </div>

      <div className="text-xs text-zinc-500">
        대표 시군구코드: 강남구 11680 / 서초구 11650 / 송파구 11710 / 용산구 11170 / 마포구 11440
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 text-sm">
          {error}
        </div>
      )}

      {data && (
        <div className="bg-white border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b bg-zinc-50 text-sm">
            총 {data.totalCount}건
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 text-left">
                <tr>
                  <th className="px-3 py-2">단지명</th>
                  <th className="px-3 py-2">동/지번</th>
                  <th className="px-3 py-2">계약일</th>
                  <th className="px-3 py-2">전용면적</th>
                  <th className="px-3 py-2">층</th>
                  <th className="px-3 py-2 text-right">
                    {type === 'trade' ? '거래금액' : '보증금/월세'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {type === 'trade' &&
                  (data as TradeResp).items.map((it, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-3 py-2">{it.apartmentName}</td>
                      <td className="px-3 py-2">
                        {it.dong} {it.jibun}
                      </td>
                      <td className="px-3 py-2">
                        {it.dealYear}.{String(it.dealMonth).padStart(2, '0')}.
                        {String(it.dealDay).padStart(2, '0')}
                      </td>
                      <td className="px-3 py-2">{formatArea(it.exclusiveArea)}</td>
                      <td className="px-3 py-2">{it.floor}층</td>
                      <td className="px-3 py-2 text-right font-medium">
                        {formatKRW(it.dealAmount)}
                      </td>
                    </tr>
                  ))}
                {type === 'rent' &&
                  (data as RentResp).items.map((it, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-3 py-2">{it.apartmentName}</td>
                      <td className="px-3 py-2">
                        {it.dong} {it.jibun}
                      </td>
                      <td className="px-3 py-2">
                        {it.contractYear}.{String(it.contractMonth).padStart(2, '0')}.
                        {String(it.contractDay).padStart(2, '0')}
                      </td>
                      <td className="px-3 py-2">{formatArea(it.exclusiveArea)}</td>
                      <td className="px-3 py-2">{it.floor}층</td>
                      <td className="px-3 py-2 text-right">
                        {formatKRW(it.deposit)}
                        {it.monthlyRent > 0 && (
                          <span className="text-zinc-500 text-xs">
                            {' '}
                            / 월 {formatKRW(it.monthlyRent)}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
