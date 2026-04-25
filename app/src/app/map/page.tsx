'use client';

import { useEffect, useState } from 'react';
import KakaoMap, { type MapMarker } from '@/components/map/KakaoMap';
import { GlassCard, Badge, SectionHeader } from '@/components/ui/Glass';
import AutoBanner from '@/components/common/AutoBanner';
import { formatKRW } from '@/lib/utils/cn';
import type { OnbidItem } from '@/lib/api/onbid';
import { Layers, MapPin, Loader2 } from 'lucide-react';

type Layer = 'onbid' | 'cadastral';

export default function MapPage() {
  const [layers, setLayers] = useState<Record<Layer, boolean>>({
    onbid: true,
    cadastral: false,
  });
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [items, setItems] = useState<OnbidItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [picked, setPicked] = useState<MapMarker | null>(null);


  useEffect(() => {
    if (!layers.onbid) {
      setMarkers([]);
      setItems([]);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/onbid?page=1&rows=30');
        if (!res.ok) throw new Error((await res.json()).error ?? 'API 오류');
        const j = await res.json();
        if (cancelled) return;
        const list: OnbidItem[] = j.items ?? [];
        setItems(list);

        // 주소 → 좌표 변환 (V월드 Geocoder), 실패는 건너뜀
        const geocoded: MapMarker[] = [];
        for (const it of list.slice(0, 20)) {
          if (!it.cltrAddr) continue;
          try {
            const r = await fetch(
              `/api/geocode?address=${encodeURIComponent(it.cltrAddr)}`
            );
            if (!r.ok) continue;
            const c = await r.json();
            geocoded.push({
              id: `${it.cltrNo}-${it.pbctNo}`,
              lat: c.y,
              lng: c.x,
              title: it.cltrNm,
              category: 'onbid',
              html: `<strong>${it.cltrNm}</strong><br/>${it.cltrAddr}<br/>최저가 ${formatKRW(it.minBidPrc)}`,
            });
            if (!cancelled) setMarkers([...geocoded]);
          } catch {
            /* skip */
          }
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : '오류');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [layers.onbid]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SectionHeader
        title="GIS 통합 지도"
        subtitle="카카오맵 + V월드 지적 + 온비드 공매 매물 클러스터링"
        action={<Badge tone="accent">REAL DATA</Badge>}
      />

      <AutoBanner
        required={['kakao_js', 'data_go_kr']}
        optional={['vworld']}
      />


      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Layer panel */}
        <div className="space-y-4">
          <GlassCard>
            <div className="text-xs uppercase tracking-wider text-[color:var(--text-muted)] mb-3 flex items-center gap-2">
              <Layers className="size-3" /> 레이어
            </div>
            <div className="space-y-2">
              <LayerToggle
                label="공매 매물 (온비드)"
                color="#b6ff4a"
                active={layers.onbid}
                onChange={(v) => setLayers((s) => ({ ...s, onbid: v }))}
                count={items.length || undefined}
              />
              <LayerToggle
                label="지적도 (V월드)"
                color="#ff7e7e"
                active={layers.cadastral}
                onChange={(v) => setLayers((s) => ({ ...s, cadastral: v }))}
                disabled={!process.env.NEXT_PUBLIC_VWORLD_API_KEY}
                hint={
                  !process.env.NEXT_PUBLIC_VWORLD_API_KEY
                    ? 'V월드 키 필요'
                    : undefined
                }
              />
            </div>
          </GlassCard>

          {loading && (
            <GlassCard className="text-xs text-[color:var(--text-muted)]">
              <Loader2 className="size-3 inline animate-spin mr-2" />
              주소 → 좌표 변환 중…
            </GlassCard>
          )}

          {error && (
            <GlassCard className="border-red-500/30 bg-red-500/5 text-red-300 text-xs">
              {error}
            </GlassCard>
          )}

          {picked && (
            <GlassCard className="border-[color:var(--accent)]/30">
              <div className="flex items-start gap-2">
                <MapPin className="size-4 text-[color:var(--accent)] shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{picked.title}</div>
                  {picked.html && (
                    <div
                      className="text-xs text-[color:var(--text-secondary)] mt-1"
                      dangerouslySetInnerHTML={{
                        __html: picked.html.replace(/<br\s*\/?>/g, ' · '),
                      }}
                    />
                  )}
                </div>
              </div>
            </GlassCard>
          )}
        </div>

        {/* Map */}
        <div className="lg:col-span-3">
          <KakaoMap
            markers={markers}
            showCadastral={layers.cadastral}
            height={620}
            onMarkerClick={(m) => setPicked(m)}
          />
          <div className="mt-2 flex items-center justify-between text-xs text-[color:var(--text-muted)]">
            <span>마커 {markers.length}개 표시 (전체 {items.length}건 중 좌표 변환 성공분)</span>
            <span>출처: 온비드 OPEN API · V월드 Geocoder · 카카오맵 SDK</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LayerToggle({
  label,
  color,
  active,
  onChange,
  count,
  disabled,
  hint,
}: {
  label: string;
  color: string;
  active: boolean;
  onChange: (v: boolean) => void;
  count?: number;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <button
      onClick={() => !disabled && onChange(!active)}
      disabled={disabled}
      className={`w-full flex items-center justify-between rounded-lg border px-3 py-2 text-left transition ${
        disabled
          ? 'opacity-40 cursor-not-allowed border-white/5'
          : active
            ? 'bg-white/8 border-white/15'
            : 'bg-white/[0.02] border-white/5 hover:bg-white/5'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span
          className="size-2.5 rounded-full shrink-0"
          style={{ background: color }}
        />
        <div className="min-w-0">
          <div className="text-sm">{label}</div>
          {hint && <div className="text-[10px] text-[color:var(--text-muted)]">{hint}</div>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {typeof count === 'number' && (
          <Badge tone="neutral">{count}</Badge>
        )}
        <span
          className={`size-4 rounded-full border-2 ${
            active ? 'border-[color:var(--accent)] bg-[color:var(--accent)]' : 'border-white/30'
          }`}
        />
      </div>
    </button>
  );
}
