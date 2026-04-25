'use client';

import { useEffect, useMemo, useState } from 'react';
import KakaoMap, { type MapMarker } from '@/components/map/KakaoMap';
import PropertyDetailModal, {
  type DetailItem,
} from '@/components/map/PropertyDetailModal';
import { GlassCard, Badge, SectionHeader } from '@/components/ui/Glass';
import AutoBanner from '@/components/common/AutoBanner';
import { formatKRW } from '@/lib/utils/cn';
import { GeoIndex } from '@/lib/spatial/rbush-helper';
import type { OnbidItem } from '@/lib/api/onbid';
import { Layers, MapPin, Loader2, Search } from 'lucide-react';

type Layer = 'onbid' | 'cadastral';

type IndexedItem = {
  marker: MapMarker;
  detail: DetailItem;
};

export default function MapPage() {
  const [layers, setLayers] = useState<Record<Layer, boolean>>({
    onbid: true,
    cadastral: false,
  });
  const [indexed, setIndexed] = useState<IndexedItem[]>([]);
  const [items, setItems] = useState<OnbidItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [picked, setPicked] = useState<DetailItem | null>(null);
  const [filterText, setFilterText] = useState('');

  // Build RBush index whenever indexed items change
  const geoIndex = useMemo(() => {
    const idx = new GeoIndex<IndexedItem>();
    idx.load(
      indexed.map((it) => ({ lat: it.marker.lat, lng: it.marker.lng, data: it }))
    );
    return idx;
  }, [indexed]);

  // Filter markers by text
  const visibleMarkers = useMemo(() => {
    const f = filterText.toLowerCase().trim();
    return indexed
      .filter((it) =>
        f
          ? (it.marker.title?.toLowerCase().includes(f) ?? false) ||
            (it.detail.address.toLowerCase().includes(f))
          : true
      )
      .map((it) => it.marker);
  }, [indexed, filterText]);

  useEffect(() => {
    if (!layers.onbid) {
      setIndexed([]);
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

        const accumulated: IndexedItem[] = [];
        for (const it of list.slice(0, 25)) {
          if (!it.cltrAddr) continue;
          try {
            const r = await fetch(
              `/api/geocode?address=${encodeURIComponent(it.cltrAddr)}`
            );
            if (!r.ok) continue;
            const c = await r.json();
            const id = `${it.cltrNo}-${it.pbctNo}`;
            const detail: DetailItem = {
              id,
              title: it.cltrNm,
              address: it.cltrAddr,
              category: 'onbid',
              appraisalAmount: it.apprAmt,
              minimumBidPrice: it.minBidPrc,
              startDate: it.pbctBgngDtm.slice(0, 10),
              endDate: it.pbctEndDtm.slice(0, 10),
              lat: c.y,
              lng: c.x,
            };
            const marker: MapMarker = {
              id,
              lat: c.y,
              lng: c.x,
              title: it.cltrNm,
              category: 'onbid',
              html: `<strong>${it.cltrNm}</strong><br/>${it.cltrAddr}<br/>최저가 ${formatKRW(it.minBidPrc)}`,
            };
            accumulated.push({ marker, detail });
            if (!cancelled) setIndexed([...accumulated]);
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

  const handleMarkerClick = (m: MapMarker) => {
    const found = indexed.find((it) => it.marker.id === m.id);
    if (found) setPicked(found.detail);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SectionHeader
        title="GIS 통합 지도"
        subtitle="카카오맵 + V월드 + RBush 공간인덱스 + 매물 클릭 시 인근 실거래가 자동 비교"
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

          {/* Filter */}
          <GlassCard>
            <div className="text-xs uppercase tracking-wider text-[color:var(--text-muted)] mb-2 flex items-center gap-2">
              <Search className="size-3" /> 텍스트 필터
            </div>
            <input
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="물건명·주소"
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-[color:var(--accent)]/40"
            />
            <div className="text-[10px] text-[color:var(--text-muted)] mt-2">
              매칭 {visibleMarkers.length} / 인덱스 {geoIndex.size()}
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

          <GlassCard className="text-[10px] text-[color:var(--text-muted)]">
            <div className="flex items-center gap-2 mb-1 text-[color:var(--text-secondary)] text-xs">
              <MapPin className="size-3" /> 사용법
            </div>
            매물 마커를 클릭하면 인근 시·군·구의 최근 3개월 실거래가가 자동으로 조회됩니다.
            중간값 대비 할인율도 표시됩니다.
          </GlassCard>
        </div>

        {/* Map */}
        <div className="lg:col-span-3">
          <KakaoMap
            markers={visibleMarkers}
            showCadastral={layers.cadastral}
            height={620}
            onMarkerClick={handleMarkerClick}
          />
          <div className="mt-2 flex items-center justify-between text-xs text-[color:var(--text-muted)]">
            <span>
              마커 {visibleMarkers.length}개 표시 (전체 {items.length}건 중 좌표 변환 성공분)
            </span>
            <span>출처: 온비드 OPEN API · V월드 Geocoder · 카카오맵 SDK</span>
          </div>
        </div>
      </div>

      <PropertyDetailModal item={picked} onClose={() => setPicked(null)} />
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
        {typeof count === 'number' && <Badge tone="neutral">{count}</Badge>}
        <span
          className={`size-4 rounded-full border-2 ${
            active
              ? 'border-[color:var(--accent)] bg-[color:var(--accent)]'
              : 'border-white/30'
          }`}
        />
      </div>
    </button>
  );
}
