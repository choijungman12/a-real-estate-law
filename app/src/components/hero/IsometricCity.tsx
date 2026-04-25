/**
 * HOWBUILD 톤 isometric 부동산 일러스트
 * 3D 빌딩 + 도면 + 크레인 + 옅은 라벤더 백그라운드
 */
export default function IsometricCity({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 500"
      className={className}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="iso-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eef0fe" />
          <stop offset="100%" stopColor="#fafbff" />
        </linearGradient>
        <linearGradient id="iso-plate" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#eef0fe" />
        </linearGradient>
        <linearGradient id="iso-bldg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#dde1f5" />
        </linearGradient>
        <filter id="iso-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" />
          <feOffset dy="8" />
          <feComponentTransfer><feFuncA type="linear" slope="0.15" /></feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 백그라운드 원형 */}
      <circle cx="300" cy="240" r="220" fill="url(#iso-bg)" />
      <circle cx="300" cy="240" r="180" fill="none" stroke="rgba(79,70,229,0.15)" strokeWidth="1.5" strokeDasharray="4 6" />

      {/* 좌측 플레이트 (도면) */}
      <g transform="translate(120 220)" filter="url(#iso-shadow)">
        <polygon points="0,40 80,0 160,40 80,80" fill="url(#iso-plate)" stroke="#cfd5ec" strokeWidth="1" />
        <polygon points="0,40 80,80 80,90 0,50" fill="#dde1f5" />
        <polygon points="160,40 80,80 80,90 160,50" fill="#c8cfe8" />
        {/* 도면 라인 */}
        <g transform="translate(40 30)" stroke="#7c83b8" strokeWidth="1" fill="none">
          <rect x="0" y="0" width="60" height="38" transform="skewX(-30)" />
          <line x1="20" y1="0" x2="20" y2="38" transform="skewX(-30)" />
          <line x1="0" y1="18" x2="60" y2="18" transform="skewX(-30)" />
        </g>
        {/* 펜 */}
        <line x1="20" y1="20" x2="60" y2="-5" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* 우측 상단 플레이트 (헬멧 + 크레인 + 굴착기) */}
      <g transform="translate(310 130)" filter="url(#iso-shadow)">
        <polygon points="0,40 90,0 180,40 90,80" fill="url(#iso-plate)" stroke="#cfd5ec" strokeWidth="1" />
        <polygon points="0,40 90,80 90,90 0,50" fill="#dde1f5" />
        <polygon points="180,40 90,80 90,90 180,50" fill="#c8cfe8" />
        {/* 헬멧 */}
        <g transform="translate(50 20)">
          <ellipse cx="14" cy="22" rx="14" ry="6" fill="#dde1f5" />
          <path d="M 0 22 Q 14 -2 28 22 Z" fill="#ffffff" stroke="#a8b0d6" strokeWidth="0.8" />
          <rect x="6" y="20" width="16" height="3" fill="#fbbf24" />
        </g>
        {/* 크레인 */}
        <g transform="translate(110 -50)" stroke="#1a1d2e" strokeWidth="1.5" fill="none">
          <line x1="0" y1="0" x2="0" y2="80" />
          <line x1="0" y1="0" x2="50" y2="-15" />
          <line x1="0" y1="10" x2="50" y2="-5" />
          <line x1="20" y1="6" x2="20" y2="-2" />
          <line x1="40" y1="-7" x2="40" y2="-15" />
          <line x1="40" y1="-11" x2="46" y2="-13" />
        </g>
        {/* 굴착기 (단순) */}
        <g transform="translate(95 35)">
          <rect x="0" y="0" width="22" height="14" rx="2" fill="#4f46e5" />
          <rect x="4" y="-6" width="14" height="6" rx="1" fill="#6b63f5" />
          <line x1="22" y1="6" x2="36" y2="-2" stroke="#1a1d2e" strokeWidth="2" />
          <circle cx="36" cy="-2" r="3" fill="#fbbf24" />
          <ellipse cx="11" cy="16" rx="14" ry="3" fill="#1a1d2e" opacity="0.3" />
        </g>
        {/* 콘 */}
        <g transform="translate(20 50)">
          <polygon points="0,10 4,0 8,10" fill="#fbbf24" />
          <polygon points="14,10 18,0 22,10" fill="#fbbf24" />
        </g>
      </g>

      {/* 하단 플레이트 (모형 작은 빌딩) */}
      <g transform="translate(220 320)" filter="url(#iso-shadow)">
        <polygon points="0,40 90,0 180,40 90,80" fill="url(#iso-plate)" stroke="#cfd5ec" strokeWidth="1" />
        <polygon points="0,40 90,80 90,90 0,50" fill="#dde1f5" />
        <polygon points="180,40 90,80 90,90 180,50" fill="#c8cfe8" />
        {/* 빌딩 */}
        <g transform="translate(72 18)">
          <polygon points="0,30 18,21 36,30 36,52 18,61 0,52" fill="url(#iso-bldg)" stroke="#a8b0d6" strokeWidth="0.8" />
          <polygon points="18,21 36,30 36,52 18,61" fill="#c8cfe8" />
          {/* 창문 */}
          <line x1="6" y1="36" x2="6" y2="48" stroke="#a8b0d6" strokeWidth="0.6" />
          <line x1="12" y1="33" x2="12" y2="45" stroke="#a8b0d6" strokeWidth="0.6" />
          <line x1="22" y1="33" x2="22" y2="51" stroke="#7c83b8" strokeWidth="0.6" />
          <line x1="29" y1="29" x2="29" y2="48" stroke="#7c83b8" strokeWidth="0.6" />
        </g>
      </g>

      {/* 점 패턴 (HOWBUILD 우측 상단 */}
      <g fill="rgba(79,70,229,0.25)">
        {Array.from({ length: 6 }).map((_, i) =>
          Array.from({ length: 4 }).map((_, j) => (
            <circle key={`${i}-${j}`} cx={520 + j * 10} cy={30 + i * 10} r="1.5" />
          ))
        )}
      </g>
    </svg>
  );
}
