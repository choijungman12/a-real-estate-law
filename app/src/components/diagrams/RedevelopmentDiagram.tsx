/**
 * 재개발·재건축 사업 추진 흐름 SVG 인포그래픽
 * 도시 및 주거환경정비법 기준 단계
 */
export function RedevelopmentDiagram() {
  const steps = [
    { n: 1, title: '정비기본계획', body: '시·도지사 10년 단위 수립' },
    { n: 2, title: '안전진단', body: '재건축 한정 · D/E등급 시 추진' },
    { n: 3, title: '정비구역 지정', body: '시장·군수가 고시' },
    { n: 4, title: '추진위 → 조합 설립', body: '토지등소유자 3/4 + 토지면적 1/2' },
    { n: 5, title: '사업시행 인가', body: '환경·교통·재해영향평가 첨부' },
    { n: 6, title: '관리처분 인가', body: '종전·종후 감정평가 → 권리가액 결정' },
    { n: 7, title: '이주·철거·착공', body: '조합원 분담금 확정' },
    { n: 8, title: '준공·이전 고시', body: '소유권 이전 + 청산' },
  ];
  return (
    <div className="space-y-3">
      <div className="text-xs uppercase tracking-wider text-[color:var(--text-muted)]">
        🏗️ 재개발·재건축 사업 8단계 (도시 및 주거환경정비법)
      </div>
      <div className="overflow-x-auto -mx-2 px-2">
        <div className="flex gap-2 min-w-max pb-2">
          {steps.map((s, i) => (
            <div key={s.n} className="flex items-center">
              <div className="rounded-xl glass border border-white/10 p-3 w-44">
                <div className="flex items-center gap-2 mb-1">
                  <span className="grid place-items-center size-6 rounded-full bg-[color:var(--accent-soft)] text-[color:var(--accent)] text-xs font-bold">
                    {s.n}
                  </span>
                  <span className="font-semibold text-sm">{s.title}</span>
                </div>
                <div className="text-xs text-[color:var(--text-secondary)]">{s.body}</div>
              </div>
              {i < steps.length - 1 && (
                <svg className="size-5 mx-1 text-[color:var(--text-muted)] shrink-0" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl bg-[color:var(--accent-soft)] border border-[color:var(--accent-soft)] p-3 text-xs text-[color:var(--text-secondary)]">
        💡 <strong className="text-[color:var(--accent)]">초보자 포인트</strong> — 종전 평가는 내 토지·건물의 현재 가치, 종후 평가는 새 아파트의 가치예요. 그 차이가{' '}
        <strong>분담금(또는 환급금)</strong>이 됩니다. 관리처분 인가 시점이 가장 중요합니다.
      </div>
    </div>
  );
}
