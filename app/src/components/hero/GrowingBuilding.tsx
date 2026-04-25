/**
 * Flexity 톤 — 빌딩이 한 층씩 자라는 애니메이션
 * 12층 빌딩이 0.25s 간격으로 쌓이고, 완공 후 1.5s 유지 → 다시 처음부터 (loop)
 *
 * 단계: 도면(블루프린트) → 골조 → 외장 → 완공 (4 phase × 무한 루프)
 */
'use client';

import { useEffect, useState } from 'react';

const FLOORS = 12;
const FLOOR_HEIGHT = 22; // SVG units
const FLOOR_WIDTH = 110;
const FLOOR_DEPTH = 28;
const BASE_X = 200;
const GROUND_Y = 380;

const PHASES = ['blueprint', 'frame', 'cladding', 'complete'] as const;
type Phase = (typeof PHASES)[number];

const PHASE_DURATION = 5000; // 각 phase 5초
const FLOOR_DELAY = 250; // 층마다 0.25초

export default function GrowingBuilding({ className = '' }: { className?: string }) {
  const [phase, setPhase] = useState<Phase>('blueprint');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => {
        const nextPhaseIdx = (Math.floor((t + 1) / (PHASE_DURATION / 1000)) % PHASES.length);
        setPhase(PHASES[nextPhaseIdx]);
        return t + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 12층까지 한 층씩 자라는 효과
  const visibleFloors = Math.min(FLOORS, Math.floor(((tick % (PHASE_DURATION / 1000)) * 1000) / FLOOR_DELAY) + 1);

  return (
    <svg
      viewBox="0 0 600 480"
      className={className}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bg-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eef0fe" />
          <stop offset="100%" stopColor="#fafbff" />
        </linearGradient>
        <linearGradient id="floor-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#dde1f5" />
        </linearGradient>
        <linearGradient id="frame-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a5b4fc" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <pattern id="blueprint-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(79,70,229,0.2)" strokeWidth="0.5" />
        </pattern>
      </defs>

      {/* 백그라운드 원 */}
      <circle cx="300" cy="220" r="200" fill="url(#bg-grad)" />
      <circle
        cx="300"
        cy="220"
        r="170"
        fill="none"
        stroke="rgba(79,70,229,0.18)"
        strokeWidth="1.2"
        strokeDasharray="4 6"
      />

      {/* 블루프린트 베이스 (phase가 blueprint일 때만 진하게) */}
      <rect
        x={BASE_X - 10}
        y={GROUND_Y - FLOORS * FLOOR_HEIGHT - 10}
        width={FLOOR_WIDTH + 20}
        height={FLOORS * FLOOR_HEIGHT + 20}
        fill="url(#blueprint-grid)"
        opacity={phase === 'blueprint' ? 0.8 : 0.15}
        style={{ transition: 'opacity 0.6s' }}
      />

      {/* 그림자 */}
      <ellipse cx={BASE_X + FLOOR_WIDTH / 2} cy={GROUND_Y + 8} rx={FLOOR_WIDTH / 2 + 8} ry="6" fill="rgba(15,23,42,0.12)" />

      {/* 층 단위로 쌓이는 빌딩 */}
      <g>
        {Array.from({ length: FLOORS }).map((_, i) => {
          const floorIndex = i; // 0=바닥
          const isVisible = floorIndex < visibleFloors;
          const y = GROUND_Y - (floorIndex + 1) * FLOOR_HEIGHT;

          // phase별 외형
          const fill =
            phase === 'blueprint'
              ? 'rgba(79,70,229,0.05)'
              : phase === 'frame'
                ? 'url(#frame-grad)'
                : 'url(#floor-grad)';
          const stroke =
            phase === 'blueprint'
              ? '#4f46e5'
              : phase === 'frame'
                ? '#4338ca'
                : '#a8b0d6';
          const strokeDasharray = phase === 'blueprint' ? '3 3' : 'none';

          return (
            <g
              key={floorIndex}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? 'translate3d(0,0,0) scaleY(1)'
                  : 'translate3d(0,8px,0) scaleY(0.4)',
                transformOrigin: `${BASE_X + FLOOR_WIDTH / 2}px ${y + FLOOR_HEIGHT}px`,
                transition: 'opacity 0.4s ease, transform 0.4s ease',
              }}
            >
              {/* 정면 */}
              <rect
                x={BASE_X}
                y={y}
                width={FLOOR_WIDTH}
                height={FLOOR_HEIGHT}
                fill={fill}
                stroke={stroke}
                strokeWidth="1"
                strokeDasharray={strokeDasharray}
              />
              {/* 측면 (isometric 깊이감) */}
              {phase !== 'blueprint' && (
                <polygon
                  points={`${BASE_X + FLOOR_WIDTH},${y} ${BASE_X + FLOOR_WIDTH + FLOOR_DEPTH},${y - FLOOR_DEPTH * 0.7} ${BASE_X + FLOOR_WIDTH + FLOOR_DEPTH},${y + FLOOR_HEIGHT - FLOOR_DEPTH * 0.7} ${BASE_X + FLOOR_WIDTH},${y + FLOOR_HEIGHT}`}
                  fill={phase === 'frame' ? '#4338ca' : '#c8cfe8'}
                  stroke={stroke}
                  strokeWidth="0.8"
                  opacity={phase === 'frame' ? 0.85 : 1}
                />
              )}
              {/* 윗면 (최상층만) */}
              {phase !== 'blueprint' && floorIndex === FLOORS - 1 && (
                <polygon
                  points={`${BASE_X},${y} ${BASE_X + FLOOR_DEPTH},${y - FLOOR_DEPTH * 0.7} ${BASE_X + FLOOR_WIDTH + FLOOR_DEPTH},${y - FLOOR_DEPTH * 0.7} ${BASE_X + FLOOR_WIDTH},${y}`}
                  fill={phase === 'frame' ? '#6366f1' : '#ffffff'}
                  stroke={stroke}
                  strokeWidth="0.8"
                />
              )}
              {/* 창문 (cladding/complete만) */}
              {(phase === 'cladding' || phase === 'complete') && (
                <>
                  {[0, 1, 2, 3].map((wi) => {
                    const lit =
                      phase === 'complete' && (floorIndex * 7 + wi * 13) % 4 === 0;
                    return (
                      <rect
                        key={wi}
                        x={BASE_X + 10 + wi * 24}
                        y={y + 5}
                        width={16}
                        height={FLOOR_HEIGHT - 10}
                        fill={lit ? '#fbbf24' : 'rgba(79,70,229,0.18)'}
                        rx="1"
                        style={{ transition: 'fill 0.4s' }}
                      />
                    );
                  })}
                </>
              )}
            </g>
          );
        })}
      </g>

      {/* 크레인 (frame phase) */}
      {phase === 'frame' && (
        <g
          stroke="#1a1d2e"
          strokeWidth="1.8"
          fill="none"
          style={{ opacity: 0.85, transition: 'opacity 0.4s' }}
        >
          <line x1={BASE_X + 50} y1={GROUND_Y - FLOORS * FLOOR_HEIGHT - 80} x2={BASE_X + 50} y2={GROUND_Y - 30} />
          <line x1={BASE_X - 10} y1={GROUND_Y - FLOORS * FLOOR_HEIGHT - 70} x2={BASE_X + 130} y2={GROUND_Y - FLOORS * FLOOR_HEIGHT - 80} />
          <line x1={BASE_X + 110} y1={GROUND_Y - FLOORS * FLOOR_HEIGHT - 78} x2={BASE_X + 110} y2={GROUND_Y - FLOORS * FLOOR_HEIGHT - 60} />
          <rect x={BASE_X + 105} y={GROUND_Y - FLOORS * FLOOR_HEIGHT - 60} width="10" height="6" fill="#fbbf24" stroke="none" />
        </g>
      )}

      {/* 하단 라벨 — 현재 단계 */}
      <g transform={`translate(${BASE_X + FLOOR_WIDTH / 2 + 14} ${GROUND_Y + 30})`} textAnchor="middle">
        <rect
          x="-50"
          y="-12"
          width="100"
          height="22"
          rx="11"
          fill="#ffffff"
          stroke="#4f46e5"
          strokeWidth="1"
        />
        <text
          x="0"
          y="3"
          fontSize="11"
          fontWeight="700"
          fill="#4f46e5"
          fontFamily="Pretendard, sans-serif"
        >
          {phase === 'blueprint'
            ? '① 블루프린트'
            : phase === 'frame'
              ? '② 골조 시공'
              : phase === 'cladding'
                ? '③ 외장 마감'
                : '④ 준공'}
        </text>
      </g>

      {/* 점 패턴 (HOWBUILD 우측 상단) */}
      <g fill="rgba(79,70,229,0.25)">
        {Array.from({ length: 6 }).map((_, i) =>
          Array.from({ length: 4 }).map((_, j) => (
            <circle key={`${i}-${j}`} cx={520 + j * 10} cy={30 + i * 10} r="1.5" />
          ))
        )}
      </g>

      {/* 진행 바 */}
      <g transform={`translate(${BASE_X - 10} ${GROUND_Y + 60})`}>
        <rect x="0" y="0" width={FLOOR_WIDTH + 20} height="3" rx="2" fill="#e0e7ff" />
        <rect
          x="0"
          y="0"
          width={((visibleFloors / FLOORS) * (FLOOR_WIDTH + 20)).toFixed(1)}
          height="3"
          rx="2"
          fill="#4f46e5"
          style={{ transition: 'width 0.3s' }}
        />
      </g>
    </svg>
  );
}
