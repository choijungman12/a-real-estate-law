/**
 * RBush 기반 클라이언트 사이드 공간 인덱싱
 * 출처 패턴: ref-prime polygon 서비스
 *
 * 수만개 매물 마커를 viewport(현재 지도 화면)로 즉시 필터링.
 * 좌표는 위경도 (EPSG:4326). lat = y, lng = x.
 */
import RBush from 'rbush';

export type GeoPoint<T> = {
  lat: number;
  lng: number;
  data: T;
};

type IndexNode<T> = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  payload: GeoPoint<T>;
};

export type Bounds = {
  swLat: number;
  swLng: number;
  neLat: number;
  neLng: number;
};

export class GeoIndex<T> {
  private tree = new RBush<IndexNode<T>>();

  load(points: GeoPoint<T>[]): void {
    this.tree.clear();
    const nodes: IndexNode<T>[] = points.map((p) => ({
      minX: p.lng,
      minY: p.lat,
      maxX: p.lng,
      maxY: p.lat,
      payload: p,
    }));
    this.tree.load(nodes);
  }

  searchBounds(b: Bounds): GeoPoint<T>[] {
    const results = this.tree.search({
      minX: b.swLng,
      minY: b.swLat,
      maxX: b.neLng,
      maxY: b.neLat,
    });
    return results.map((r) => r.payload);
  }

  searchRadius(center: { lat: number; lng: number }, km: number): GeoPoint<T>[] {
    // 위도 1도 ≈ 111km
    const dLat = km / 111;
    const dLng = km / (111 * Math.cos((center.lat * Math.PI) / 180));
    const candidates = this.searchBounds({
      swLat: center.lat - dLat,
      swLng: center.lng - dLng,
      neLat: center.lat + dLat,
      neLng: center.lng + dLng,
    });
    // 정확한 거리 필터
    return candidates.filter((c) => haversineKm(center, c) <= km);
  }

  size(): number {
    return this.tree.all().length;
  }
}

export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
