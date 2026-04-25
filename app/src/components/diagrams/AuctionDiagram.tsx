/**
 * 경매 권리분석 — 말소기준권리·인수/소멸·임차인 대항력
 */
export function AuctionDiagram() {
  return (
    <div className="space-y-3">
      <div className="text-xs uppercase tracking-wider text-[color:var(--text-muted)]">
        🔨 경매 권리분석 — 말소기준권리 한 눈에
      </div>

      <svg viewBox="0 0 720 240" className="w-full max-w-3xl">
        <defs>
          <linearGradient id="auc-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ff5e5e" />
            <stop offset="100%" stopColor="#ffb547" />
          </linearGradient>
        </defs>
        {/* timeline */}
        <line x1="60" y1="100" x2="680" y2="100" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
        <text x="60" y="40" fill="rgba(255,255,255,0.6)" fontSize="11">과거</text>
        <text x="640" y="40" fill="rgba(255,255,255,0.6)" fontSize="11">최근</text>

        {/* events */}
        {[
          { x: 100, y: 100, label: '전입신고', color: '#7cdfff', kind: 'tenant' },
          { x: 220, y: 100, label: '근저당 (말소기준)', color: '#ff5e5e', kind: 'base' },
          { x: 340, y: 100, label: '확정일자', color: '#7cdfff', kind: 'tenant' },
          { x: 460, y: 100, label: '가압류', color: '#ffb547', kind: 'after' },
          { x: 580, y: 100, label: '경매개시결정', color: '#b6ff4a', kind: 'auction' },
        ].map((e, i) => (
          <g key={i}>
            <circle cx={e.x} cy={e.y} r={e.kind === 'base' ? 12 : 8} fill={e.color} />
            <line x1={e.x} y1={e.y - 12} x2={e.x} y2={70} stroke={e.color} strokeWidth="1.5" />
            <text x={e.x} y={62} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="600">
              {e.label}
            </text>
          </g>
        ))}

        {/* surviving / extinguished bands */}
        <rect x="60" y="130" width="160" height="34" rx="6" fill="rgba(255,94,94,0.15)" stroke="rgba(255,94,94,0.4)" />
        <text x="140" y="153" textAnchor="middle" fill="#ff8080" fontSize="11" fontWeight="600">
          🚨 인수 (말소기준 前)
        </text>

        <rect x="220" y="130" width="460" height="34" rx="6" fill="rgba(124,223,255,0.1)" stroke="rgba(124,223,255,0.3)" />
        <text x="450" y="153" textAnchor="middle" fill="#7cdfff" fontSize="11" fontWeight="600">
          ✅ 소멸 (말소기준 後 — 낙찰 시 모두 말소)
        </text>

        {/* tenant 대항력 */}
        <g transform="translate(60, 195)">
          <text x="0" y="0" fill="rgba(255,255,255,0.6)" fontSize="11" fontWeight="600">
            임차인 대항력
          </text>
          <text x="100" y="0" fill="rgba(255,255,255,0.85)" fontSize="11">
            전입일이 말소기준권리보다 빠르면 ✓ → 보증금 인수 위험
          </text>
        </g>
      </svg>

      <div className="rounded-xl bg-[color:var(--accent-soft)] border border-[color:var(--accent-soft)] p-3 text-xs text-[color:var(--text-secondary)]">
        💡 <strong className="text-[color:var(--accent)]">초보자 포인트</strong> —{' '}
        <strong>말소기준권리</strong>는 (근)저당·압류·담보가등기·경매개시결정등기 중 가장 빠른 것.
        그 시점보다 <strong>먼저 등재된 권리</strong>는 낙찰자가 인수, <strong>뒤에 등재된 권리</strong>는 소멸합니다.
        임차인의 <strong>전입일</strong>이 말소기준보다 빠르면 보증금까지 떠안을 수 있어요.
      </div>
    </div>
  );
}
