/**
 * 부동산 사이트용 빌딩 스카이라인 SVG (장식)
 */
export default function Skyline({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 320"
      preserveAspectRatio="xMidYEnd meet"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(182,255,74,0.0)" />
          <stop offset="100%" stopColor="rgba(182,255,74,0.18)" />
        </linearGradient>
        <linearGradient id="bld-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.10)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
        </linearGradient>
      </defs>

      {/* sun glow */}
      <circle cx="950" cy="120" r="80" fill="rgba(182,255,74,0.12)" />
      <circle cx="950" cy="120" r="40" fill="rgba(182,255,74,0.18)" />

      {/* far buildings */}
      <g opacity="0.5">
        {[
          [40, 200, 60, 120],
          [110, 170, 70, 150],
          [190, 220, 50, 100],
          [250, 150, 80, 170],
          [340, 210, 60, 110],
          [410, 180, 90, 140],
          [510, 200, 60, 120],
          [580, 160, 100, 160],
          [690, 190, 70, 130],
          [770, 140, 110, 180],
          [890, 200, 60, 120],
          [960, 170, 70, 150],
          [1040, 220, 50, 100],
          [1100, 180, 80, 140],
        ].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} fill="url(#bld-grad)" />
        ))}
      </g>

      {/* near buildings with windows */}
      <g>
        {/* Building 1 */}
        <rect x="70" y="180" width="80" height="140" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />
        <Windows x={80} y={195} cols={4} rows={6} cell={14} gap={4} />
        {/* Building 2 — tall accent */}
        <rect x="180" y="100" width="60" height="220" fill="rgba(182,255,74,0.06)" stroke="rgba(182,255,74,0.25)" />
        <Windows x={188} y={115} cols={3} rows={12} cell={12} gap={4} accent />
        {/* Building 3 */}
        <rect x="270" y="160" width="100" height="160" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />
        <Windows x={282} y={175} cols={5} rows={8} cell={12} gap={5} />
        {/* Building 4 */}
        <rect x="400" y="140" width="70" height="180" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />
        <Windows x={410} y={155} cols={3} rows={10} cell={14} gap={5} />
        {/* Building 5 — wide */}
        <rect x="500" y="200" width="180" height="120" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />
        <Windows x={512} y={215} cols={9} rows={5} cell={12} gap={5} />
        {/* Building 6 */}
        <rect x="710" y="120" width="80" height="200" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />
        <Windows x={720} y={135} cols={4} rows={11} cell={12} gap={5} />
        {/* Building 7 — accent tall */}
        <rect x="820" y="80" width="70" height="240" fill="rgba(124,223,255,0.06)" stroke="rgba(124,223,255,0.25)" />
        <Windows x={832} y={95} cols={3} rows={14} cell={12} gap={5} accent />
        {/* Building 8 */}
        <rect x="920" y="170" width="100" height="150" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />
        <Windows x={932} y={185} cols={5} rows={8} cell={12} gap={5} />
        {/* Building 9 */}
        <rect x="1050" y="200" width="100" height="120" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />
        <Windows x={1060} y={215} cols={5} rows={6} cell={12} gap={5} />
      </g>

      {/* ground glow */}
      <rect x="0" y="280" width="1200" height="40" fill="url(#sky-grad)" />
    </svg>
  );
}

function Windows({
  x,
  y,
  cols,
  rows,
  cell,
  gap,
  accent = false,
}: {
  x: number;
  y: number;
  cols: number;
  rows: number;
  cell: number;
  gap: number;
  accent?: boolean;
}) {
  const wins = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const lit = (r * 7 + c * 13) % 5 === 0; // pseudo-random "lit" windows
      wins.push(
        <rect
          key={`${r}-${c}`}
          x={x + c * (cell + gap)}
          y={y + r * (cell + gap)}
          width={cell}
          height={cell - 4}
          rx="1"
          fill={
            lit
              ? accent
                ? 'rgba(182,255,74,0.7)'
                : 'rgba(255,225,140,0.55)'
              : 'rgba(255,255,255,0.08)'
          }
        />
      );
    }
  }
  return <>{wins}</>;
}
