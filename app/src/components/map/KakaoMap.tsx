'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    kakao: {
      maps: {
        load: (cb: () => void) => void;
        Map: new (container: HTMLElement, opts: unknown) => unknown;
        LatLng: new (y: number, x: number) => unknown;
        Marker: new (opts: unknown) => { setMap: (m: unknown) => void };
        InfoWindow: new (opts: unknown) => { open: (m: unknown, marker: unknown) => void };
        services?: unknown;
      };
    };
  }
}

export type MapMarker = {
  lat: number;
  lng: number;
  title?: string;
  html?: string;
};

export default function KakaoMap({
  center = { lat: 37.5665, lng: 126.978 },
  level = 5,
  markers = [],
  height = 480,
}: {
  center?: { lat: number; lng: number };
  level?: number;
  markers?: MapMarker[];
  height?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<unknown>(null);

  useEffect(() => {
    const jsKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
    if (!jsKey) {
      console.error('NEXT_PUBLIC_KAKAO_JS_KEY 가 .env.local 에 없습니다.');
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
        for (const m of markers) {
          const marker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(m.lat, m.lng),
            title: m.title,
          });
          marker.setMap(map);
          if (m.html) {
            new window.kakao.maps.InfoWindow({
              content: m.html,
            }).open(map, marker);
          }
        }
      });
    };
    if (document.getElementById(SCRIPT_ID)) {
      init();
      return;
    }
    const s = document.createElement('script');
    s.id = SCRIPT_ID;
    s.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${jsKey}&autoload=false&libraries=services,clusterer`;
    s.async = true;
    s.onload = init;
    document.head.appendChild(s);
  }, [center.lat, center.lng, level, markers]);

  return <div ref={containerRef} style={{ width: '100%', height }} />;
}
