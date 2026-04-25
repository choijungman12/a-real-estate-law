/**
 * Flexity 톤 — 흰 도시 미니어처 위에 컬러 빌딩이 4단계로 변환
 * ① 부지 검토 (녹지 + 오렌지 대지)
 * ② 상업 + 오피스 (하늘색 층 슬랩 + 오렌지 podium)
 * ③ 평면 계획 (옐로우 격자 큰 빌딩)
 * ④ 단지 계획 / 복수동 (옐로우 트윈 타워 + 오렌지 부지)
 */
'use client';

import { useEffect, useState } from 'react';

const PHASES = [
  { key: 'site', label: '부지 검토 / 주차 계획' },
  { key: 'office', label: '상업 + 오피스' },
  { key: 'plan', label: '평면 계획' },
  { key: 'complex', label: '단지 계획 / 복수동' },
] as const;

type Phase = (typeof PHASES)[number]['key'];

const PHASE_DURATION_MS = 5000;

export default function WhiteCityScenario({ className = '' }: { className?: string }) {
  const [phaseIdx, setPhaseIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPhaseIdx((i) => (i + 1) % PHASES.length), PHASE_DURATION_MS);
    return () => clearInterval(t);
  }, []);
  const phase: Phase = PHASES[phaseIdx].key;

  return (
    <svg
      viewBox="0 0 720 560"
      className={className}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* 부드러운 그림자 */}
        <filter id="city-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
          <feOffset dy="10" />
          <feComponentTransfer><feFuncA type="linear" slope="0.18" /></feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* 컬러 빌딩 그라디언트 */}
        <linearGradient id="g-blue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bfe7ff" />
          <stop offset="100%" stopColor="#83c8ec" />
        </linearGradient>
        <linearGradient id="g-yellow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f8d066" />
        </linearGradient>
        <linearGradient id="g-orange" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea7325" />
        </linearGradient>
        <linearGradient id="g-white-bldg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e5e7eb" />
        </linearGradient>
        <linearGradient id="g-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fafbff" />
          <stop offset="100%" stopColor="#f1f3fa" />
        </linearGradient>
      </defs>

      {/* 백그라운드 — 거의 흰색 */}
      <rect x="0" y="0" width="720" height="560" fill="url(#g-bg)" />

      {/* ─── 주변 흰 도시 미니어처 빌딩 매스 ──────── */}
      <g filter="url(#city-shadow)">
        {/* 좌측 상단 빌딩 군 */}
        <WhiteBlock x={20} y={120} w={90} h={140} d={20} />
        <WhiteBlock x={70} y={70} w={70} h={180} d={20} />
        <WhiteBlock x={130} y={150} w={80} h={120} d={20} />

        {/* 좌측 하단 */}
        <WhiteBlock x={20} y={360} w={110} h={90} d={20} />
        <WhiteBlock x={140} y={400} w={90} h={70} d={20} />

        {/* 우측 상단 */}
        <WhiteBlock x={510} y={80} w={90} h={170} d={20} />
        <WhiteBlock x={590} y={60} w={80} h={200} d={20} />
        <WhiteBlock x={620} y={180} w={80} h={130} d={20} />

        {/* 우측 하단 */}
        <WhiteBlock x={510} y={360} w={90} h={100} d={20} />
        <WhiteBlock x={610} y={380} w={90} h={90} d={20} />
        <WhiteBlock x={630} y={460} w={70} h={60} d={20} />

        {/* 도로 사이 작은 매스 */}
        <WhiteBlock x={290} y={50} w={90} h={50} d={15} />
        <WhiteBlock x={400} y={60} w={80} h={70} d={18} />
      </g>

      {/* ─── 중앙 시나리오 영역 (그림자) ──────── */}
      <ellipse cx="360" cy="450" rx="190" ry="22" fill="rgba(15,23,42,0.12)" />

      {/* ─── 4단계 시나리오 빌딩 ──────── */}
      {/* phase ①: 부지 검토 */}
      <g style={{ opacity: phase === 'site' ? 1 : 0, transition: 'opacity 0.6s' }}>
        {/* 오렌지 대지 */}
        <Plate cx={360} cy={420} w={260} d={120} fill="url(#g-orange)" />
        {/* 녹지 */}
        <Plate cx={420} cy={460} w={120} d={70} fill="#86efac" />
        {/* 주차 라인 */}
        <g stroke="rgba(0,0,0,0.4)" strokeWidth="0.8" opacity="0.6">
          {Array.from({ length: 7 }).map((_, i) => (
            <line key={i} x1={280 + i * 22} y1={400} x2={290 + i * 22} y2={420} />
          ))}
        </g>
      </g>

      {/* phase ②: 상업 + 오피스 (블루 슬랩 빌딩) */}
      <g style={{ opacity: phase === 'office' ? 1 : 0, transition: 'opacity 0.6s' }}>
        <Plate cx={360} cy={430} w={240} d={100} fill="url(#g-orange)" />
        <SlabBuilding cx={360} baseY={420} w={180} d={80} floors={11} fill="url(#g-blue)" stroke="#1e3a8a" />
        {/* 녹지 */}
        <polygon points="430,460 510,470 500,500 420,490" fill="#86efac" stroke="#000" strokeWidth="1" />
      </g>

      {/* phase ③: 평면 계획 (옐로우 격자) */}
      <g style={{ opacity: phase === 'plan' ? 1 : 0, transition: 'opacity 0.6s' }}>
        <Plate cx={360} cy={430} w={250} d={110} fill="url(#g-blue)" />
        <Plate cx={365} cy={440} w={250} d={100} fill="url(#g-orange)" />
        <GridBuilding cx={360} baseY={420} w={200} d={90} floors={10} cols={9} fill="url(#g-yellow)" stroke="#854d0e" />
      </g>

      {/* phase ④: 단지 / 복수동 (트윈 옐로우 타워) */}
      <g style={{ opacity: phase === 'complex' ? 1 : 0, transition: 'opacity 0.6s' }}>
        <Plate cx={360} cy={440} w={300} d={140} fill="url(#g-orange)" />
        <polygon points="430,490 540,500 530,540 420,530" fill="#86efac" stroke="#000" strokeWidth="1" />
        <SlabBuilding cx={290} baseY={425} w={90} d={50} floors={16} fill="url(#g-yellow)" stroke="#854d0e" />
        <SlabBuilding cx={420} baseY={425} w={90} d={50} floors={16} fill="url(#g-yellow)" stroke="#854d0e" />
      </g>

      {/* ─── 라벨 (현재 단계) ──────── */}
      <g transform="translate(360 510)" textAnchor="middle">
        <rect
          x="-90"
          y="-16"
          width="180"
          height="30"
          rx="15"
          fill="#ffffff"
          stroke="#4f46e5"
          strokeWidth="1.5"
        />
        <text x="0" y="3" fontSize="13" fontWeight="700" fill="#4f46e5" fontFamily="Pretendard, sans-serif">
          {PHASES[phaseIdx].label}
        </text>
      </g>

      {/* 진행 도트 */}
      <g transform="translate(360 545)" textAnchor="middle">
        {PHASES.map((_, i) => (
          <circle
            key={i}
            cx={(i - 1.5) * 14}
            cy={0}
            r="3"
            fill={i === phaseIdx ? '#4f46e5' : '#d1d5db'}
            style={{ transition: 'fill 0.3s' }}
          />
        ))}
      </g>
    </svg>
  );
}

/* ─── primitives ──────── */

function WhiteBlock({
  x,
  y,
  w,
  h,
  d,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  d: number;
}) {
  // isometric depth: 우측·아랫면
  return (
    <g>
      {/* 정면 */}
      <rect x={x} y={y} width={w} height={h} fill="url(#g-white-bldg)" stroke="#d1d5db" strokeWidth="0.6" />
      {/* 윗면 */}
      <polygon
        points={`${x},${y} ${x + d},${y - d * 0.5} ${x + w + d},${y - d * 0.5} ${x + w},${y}`}
        fill="#ffffff"
        stroke="#d1d5db"
        strokeWidth="0.6"
      />
      {/* 우측면 */}
      <polygon
        points={`${x + w},${y} ${x + w + d},${y - d * 0.5} ${x + w + d},${y + h - d * 0.5} ${x + w},${y + h}`}
        fill="#e5e7eb"
        stroke="#d1d5db"
        strokeWidth="0.6"
      />
    </g>
  );
}

function Plate({ cx, cy, w, d, fill }: { cx: number; cy: number; w: number; d: number; fill: string }) {
  // 다이아몬드 형태 isometric 베이스 플레이트
  const half = w / 2;
  const dh = d / 2;
  return (
    <g>
      <polygon
        points={`${cx - half},${cy} ${cx},${cy - dh * 0.7} ${cx + half},${cy} ${cx},${cy + dh * 0.7}`}
        fill={fill}
        stroke="#000"
        strokeWidth="1.2"
      />
    </g>
  );
}

function SlabBuilding({
  cx,
  baseY,
  w,
  d,
  floors,
  fill,
  stroke,
}: {
  cx: number;
  baseY: number;
  w: number;
  d: number;
  floors: number;
  fill: string;
  stroke: string;
}) {
  const totalH = floors * 14;
  const x = cx - w / 2;
  const y = baseY - totalH;
  return (
    <g style={{ transformOrigin: `${cx}px ${baseY}px` }}>
      {/* 우측 깊이면 */}
      <polygon
        points={`${x + w},${y} ${x + w + d},${y - d * 0.6} ${x + w + d},${y + totalH - d * 0.6} ${x + w},${y + totalH}`}
        fill={stroke}
        opacity="0.85"
      />
      {/* 윗면 */}
      <polygon
        points={`${x},${y} ${x + d},${y - d * 0.6} ${x + w + d},${y - d * 0.6} ${x + w},${y}`}
        fill={fill}
        stroke="#000"
        strokeWidth="1.2"
      />
      {/* 정면 */}
      <rect x={x} y={y} width={w} height={totalH} fill={fill} stroke="#000" strokeWidth="1.2" />
      {/* 층 슬랩 라인 */}
      {Array.from({ length: floors }).map((_, i) => (
        <line
          key={i}
          x1={x}
          y1={y + (i + 1) * 14}
          x2={x + w}
          y2={y + (i + 1) * 14}
          stroke="rgba(0,0,0,0.4)"
          strokeWidth="0.6"
        />
      ))}
    </g>
  );
}

function GridBuilding({
  cx,
  baseY,
  w,
  d,
  floors,
  cols,
  fill,
  stroke,
}: {
  cx: number;
  baseY: number;
  w: number;
  d: number;
  floors: number;
  cols: number;
  fill: string;
  stroke: string;
}) {
  const totalH = floors * 14;
  const x = cx - w / 2;
  const y = baseY - totalH;
  const cellW = w / cols;
  return (
    <g>
      {/* 우측 깊이면 */}
      <polygon
        points={`${x + w},${y} ${x + w + d},${y - d * 0.6} ${x + w + d},${y + totalH - d * 0.6} ${x + w},${y + totalH}`}
        fill={stroke}
        opacity="0.85"
      />
      {/* 윗면 */}
      <polygon
        points={`${x},${y} ${x + d},${y - d * 0.6} ${x + w + d},${y - d * 0.6} ${x + w},${y}`}
        fill={fill}
        stroke="#000"
        strokeWidth="1.2"
      />
      {/* 정면 */}
      <rect x={x} y={y} width={w} height={totalH} fill={fill} stroke="#000" strokeWidth="1.2" />
      {/* 격자 */}
      {Array.from({ length: floors }).map((_, i) => (
        <line key={`r${i}`} x1={x} y1={y + (i + 1) * 14} x2={x + w} y2={y + (i + 1) * 14} stroke="rgba(0,0,0,0.5)" strokeWidth="0.5" />
      ))}
      {Array.from({ length: cols - 1 }).map((_, i) => (
        <line
          key={`c${i}`}
          x1={x + (i + 1) * cellW}
          y1={y}
          x2={x + (i + 1) * cellW}
          y2={y + totalH}
          stroke="rgba(0,0,0,0.5)"
          strokeWidth="0.5"
        />
      ))}
      {/* 옥상 옅은 회색 박스 (엘리베이터) */}
      <rect x={x + w / 2 - 8} y={y - 8} width={16} height={6} fill="#9ca3af" stroke="#000" strokeWidth="0.6" />
    </g>
  );
}
