'use client';

/**
 * 3D 부동산 시뮬레이션 (react-three-fiber)
 * 사용자 제공 이미지 톤 — 흰 도시 미니어처 + 중앙 컬러 빌딩 4단계
 *
 * 스펙:
 * - 카메라: isometric (35° fov, [12, 10, 12])
 * - 자동 회전 (천천히)
 * - 컬러 빌딩에 검정 외곽선 (Edges)
 * - 부드러운 contact shadows + 디렉셔널 라이트
 * - 4단계 시나리오: 부지 → 상업오피스 → 평면계획 → 트윈타워
 */
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Edges, ContactShadows, Html } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import type { Group } from 'three';

const PHASES = [
  { key: 'site', label: '부지 검토 / 주차 계획 지원' },
  { key: 'office', label: '상업 + 오피스' },
  { key: 'plan', label: '평면 계획 지원' },
  { key: 'twin', label: '단지 계획 / 복수동 지원' },
] as const;

const PHASE_DURATION_MS = 5000;

/* ─── 주변 흰 도시 미니어처 빌딩 정의 ───────────────────────── */
const WHITE_BLOCKS: { x: number; z: number; w: number; h: number; d: number }[] = [
  // 좌측 군집
  { x: -7, z: -3, w: 1.6, h: 3.5, d: 1.6 },
  { x: -8, z: -1, w: 1.4, h: 5, d: 1.4 },
  { x: -7.5, z: 1, w: 1.8, h: 2.8, d: 1.8 },
  { x: -6, z: 3, w: 1.6, h: 4.2, d: 1.6 },
  { x: -8, z: 4.5, w: 2, h: 2.5, d: 1.6 },
  // 우측 군집
  { x: 7, z: -3, w: 1.6, h: 4.5, d: 1.6 },
  { x: 8.5, z: -1, w: 1.6, h: 6, d: 1.6 },
  { x: 7.5, z: 1.5, w: 2, h: 3.5, d: 1.6 },
  { x: 8, z: 3.5, w: 1.6, h: 2.8, d: 1.6 },
  { x: 6.5, z: 5, w: 1.4, h: 3, d: 1.4 },
  // 상단 (뒤쪽) 군집
  { x: -3, z: -6, w: 1.6, h: 4, d: 1.6 },
  { x: -1, z: -7, w: 1.8, h: 5.5, d: 1.6 },
  { x: 1.5, z: -6.5, w: 1.6, h: 3.5, d: 1.6 },
  { x: 3.5, z: -6, w: 1.6, h: 4.2, d: 1.6 },
  // 하단 (앞쪽) 작은 매스
  { x: -3, z: 6, w: 1.4, h: 1.8, d: 1.2 },
  { x: -1, z: 6.5, w: 1.6, h: 2, d: 1.2 },
  { x: 2, z: 6.5, w: 1.6, h: 1.8, d: 1.2 },
  { x: 4, z: 6, w: 1.4, h: 2.2, d: 1.2 },
];

const COLORS = {
  white: '#f4f5f8',
  whiteEdge: '#c7cad3',
  blue: '#83c8ec',
  blueEdge: '#1e3a8a',
  yellow: '#f8d066',
  yellowEdge: '#854d0e',
  orange: '#fb923c',
  orangeEdge: '#9a3412',
  green: '#86efac',
  greenEdge: '#15803d',
  ground: '#fafbff',
};

/* ─── 메인 컴포넌트 ───────────────────────── */
export default function Building3DScene() {
  const [phaseIdx, setPhaseIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPhaseIdx((i) => (i + 1) % PHASES.length), PHASE_DURATION_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ width: '100%', height: 520, position: 'relative' }}>
      <Canvas
        shadows
        camera={{ position: [12, 11, 12], fov: 32 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight
          castShadow
          position={[8, 14, 6]}
          intensity={1.0}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={40}
          shadow-camera-left={-15}
          shadow-camera-right={15}
          shadow-camera-top={15}
          shadow-camera-bottom={-15}
        />
        <directionalLight position={[-8, 6, -6]} intensity={0.3} />

        {/* 바닥 */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color={COLORS.ground} />
        </mesh>

        {/* 부드러운 그림자 */}
        <ContactShadows position={[0, 0.001, 0]} opacity={0.35} blur={2.5} far={15} resolution={1024} />

        {/* 주변 흰 도시 */}
        {WHITE_BLOCKS.map((b, i) => (
          <WhiteBuilding key={i} {...b} />
        ))}

        {/* 중앙 컬러 빌딩 시나리오 */}
        <CenterScenario phaseIdx={phaseIdx} />

        {/* 자동 회전 */}
        <AutoRotate />
      </Canvas>

      {/* 라벨 (HTML 오버레이) */}
      <div
        style={{
          position: 'absolute',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#ffffff',
          border: '1.5px solid var(--accent, #4f46e5)',
          color: 'var(--accent, #4f46e5)',
          padding: '6px 18px',
          borderRadius: 999,
          fontSize: 13,
          fontWeight: 700,
          fontFamily: 'Pretendard, sans-serif',
          boxShadow: '0 4px 16px rgba(79,70,229,0.15)',
        }}
      >
        {PHASES[phaseIdx].label}
      </div>

      {/* 진행 도트 */}
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 8,
        }}
      >
        {PHASES.map((_, i) => (
          <span
            key={i}
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: i === phaseIdx ? '#4f46e5' : '#d1d5db',
              transition: 'background 0.3s',
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── 흰 빌딩 ───────────────────────── */
function WhiteBuilding({ x, z, w, h, d }: { x: number; z: number; w: number; h: number; d: number }) {
  return (
    <mesh position={[x, h / 2, z]} castShadow receiveShadow>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color={COLORS.white} roughness={0.85} />
      <Edges color={COLORS.whiteEdge} threshold={15} />
    </mesh>
  );
}

/* ─── 중앙 시나리오 (4단계 전환, fade) ───────────────────────── */
function CenterScenario({ phaseIdx }: { phaseIdx: number }) {
  return (
    <>
      <Phase visible={phaseIdx === 0}>
        {/* ① 부지 검토 — 오렌지 대지 + 녹지 + 주차 */}
        <ColorBox cx={0} y={0.05} w={5.5} h={0.1} d={3.5} color={COLORS.orange} edge={COLORS.orangeEdge} />
        <ColorBox cx={1.5} y={0.12} w={2} h={0.08} d={1.2} color={COLORS.green} edge={COLORS.greenEdge} />
        {/* 주차 라인 (작은 박스 행렬) */}
        {Array.from({ length: 6 }).map((_, i) => (
          <ColorBox
            key={i}
            cx={-1.8 + i * 0.5}
            y={0.13}
            w={0.35}
            h={0.04}
            d={0.7}
            color="#ffffff"
            edge="#9ca3af"
          />
        ))}
      </Phase>

      <Phase visible={phaseIdx === 1}>
        {/* ② 상업 + 오피스 — 오렌지 podium + 블루 슬랩 */}
        <ColorBox cx={0} y={0.05} w={5} h={0.1} d={3} color={COLORS.orange} edge={COLORS.orangeEdge} />
        <SlabBuilding cx={0} cz={0} w={3.6} h={5.5} d={2.2} floors={11} color={COLORS.blue} edge={COLORS.blueEdge} />
      </Phase>

      <Phase visible={phaseIdx === 2}>
        {/* ③ 평면 계획 — 블루+오렌지 베이스 + 옐로우 격자 */}
        <ColorBox cx={0} y={0.04} w={5.2} h={0.08} d={3.2} color={COLORS.blue} edge={COLORS.blueEdge} />
        <ColorBox cx={0.2} y={0.13} w={5} h={0.08} d={3} color={COLORS.orange} edge={COLORS.orangeEdge} />
        <GridBuilding cx={0} cz={0} w={4} h={6} d={2.4} floors={11} cols={8} color={COLORS.yellow} edge={COLORS.yellowEdge} />
      </Phase>

      <Phase visible={phaseIdx === 3}>
        {/* ④ 트윈 타워 — 오렌지 부지 + 옐로우 두 동 + 녹지 */}
        <ColorBox cx={0} y={0.05} w={6.5} h={0.1} d={3.5} color={COLORS.orange} edge={COLORS.orangeEdge} />
        <ColorBox cx={1.2} y={0.12} w={2.3} h={0.08} d={1} color={COLORS.green} edge={COLORS.greenEdge} />
        <SlabBuilding cx={-1.6} cz={0} w={1.8} h={8} d={1.8} floors={16} color={COLORS.yellow} edge={COLORS.yellowEdge} />
        <SlabBuilding cx={1.6} cz={0} w={1.8} h={8} d={1.8} floors={16} color={COLORS.yellow} edge={COLORS.yellowEdge} />
      </Phase>
    </>
  );
}

function Phase({ visible, children }: { visible: boolean; children: React.ReactNode }) {
  const ref = useRef<Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    const target = visible ? 1 : 0;
    ref.current.scale.x += (target - ref.current.scale.x) * 0.15;
    ref.current.scale.y += (target - ref.current.scale.y) * 0.15;
    ref.current.scale.z += (target - ref.current.scale.z) * 0.15;
    ref.current.visible = ref.current.scale.x > 0.01;
  });
  return (
    <group ref={ref} scale={visible ? 1 : 0}>
      {children}
    </group>
  );
}

function ColorBox({
  cx,
  y,
  w,
  h,
  d,
  color,
  edge,
}: {
  cx: number;
  y: number;
  w: number;
  h: number;
  d: number;
  color: string;
  edge: string;
}) {
  return (
    <mesh position={[cx, y + h / 2, 0]} castShadow receiveShadow>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color={color} roughness={0.7} />
      <Edges color={edge} threshold={15} />
    </mesh>
  );
}

function SlabBuilding({
  cx,
  cz,
  w,
  h,
  d,
  floors,
  color,
  edge,
}: {
  cx: number;
  cz: number;
  w: number;
  h: number;
  d: number;
  floors: number;
  color: string;
  edge: string;
}) {
  const floorH = h / floors;
  return (
    <group position={[cx, 0, cz]}>
      <mesh position={[0, h / 2 + 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} roughness={0.6} />
        <Edges color={edge} threshold={15} />
      </mesh>
      {/* 층 슬랩 표시 (얇은 박스를 층마다 — 디테일) */}
      {Array.from({ length: floors - 1 }).map((_, i) => (
        <mesh key={i} position={[0, 0.2 + (i + 1) * floorH, d / 2 + 0.001]}>
          <planeGeometry args={[w * 0.99, 0.04]} />
          <meshBasicMaterial color={edge} transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function GridBuilding({
  cx,
  cz,
  w,
  h,
  d,
  floors,
  cols,
  color,
  edge,
}: {
  cx: number;
  cz: number;
  w: number;
  h: number;
  d: number;
  floors: number;
  cols: number;
  color: string;
  edge: string;
}) {
  const floorH = h / floors;
  const colW = w / cols;
  return (
    <group position={[cx, 0, cz]}>
      <mesh position={[0, h / 2 + 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} roughness={0.55} />
        <Edges color={edge} threshold={15} />
      </mesh>
      {/* 격자 — 가로 슬랩 */}
      {Array.from({ length: floors - 1 }).map((_, i) => (
        <mesh key={`r${i}`} position={[0, 0.2 + (i + 1) * floorH, d / 2 + 0.001]}>
          <planeGeometry args={[w * 0.99, 0.03]} />
          <meshBasicMaterial color={edge} transparent opacity={0.5} />
        </mesh>
      ))}
      {/* 격자 — 세로 칸 */}
      {Array.from({ length: cols - 1 }).map((_, i) => (
        <mesh key={`c${i}`} position={[-w / 2 + (i + 1) * colW, h / 2 + 0.2, d / 2 + 0.001]}>
          <planeGeometry args={[0.03, h * 0.99]} />
          <meshBasicMaterial color={edge} transparent opacity={0.5} />
        </mesh>
      ))}
      {/* 옥상 엘리베이터 박스 */}
      <mesh position={[0, h + 0.4, 0]} castShadow>
        <boxGeometry args={[1, 0.4, 0.7]} />
        <meshStandardMaterial color="#9ca3af" />
        <Edges color="#374151" />
      </mesh>
    </group>
  );
}

function AutoRotate() {
  return (
    <OrbitControls
      enableZoom={false}
      enablePan={false}
      autoRotate
      autoRotateSpeed={0.6}
      minPolarAngle={Math.PI / 3.5}
      maxPolarAngle={Math.PI / 3.5}
    />
  );
}
