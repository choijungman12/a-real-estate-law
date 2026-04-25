'use client';

import { useEffect, useMemo, useState } from 'react';
import { GlassCard, Badge, SectionHeader } from '@/components/ui/Glass';
import AutoBanner from '@/components/common/AutoBanner';
import { formatKRW } from '@/lib/utils/cn';
import type { OnbidItem } from '@/lib/api/onbid';
import { Clock, Activity, Loader2 } from 'lucide-react';

const SIDO = [
  '서울', '부산', '대구', '인천', '광주', '대전', '울산',
  '세종', '경기', '강원', '충북', '충남', '전북', '전남',
  '경북', '경남', '제주',
];

function detectSido(addr: string): string | undefined {
  for (const s of SIDO) {
    if (addr.includes(s)) return s;
  }
  return undefined;
}

function parseDt(s: string): number {
  // "20260101120000" 같은 형식 → ms epoch
  if (!s) return 0;
  const m = s.match(/(\d{4})(\d{2})(\d{2})(\d{2})?(\d{2})?(\d{2})?/);
  if (!m) return Date.parse(s) || 0;
  const [, y, mo, d, h = '00', mi = '00', se = '00'] = m;
  return new Date(`${y}-${mo}-${d}T${h}:${mi}:${se}+09:00`).getTime();
}

export default function TimelinePage() {
  const [items, setItems] = useState<OnbidItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // 3페이지 누적 (~90건) 가져와 다양성 확보
        const all: OnbidItem[] = [];
        for (let p = 1; p <= 3; p++) {
          const res = await fetch(`/api/onbid?page=${p}&rows=30`);
          if (!res.ok) throw new Error((await res.json()).error ?? 'API 오류');
          const j = await res.json();
          all.push(...(j.items ?? []));
        }
        setItems(all);
      } catch (e) {
        setError(e instanceof Error ? e.message : '오류');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const sidoCount = useMemo(() => {
    const c = new Map<string, number>();
    for (const it of items) {
      const s = detectSido(it.cltrAddr) ?? '기타';
      c.set(s, (c.get(s) ?? 0) + 1);
    }
    return [...c.entries()].sort((a, b) => b[1] - a[1]);
  }, [items]);

  const maxCount = sidoCount[0]?.[1] ?? 1;

  const recent = useMemo(() => {
    return [...items]
      .sort((a, b) => parseDt(b.pbctBgngDtm) - parseDt(a.pbctBgngDtm))
      .slice(0, 30);
  }, [items]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SectionHeader
        title="매물 등록 타임라인"
        subtitle="전국 공매 매물 등록 추이 — 시·도별 집계 + 최근 등록 30건"
        action={<Badge tone="accent">REAL-TIME</Badge>}
      />

      <AutoBanner required={['data_go_kr']} />

      {error && (
        <GlassCard className="border-red-500/30 bg-red-500/5 text-red-300 text-sm">
          {error}
        </GlassCard>
      )}

      {loading && (
        <GlassCard className="text-sm text-[color:var(--text-muted)] text-center">
          <Loader2 className="size-4 inline animate-spin mr-2" />
          전국 공매 데이터 수집 중…
        </GlassCard>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="size-4 text-[color:var(--accent)]" />
            <h3 className="font-semibold text-sm">시·도별 등록 (총 {items.length}건)</h3>
          </div>
          <div className="space-y-1.5">
            {sidoCount.map(([sido, count]) => (
              <div key={sido} className="flex items-center gap-3 text-xs">
                <span className="w-12 shrink-0 text-[color:var(--text-secondary)]">{sido}</span>
                <div className="flex-1 h-5 bg-white/5 rounded overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[color:var(--accent)] to-emerald-400 rounded"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-10 shrink-0 text-right tabular-nums font-semibold">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="size-4 text-[color:var(--accent)]" />
            <h3 className="font-semibold text-sm">최근 등록 30건 (입찰 시작 기준)</h3>
          </div>
          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {recent.map((it, i) => {
              const sido = detectSido(it.cltrAddr);
              return (
                <div
                  key={`${it.cltrNo}-${it.pbctNo}-${i}`}
                  className="flex items-start gap-3 text-xs border-l-2 border-[color:var(--accent)]/40 pl-3 py-1.5"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {sido && <Badge tone="neutral">{sido}</Badge>}
                      <span className="font-medium truncate">{it.cltrNm}</span>
                    </div>
                    <div className="text-[color:var(--text-muted)] text-[10px] mt-0.5 truncate">
                      {it.cltrAddr}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[color:var(--accent)] font-semibold tabular-nums">
                      {formatKRW(it.minBidPrc)}
                    </div>
                    <div className="text-[10px] text-[color:var(--text-muted)] tabular-nums">
                      {it.pbctBgngDtm.slice(0, 10)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="text-xs text-[color:var(--text-muted)]">
          💡 정식 타임라인(일별 누적·소진 추이)은 자체 DB(Supabase 등)에 매물 스냅샷을 저장한 후
          시계열 차트로 시각화합니다. 현재는 온비드 OPEN API의 현재 시점 스냅샷을 시·도별 집계 + 최근 등록 순으로 표시합니다.
        </div>
      </GlassCard>
    </div>
  );
}
