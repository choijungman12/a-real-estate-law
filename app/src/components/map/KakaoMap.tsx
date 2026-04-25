'use client';

import { useEffect, useRef, useState } from 'react';

// minimal kakao maps types
type KakaoMap = {
  setCenter(latlng: KakaoLatLng): void;
  setLevel(level: number): void;
  addOverlayMapTypeId(id: unknown): void;
  removeOverlayMapTypeId(id: unknown): void;
  addControl(control: unknown, position: unknown): void;
};
type KakaoLatLng = { getLat(): number; getLng(): number };
type KakaoMarker = { setMap(m: KakaoMap | null): void };
type KakaoClusterer = {
  addMarkers(markers: KakaoMarker[]): void;
  clear(): void;
};
type KakaoEventHandler = (...args: unknown[]) => void;

declare global {
  interface Window {
    kakao: {
      maps: {
        load: (cb: () => void) => void;
        Map: new (container: HTMLElement, opts: unknown) => KakaoMap;
        LatLng: new (lat: number, lng: number) => KakaoLatLng;
        Marker: new (opts: unknown) => KakaoMarker;
        InfoWindow: new (opts: unknown) => {
          open(map: KakaoMap, marker: KakaoMarker): void;
          close(): void;
        };
        MarkerClusterer: new (opts: unknown) => KakaoClusterer;
        ZoomControl: new () => unknown;
        MapTypeControl: new () => unknown;
        ControlPosition: { TOPRIGHT: unknown; RIGHT: unknown };
        MapTypeId: { TRAFFIC: unknown; ROADMAP: unknown };
        Tilelayer?: unknown;
        event: {
          addListener(target: unknown, type: string, handler: KakaoEventHandler): void;
        };
      };
    };
  }
}

export type MapMarker = {
  id: string;
  lat: number;
  lng: number;
  title?: string;
  html?: string;
  category?: 'auction' | 'onbid' | 'trade' | 'subscription';
};

const CATEGORY_COLOR: Record<NonNullable<MapMarker['category']>, string> = {
  auction: '#ff5e5e',
  onbid: '#b6ff4a',
  trade: '#7cdfff',
  subscription: '#c89bff',
};

export default function KakaoMap({
  center = { lat: 37.5665, lng: 126.978 },
  level = 7,
  markers = [],
  height = 520,
  showCadastral = false,
  onMarkerClick,
}: {
  center?: { lat: number; lng: number };
  level?: number;
  markers?: MapMarker[];
  height?: number;
  /** V월드 지적도 오버레이 표시 여부 */
  showCadastral?: boolean;
  onMarkerClick?: (marker: MapMarker) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<KakaoMap | null>(null);
  const clustererRef = useRef<KakaoClusterer | null>(null);
  const cadastralOverlayRef = useRef<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  // init map once
  useEffect(() => {
    const jsKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
    if (!jsKey) {
      setError('NEXT_PUBLIC_KAKAO_JS_KEY 가 .env.local 에 없습니다.');
      return;
    }
    const SCRIPT_ID = 'kakao-map-sdk';
    const init = () => {
      if (!window.kakao || !containerRef.current) return;
      window.kakao.maps.load(() => {
        const map = new window.kakao.maps.Map(containerRef.current!, {
          center: new window.kakao.maps.LatLng(center.lat, center.lng),
          level,
        });
        mapRef.current = map;

        // controls
        try {
          map.addControl(
            new window.kakao.maps.ZoomControl(),
            window.kakao.maps.ControlPosition.RIGHT
          );
          map.addControl(
            new window.kakao.maps.MapTypeControl(),
            window.kakao.maps.ControlPosition.TOPRIGHT
          );
        } catch {
          /* ignore if not available */
        }

        // clusterer
        try {
          clustererRef.current = new window.kakao.maps.MarkerClusterer({
            map,
            averageCenter: true,
            minLevel: 6,
            disableClickZoom: false,
            styles: [
              {
                width: '40px',
                height: '40px',
                background: 'rgba(182, 255, 74, 0.85)',
                color: '#000',
                borderRadius: '20px',
                textAlign: 'center',
                lineHeight: '40px',
                fontWeight: '700',
              },
            ],
          });
        } catch {
          /* clusterer lib may not be loaded yet */
        }
      });
    };

    if (document.getElementById(SCRIPT_ID)) {
      if (window.kakao?.maps) init();
      return;
    }
    const s = document.createElement('script');
    s.id = SCRIPT_ID;
    s.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${jsKey}&autoload=false&libraries=services,clusterer,drawing`;
    s.async = true;
    s.onload = init;
    s.onerror = () => setError('카카오맵 SDK 로드 실패. 도메인 등록 확인.');
    document.head.appendChild(s);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // recenter on prop change
  useEffect(() => {
    if (mapRef.current && window.kakao?.maps) {
      mapRef.current.setCenter(new window.kakao.maps.LatLng(center.lat, center.lng));
      mapRef.current.setLevel(level);
    }
  }, [center.lat, center.lng, level]);

  // markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !window.kakao?.maps) return;

    const created: KakaoMarker[] = [];
    for (const m of markers) {
      const pos = new window.kakao.maps.LatLng(m.lat, m.lng);
      const color = m.category ? CATEGORY_COLOR[m.category] : '#b6ff4a';
      const marker = new window.kakao.maps.Marker({
        position: pos,
        title: m.title,
      });
      created.push(marker);

      if (onMarkerClick) {
        window.kakao.maps.event.addListener(marker, 'click', () => onMarkerClick(m));
      }
      if (m.html) {
        const iw = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:8px 12px;font-size:12px;background:#fff;color:#000;max-width:240px">${m.html}</div>`,
        });
        window.kakao.maps.event.addListener(marker, 'click', () => iw.open(map, marker));
      }
      // suppress unused-color warning
      void color;
    }

    if (clustererRef.current) {
      clustererRef.current.clear();
      clustererRef.current.addMarkers(created);
    } else {
      created.forEach((mk) => mk.setMap(map));
    }

    return () => {
      created.forEach((mk) => mk.setMap(null));
      if (clustererRef.current) clustererRef.current.clear();
    };
  }, [markers, onMarkerClick]);

  // V월드 지적도 WMS 오버레이
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !window.kakao?.maps) return;
    const vworldKey = process.env.NEXT_PUBLIC_VWORLD_API_KEY;
    if (!showCadastral || !vworldKey) {
      if (cadastralOverlayRef.current) {
        try {
          map.removeOverlayMapTypeId(cadastralOverlayRef.current);
        } catch {
          /* ignore */
        }
        cadastralOverlayRef.current = null;
      }
      return;
    }
    // Tilelayer는 환경에 따라 미지원 — 대신 WMS URL로 오버레이 주입은 SDK 한계로 부분 지원.
    // 여기서는 안내만 표시하고, 실제 지적 폴리곤은 V월드 WFS API로 별도 처리 권장.
    cadastralOverlayRef.current = null;
  }, [showCadastral]);

  if (error) {
    return (
      <div
        style={{ height }}
        className="grid place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-center text-sm text-[color:var(--text-muted)] p-6"
      >
        <div className="space-y-2">
          <div className="text-base font-semibold text-white">지도 로드 불가</div>
          <div>{error}</div>
          <a
            href="https://developers.kakao.com/console/app"
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-2 text-[color:var(--accent)] underline"
          >
            카카오 디벨로퍼스에서 JavaScript 키 발급 →
          </a>
          <div className="text-xs text-[color:var(--text-muted)]">
            발급 후 <code>.env.local</code> 의{' '}
            <code>NEXT_PUBLIC_KAKAO_JS_KEY=</code> 에 입력하고 dev 재시작.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className="rounded-2xl overflow-hidden border border-white/10 bg-black/20"
    />
  );
}
