'use client';

import { useEffect, useState } from 'react';
import { GlassCard, Badge } from '@/components/ui/Glass';
import { formatKRW } from '@/lib/utils/cn';
import { detectSigunguFromAddress } from '@/lib/geo/sigungu';
import type { AptTradeRecord } from '@/types/realestate';
import { X, Loader2, MapPin, TrendingUp, Gavel, ScrollText, Sparkles, Wallet } from 'lucide-react';

export type DetailItem = {
  id: string;
  title: string;
  address: string;
  category?: 'auction' | 'onbid' | 'trade' | 'subscription';
  appraisalAmount?: number;
  minimumBidPrice?: number;
  startDate?: string;
  endDate?: string;
  lat?: number;
  lng?: number;
};

export default function PropertyDetailModal({
  item,
  onClose,
}: {
  item: DetailItem | null;
  onClose: () => void;
}) {
  const [trades, setTrades] = useState<AptTradeRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resolved, setResolved] = useState<{ sido: string; name: string; code: string } | null>(null);

  useEffect(() => {
    if (!item) {
      setTrades([]);
      setError(null);
      setResolved(null);
      return;
    }
    const detected = detectSigunguFromAddress(item.address);
    if (!detected) {
      setError('주소에서 시·군·구를 식별할 수 없어 인근 실거래가를 자동 조회할 수 없습니다.');
      return;
    }
    setResolved({ sido: detected.sidoName, name: detected.sigunguName, code: detected.code });

    // 최근 3개월 합산
    (async () => {
      setLoading(true);
      setError(null);
      const all: AptTradeRecord[] = [];
      const now = new Date();
      for (let m = 1; m <= 3; m++) {
        const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
        const ym = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`;
        try {
          const res = await fetch(
            `/api/realestate?type=trade&sigunguCode=${detected.code}&ym=${ym}&rows=200`
          );
          if (!res.ok) continue;
          const j = await res.json();
          all.push(...((j.items as AptTradeRecord[]) ?? []));
        } catch {
          /* skip */
        }
      }
      setTrades(all);
      setLoading(false);
      if (all.length === 0) {
        setError('해당 시·군·구의 최근 실거래 데이터를 찾지 못했습니다 (키 미설정 또는 데이터 부재).');
      }
    })();
  }, [item]);

  if (!item) return null;

  const median = useMedian(trades.map((t) => t.dealAmount));
  const min = trades.length > 0 ? Math.min(...trades.map((t) => t.dealAmount)) : 0;
  const max = trades.length > 0 ? Math.max(...trades.map((t) => t.dealAmount)) : 0;
  const discountVsMedian =
    item.minimumBidPrice && median > 0
      ? ((median - item.minimumBidPrice) / median) * 100
      : null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[88vh] overflow-y-auto glass-strong rounded-2xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 grid place-items-center size-8 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-start gap-3 mb-4">
          <div className="grid place-items-center size-10 rounded-xl bg-gradient-to-br from-[color:var(--accent)] to-emerald-400 text-black">
            <MapPin className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <Badge tone="accent">{(item.category ?? 'property').toUpperCase()}</Badge>
            <h3 className="text-lg font-semibold mt-1 truncate">{item.title}</h3>
            <p className="text-xs text-[color:var(--text-secondary)] mt-1">{item.address}</p>
          </div>
        </div>

        {/* Price */}
        {(item.appraisalAmount || item.minimumBidPrice) && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            {item.appraisalAmount ? (
              <Stat label="감정가" value={formatKRW(item.appraisalAmount)} />
            ) : null}
            {item.minimumBidPrice ? (
              <Stat
                label="최저입찰가"
                value={formatKRW(item.minimumBidPrice)}
                accent
              />
            ) : null}
          </div>
        )}

        {/* Market value */}
        <GlassCard className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="size-4 text-[color:var(--accent)]" />
            <h4 className="font-semibold text-sm">
              인근 실거래가 (최근 3개월)
              {resolved && (
                <span className="ml-2 text-xs text-[color:var(--text-muted)] font-normal">
                  · {resolved.sido} {resolved.name}
                </span>
              )}
            </h4>
          </div>
          {loading && (
            <div className="text-xs text-[color:var(--text-muted)]">
              <Loader2 className="size-3 inline animate-spin mr-1" />
              MOLIT 실거래가 조회 중…
            </div>
          )}
          {error && (
            <div className="text-xs text-amber-300 bg-amber-500/5 border border-amber-500/20 rounded p-2">
              {error}
            </div>
          )}
          {!loading && trades.length > 0 && (
            <>
              <div className="grid grid-cols-3 gap-2">
                <Stat label="중간값 (median)" value={formatKRW(median)} accent />
                <Stat label="최저" value={formatKRW(min)} />
                <Stat label="최고" value={formatKRW(max)} />
              </div>
              <div className="text-[10px] text-[color:var(--text-muted)] mt-2">
                표본 {trades.length}건 · 동일 시·군·구 아파트 매매 (전용평형 미보정)
              </div>
              {discountVsMedian !== null && (
                <div
                  className={`mt-3 rounded-lg p-3 text-xs ${
                    discountVsMedian > 20
                      ? 'bg-[color:var(--accent-soft)] text-[color:var(--accent)] border border-[color:var(--accent-soft)]'
                      : 'bg-white/5 border border-white/10 text-[color:var(--text-secondary)]'
                  }`}
                >
                  💡 최저입찰가가 인근 시세 중간값 대비{' '}
                  <strong>{discountVsMedian.toFixed(1)}%</strong> 저렴.
                  {discountVsMedian > 30 && ' (단, 권리분석·명도 확인 필수)'}
                </div>
              )}
            </>
          )}
        </GlassCard>

        {/* Quick links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <QuickLink
            href="/auction"
            icon={<Sparkles className="size-4" />}
            label="권리분석"
            desc="PDF AI 분석"
          />
          <QuickLink
            href="/redev"
            icon={<Gavel className="size-4" />}
            label="감정평가"
            desc="보상 산정"
          />
          <QuickLink
            href="/calc"
            icon={<Wallet className="size-4" />}
            label="수지·세금"
            desc="취득세·DSR"
          />
          <QuickLink
            href="/law?cat=auction"
            icon={<ScrollText className="size-4" />}
            label="법령 RAG"
            desc="민사집행법"
          />
        </div>

        {item.startDate && (
          <div className="text-xs text-[color:var(--text-muted)] mt-4 text-center">
            입찰기간 {item.startDate} ~ {item.endDate}
          </div>
        )}
      </div>
    </div>
  );
}

function useMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg bg-white/[0.04] border border-white/5 p-2.5">
      <div className="text-[10px] uppercase text-[color:var(--text-muted)] tracking-wider">
        {label}
      </div>
      <div
        className={`text-sm font-semibold tabular-nums mt-1 ${
          accent ? 'text-[color:var(--accent)]' : 'text-white'
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function QuickLink({
  href,
  icon,
  label,
  desc,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  desc: string;
}) {
  return (
    <a
      href={href}
      className="rounded-xl glass border border-white/10 hover:border-white/20 p-3 block transition group"
    >
      <div className="flex items-center gap-2 text-sm font-medium">
        <span className="text-[color:var(--accent)] group-hover:scale-110 transition">
          {icon}
        </span>
        {label}
      </div>
      <div className="text-[10px] text-[color:var(--text-muted)] mt-0.5">{desc}</div>
    </a>
  );
}
