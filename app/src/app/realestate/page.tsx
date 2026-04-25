'use client';

import { useState } from 'react';
import { formatKRW, formatArea } from '@/lib/utils/cn';
import { GlassCard, Badge, SectionHeader } from '@/components/ui/Glass';
import AutoBanner from '@/components/common/AutoBanner';
import { SIDO } from '@/lib/geo/sigungu';
import type { AptTradeRecord, AptRentRecord } from '@/types/realestate';
import { Search, TrendingUp } from 'lucide-react';

type TradeResp = { items: AptTradeRecord[]; totalCount: number };
type RentResp = { items: AptRentRecord[]; totalCount: number };

const QUICK_SIGUNGU = [
  { code: '11680', name: '강남구' },
  { code: '11650', name: '서초구' },
  { code: '11710', name: '송파구' },
  { code: '11170', name: '용산구' },
  { code: '11440', name: '마포구' },
  { code: '11200', name: '성동구' },
];

function getSidoOf(code: string) {
  for (const s of SIDO) if (s.sigungu.find((x) => x.code === code)) return s.code;
  return '11';
}

export default function RealEstatePage() {
  const [type, setType] = useState<'trade' | 'rent'>('trade');
  const [sigunguCode, setSigunguCode] = useState('11680');
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
    <div className="space-y-6 max-w-7xl mx-auto">
      <SectionHeader
        title="실거래가 검색"
        subtitle="국토교통부 실거래가 OPEN API · 시군구코드 + 계약 연월"
        action={<Badge tone="accent">MOLIT</Badge>}
      />

      <AutoBanner required={['data_go_kr']} />

      <GlassCard>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="md:col-span-1">
            <label className="text-xs text-[color:var(--text-muted)] uppercase tracking-wider">
              유형
            </label>
            <div className="mt-1 flex gap-2">
              <button
                onClick={() => setType('trade')}
                className={`flex-1 rounded-lg px-3 py-2 text-sm border ${
                  type === 'trade'
                    ? 'bg-[color:var(--accent)] text-black border-transparent'
                    : 'bg-white/5 border-white/10 text-[color:var(--text-secondary)]'
                }`}
              >
                매매
              </button>
              <button
                onClick={() => setType('rent')}
                className={`flex-1 rounded-lg px-3 py-2 text-sm border ${
                  type === 'rent'
                    ? 'bg-[color:var(--accent)] text-black border-transparent'
                    : 'bg-white/5 border-white/10 text-[color:var(--text-secondary)]'
                }`}
              >
                전월세
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs text-[color:var(--text-muted)] uppercase tracking-wider">
              시·도
            </label>
            <select
              value={getSidoOf(sigunguCode)}
              onChange={(e) => {
                const sido = SIDO.find((s) => s.code === e.target.value);
                if (sido && sido.sigungu[0]) setSigunguCode(sido.sigungu[0].code);
              }}
              className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-[color:var(--accent)]/40"
            >
              {SIDO.map((s) => (
                <option key={s.code} value={s.code} className="bg-zinc-900">
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-[color:var(--text-muted)] uppercase tracking-wider">
              시·군·구
            </label>
            <select
              value={sigunguCode}
              onChange={(e) => setSigunguCode(e.target.value)}
              className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-[color:var(--accent)]/40"
            >
              {(SIDO.find((s) => s.code === getSidoOf(sigunguCode))?.sigungu ?? []).map((g) => (
                <option key={g.code} value={g.code} className="bg-zinc-900">
                  {g.name} ({g.code})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-[color:var(--text-muted)] uppercase tracking-wider">
              계약 연월
            </label>
            <input
              value={ym}
              onChange={(e) => setYm(e.target.value)}
              placeholder="YYYYMM"
              className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-[color:var(--accent)]/40"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={search}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[color:var(--accent)] text-black px-4 py-2 text-sm font-semibold disabled:opacity-50 accent-glow"
            >
              <Search className="size-4" />
              {loading ? '조회 중…' : '검색'}
            </button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {QUICK_SIGUNGU.map((q) => (
            <button
              key={q.code}
              onClick={() => setSigunguCode(q.code)}
              className={`text-xs px-2.5 py-1 rounded-full border transition ${
                sigunguCode === q.code
                  ? 'bg-[color:var(--accent-soft)] border-[color:var(--accent-soft)] text-[color:var(--accent)]'
                  : 'bg-white/5 border-white/10 text-[color:var(--text-secondary)] hover:bg-white/10'
              }`}
            >
              {q.name} {q.code}
            </button>
          ))}
        </div>
      </GlassCard>

      {error && (
        <GlassCard className="border-red-500/30 bg-red-500/5 text-red-300 text-sm">
          {error}
        </GlassCard>
      )}

      {data && (
        <GlassCard className="p-0 overflow-hidden">
          <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
            <div className="text-sm">
              총 <span className="font-semibold text-[color:var(--accent)]">{data.totalCount}</span>건
            </div>
            <Badge tone="neutral">
              <TrendingUp className="size-3" /> {type === 'trade' ? '매매' : '전월세'}
            </Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[color:var(--text-muted)] text-xs uppercase tracking-wider">
                <tr className="border-b border-white/5">
                  <th className="px-4 py-3 text-left">단지명</th>
                  <th className="px-4 py-3 text-left">동/지번</th>
                  <th className="px-4 py-3 text-left">계약일</th>
                  <th className="px-4 py-3 text-left">전용</th>
                  <th className="px-4 py-3 text-left">층</th>
                  <th className="px-4 py-3 text-right">
                    {type === 'trade' ? '거래금액' : '보증/월세'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {type === 'trade' &&
                  (data as TradeResp).items.map((it, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                      <td className="px-4 py-3">{it.apartmentName}</td>
                      <td className="px-4 py-3 text-[color:var(--text-secondary)]">
                        {it.dong} {it.jibun}
                      </td>
                      <td className="px-4 py-3 text-[color:var(--text-secondary)] tabular-nums">
                        {it.dealYear}.{String(it.dealMonth).padStart(2, '0')}.
                        {String(it.dealDay).padStart(2, '0')}
                      </td>
                      <td className="px-4 py-3 text-[color:var(--text-secondary)] tabular-nums">
                        {formatArea(it.exclusiveArea)}
                      </td>
                      <td className="px-4 py-3 text-[color:var(--text-secondary)]">{it.floor}층</td>
                      <td className="px-4 py-3 text-right font-semibold text-[color:var(--accent)] tabular-nums">
                        {formatKRW(it.dealAmount)}
                      </td>
                    </tr>
                  ))}
                {type === 'rent' &&
                  (data as RentResp).items.map((it, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                      <td className="px-4 py-3">{it.apartmentName}</td>
                      <td className="px-4 py-3 text-[color:var(--text-secondary)]">
                        {it.dong} {it.jibun}
                      </td>
                      <td className="px-4 py-3 text-[color:var(--text-secondary)] tabular-nums">
                        {it.contractYear}.{String(it.contractMonth).padStart(2, '0')}.
                        {String(it.contractDay).padStart(2, '0')}
                      </td>
                      <td className="px-4 py-3 text-[color:var(--text-secondary)] tabular-nums">
                        {formatArea(it.exclusiveArea)}
                      </td>
                      <td className="px-4 py-3 text-[color:var(--text-secondary)]">{it.floor}층</td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        <span className="text-[color:var(--accent)] font-semibold">
                          {formatKRW(it.deposit)}
                        </span>
                        {it.monthlyRent > 0 && (
                          <span className="text-[color:var(--text-muted)] text-xs block">
                            월 {formatKRW(it.monthlyRent)}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
