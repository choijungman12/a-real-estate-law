/**
 * 도시개발사업 추진 흐름 + 자금조달·엑싯
 */
export function UrbanDevelopmentDiagram() {
  return (
    <div className="space-y-3">
      <div className="text-xs uppercase tracking-wider text-[color:var(--text-muted)]">
        🏙️ 도시개발사업 — 인허가·환경/교통영향평가·PF·엑싯
      </div>

      <svg viewBox="0 0 720 300" className="w-full max-w-3xl">
        <defs>
          <linearGradient id="ud-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7cdfff" />
            <stop offset="100%" stopColor="#b6ff4a" />
          </linearGradient>
        </defs>
        {/* track */}
        <line x1="40" y1="80" x2="680" y2="80" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
        {[
          { x: 60, label: '구역지정\n제안', body: '국토계획법' },
          { x: 200, label: '개발계획\n수립', body: '도시개발법' },
          { x: 340, label: '실시계획\n인가', body: '환경·교통\n영향평가' },
          { x: 480, label: '시행자\n지정', body: 'LH/SH/조합/PF' },
          { x: 620, label: '준공·\n환지처분', body: '체비지 매각' },
        ].map((s, i) => (
          <g key={i}>
            <circle cx={s.x} cy={80} r="14" fill="url(#ud-grad)" />
            <text x={s.x} y={84} textAnchor="middle" fill="#000" fontSize="11" fontWeight="700">
              {i + 1}
            </text>
            <text x={s.x} y={120} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="600">
              {s.label.split('\n').map((line, idx) => (
                <tspan key={idx} x={s.x} dy={idx === 0 ? 0 : 13}>
                  {line}
                </tspan>
              ))}
            </text>
            <text x={s.x} y={172} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">
              {s.body.split('\n').map((line, idx) => (
                <tspan key={idx} x={s.x} dy={idx === 0 ? 0 : 11}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        ))}

        {/* funding pyramid */}
        <g transform="translate(40, 200)">
          <text x="0" y="0" fill="rgba(255,255,255,0.6)" fontSize="11" fontWeight="600">
            자금 조달 (PF)
          </text>
          <rect x="0" y="10" width="640" height="20" rx="4" fill="rgba(124,223,255,0.15)" />
          <rect x="0" y="10" width="180" height="20" rx="4" fill="rgba(124,223,255,0.5)" />
          <text x="90" y="24" textAnchor="middle" fill="#fff" fontSize="10">자기자본 ~20%</text>
          <rect x="180" y="10" width="220" height="20" fill="rgba(182,255,74,0.3)" />
          <text x="290" y="24" textAnchor="middle" fill="#fff" fontSize="10">브릿지론 ~30%</text>
          <rect x="400" y="10" width="240" height="20" rx="4" fill="rgba(255,94,94,0.3)" />
          <text x="520" y="24" textAnchor="middle" fill="#fff" fontSize="10">본PF ~50%</text>
        </g>

        {/* exit */}
        <g transform="translate(40, 260)">
          <text x="0" y="0" fill="rgba(255,255,255,0.6)" fontSize="11" fontWeight="600">
            엑싯
          </text>
          <text x="80" y="0" fill="rgba(255,255,255,0.85)" fontSize="11">
            분양수입 → PF 상환 → 체비지 매각 → 시행자 이익 정산
          </text>
        </g>
      </svg>

      <div className="rounded-xl bg-[color:var(--accent-soft)] border border-[color:var(--accent-soft)] p-3 text-xs text-[color:var(--text-secondary)]">
        💡 <strong className="text-[color:var(--accent)]">초보자 포인트</strong> — 환경영향평가는 사업면적 30만㎡ 이상,
        교통영향평가는 일정 규모 이상 시행시설 시 의무. PF는 보통 자기자본 20% + 브릿지 + 본PF 구조로 가고,
        분양수입으로 본PF를 상환합니다.
      </div>
    </div>
  );
}
