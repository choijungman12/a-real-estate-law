/**
 * 14개 부동산 주제 중 나머지 10개 다이어그램
 * (재개발·도시개발·농지·경매는 별도 컴포넌트)
 */

function NoviceTip({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-[color:var(--accent-soft)] border border-[color:var(--accent-soft)] p-3 text-xs text-[color:var(--text-secondary)]">
      💡 <strong className="text-[color:var(--accent)]">초보자 포인트</strong> — {children}
    </div>
  );
}

function Header({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="text-xs uppercase tracking-wider text-[color:var(--text-muted)]">
      {icon} {title}
    </div>
  );
}

function FlowSteps({ items }: { items: { t: string; s: string }[] }) {
  return (
    <div className="overflow-x-auto -mx-2 px-2">
      <div className="flex gap-2 min-w-max pb-2">
        {items.map((it, i) => (
          <div key={i} className="flex items-center">
            <div className="rounded-xl glass border border-white/10 p-3 w-44">
              <div className="flex items-center gap-2 mb-1">
                <span className="grid place-items-center size-6 rounded-full bg-[color:var(--accent-soft)] text-[color:var(--accent)] text-xs font-bold">
                  {i + 1}
                </span>
                <span className="font-semibold text-sm">{it.t}</span>
              </div>
              <div className="text-xs text-[color:var(--text-secondary)]">{it.s}</div>
            </div>
            {i < items.length - 1 && (
              <svg className="size-5 mx-1 text-[color:var(--text-muted)] shrink-0" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 1. 시장·경제 리서치
export function MarketResearchDiagram() {
  const sources = [
    { name: 'KDI', desc: '한국개발연구원\n경제전망·정책' },
    { name: '한국은행', desc: '통화정책·금리\n경기전망' },
    { name: '국토연구원', desc: '주택시장·도시\n부동산 정책' },
    { name: '산업연구원', desc: '산업동향·\n물류·산단' },
    { name: '한국부동산원', desc: '시세지수·통계\nR-ONE' },
  ];
  return (
    <div className="space-y-3">
      <Header icon="📊" title="시장·경제 리서치 — 5대 연구기관 포트폴리오" />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {sources.map((s) => (
          <div key={s.name} className="rounded-xl glass border border-white/10 p-3 text-center">
            <div className="font-semibold text-sm">{s.name}</div>
            <div className="text-[10px] text-[color:var(--text-secondary)] mt-1 whitespace-pre-line">
              {s.desc}
            </div>
          </div>
        ))}
      </div>
      <NoviceTip>
        부동산 시장 전망의 출발은 <strong>금리(한은)</strong> + <strong>주택공급(국토부·국토연구원)</strong> +{' '}
        <strong>거시경제(KDI)</strong> 세 축. 매월 한은 기준금리 발표일과 분기별 KDI 경제전망 보고서를 챙기세요.
      </NoviceTip>
    </div>
  );
}

// 3·4. 회계·감정평가
export function ValuationDiagram() {
  return (
    <div className="space-y-3">
      <Header icon="💼" title="감정평가 3방식 + 종전·종후 평가 (정비사업)" />

      <div className="grid md:grid-cols-3 gap-3">
        {[
          { t: '거래사례비교법', s: '인근 거래사례 보정 — 아파트·주거용 표준', color: '#7cdfff' },
          { t: '원가법', s: '재조달원가 − 감가 — 신축·특수건물', color: '#b6ff4a' },
          { t: '수익환원법', s: '순수익 ÷ 환원이율 — 상가·임대수익형', color: '#ffb547' },
        ].map((m) => (
          <div key={m.t} className="rounded-xl glass border border-white/10 p-3">
            <div className="size-1.5 rounded-full mb-2" style={{ background: m.color }} />
            <div className="font-semibold text-sm">{m.t}</div>
            <div className="text-xs text-[color:var(--text-secondary)] mt-1">{m.s}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl glass border border-white/10 p-4">
        <div className="text-sm font-semibold mb-2">종전 → 종후 평가 (정비사업)</div>
        <svg viewBox="0 0 600 80" className="w-full">
          <rect x="20" y="20" width="180" height="40" rx="6" fill="rgba(124,223,255,0.2)" stroke="#7cdfff" />
          <text x="110" y="45" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="600">
            종전평가 (현재 자산)
          </text>
          <path d="M210 40h60" stroke="#fff" strokeWidth="1.5" markerEnd="url(#arrow)" />
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0 0L10 5L0 10z" fill="#fff" />
            </marker>
          </defs>
          <rect x="280" y="20" width="200" height="40" rx="6" fill="rgba(182,255,74,0.2)" stroke="#b6ff4a" />
          <text x="380" y="45" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="600">
            종후평가 (재건축 후)
          </text>
          <path d="M490 40h60" stroke="#fff" strokeWidth="1.5" markerEnd="url(#arrow)" />
          <text x="590" y="45" textAnchor="end" fill="#ff8080" fontSize="12" fontWeight="600">
            분담금/환급금
          </text>
        </svg>
      </div>

      <NoviceTip>
        <strong>비례율</strong>(종후평가합계 ÷ 종전평가합계 × 100)이 100% 이상이면 사업성 양호. 95% 미만이면 분담금 부담 큼.
      </NoviceTip>
    </div>
  );
}

// 6. LH/SH 청약
export function SubscriptionDiagram() {
  return (
    <div className="space-y-3">
      <Header icon="🏘️" title="공공·민간 청약 비교" />
      <div className="grid md:grid-cols-3 gap-3">
        {[
          { t: '공공분양 (LH·SH)', s: '소득·자산 기준 + 가점\n분양가 저렴', tag: '주택공급규칙' },
          { t: '공공임대', s: '국민·영구·행복주택\n장기·저렴', tag: '공공주택특별법' },
          { t: '민간분양', s: '추첨 + 가점\n분양가상한제 적용지구', tag: '주택법' },
        ].map((m) => (
          <div key={m.t} className="rounded-xl glass border border-white/10 p-3">
            <div className="font-semibold text-sm">{m.t}</div>
            <div className="text-[10px] text-[color:var(--accent)] mt-0.5">{m.tag}</div>
            <div className="text-xs text-[color:var(--text-secondary)] mt-2 whitespace-pre-line">{m.s}</div>
          </div>
        ))}
      </div>
      <FlowSteps
        items={[
          { t: '입주자모집공고', s: '청약홈/LH청약+' },
          { t: '청약 자격확인', s: '주택소유·세대주' },
          { t: '청약 접수', s: '특별/일반/무순위' },
          { t: '당첨자 발표', s: '청약통장 사용' },
          { t: '계약·중도금·잔금', s: '대출 한도 확인' },
        ]}
      />
      <NoviceTip>
        <strong>청약통장 가점</strong> = 무주택기간(최대 32) + 부양가족(최대 35) + 가입기간(최대 17). 만점 84점.
      </NoviceTip>
    </div>
  );
}

// 7. 대출·규제
export function FinanceRegulationDiagram() {
  return (
    <div className="space-y-3">
      <Header icon="🏦" title="대출 규제 — 주택수·LTV·DSR" />
      <div className="rounded-xl glass border border-white/10 p-4">
        <table className="w-full text-xs">
          <thead className="text-[color:var(--text-muted)]">
            <tr className="border-b border-white/5">
              <th className="text-left py-2">주택수</th>
              <th className="text-left">규제지역 LTV</th>
              <th className="text-left">비규제 LTV</th>
              <th className="text-left">DSR</th>
            </tr>
          </thead>
          <tbody>
            {[
              { n: '무주택', r: '50%', nr: '70%', d: '40%' },
              { n: '1주택', r: '0~50%', nr: '60%', d: '40%' },
              { n: '2주택+', r: '0%', nr: '60%', d: '40%' },
            ].map((row) => (
              <tr key={row.n} className="border-b border-white/5">
                <td className="py-2 font-medium">{row.n}</td>
                <td className="text-[color:var(--text-secondary)]">{row.r}</td>
                <td className="text-[color:var(--text-secondary)]">{row.nr}</td>
                <td className="text-[color:var(--accent)] font-semibold">{row.d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <NoviceTip>
        <strong>DSR 40%</strong> = 모든 대출의 연 원리금 ÷ 연소득 ≤ 40%. 신용대출·자동차할부도 포함.
        규제지역 지정 여부는 국토부 보도자료 또는 「부동산 가격공시법」 시행령 수시 확인.
      </NoviceTip>
    </div>
  );
}

// 9 → covered by FarmForestDiagram

// 10. 지도·매물·명도
export function MapPropertyDiagram() {
  return (
    <div className="space-y-3">
      <Header icon="🗺️" title="지도·매물·명도 — 인도(명도) 절차" />
      <FlowSteps
        items={[
          { t: '잔금 납부 → 소유권', s: '낙찰자 명의이전' },
          { t: '인도명령 신청', s: '잔금일 6개월 내' },
          { t: '점유자 협의', s: '이사비/명도비 합의' },
          { t: '강제집행', s: '계고 → 집행관' },
          { t: '인도 완료', s: '관리·임대 시작' },
        ]}
      />
      <NoviceTip>
        명도가 가장 어려운 케이스는 <strong>유치권 신고 + 점유자 폐문부재</strong>.
        지지옥션·V월드 지적도와 카카오맵 로드뷰로 사전 답사 필수.
      </NoviceTip>
    </div>
  );
}

// 11. 뉴스
export function NewsDiagram() {
  return (
    <div className="space-y-3">
      <Header icon="📰" title="뉴스 자동 수집·전송" />
      <FlowSteps
        items={[
          { t: '키워드 수집', s: '네이버 검색 API' },
          { t: 'AI 요약', s: 'Gemini Flash-Lite' },
          { t: '카테고리 분류', s: '재건축/금리/규제' },
          { t: '저장·중복제거', s: 'PostgreSQL' },
          { t: '발송', s: '텔레그램/카카오 알림톡' },
        ]}
      />
      <NoviceTip>
        뉴스 수집·재가공은 <strong>저작권법 + 정통망법</strong> 검토 필수. 본문 전문 복제는 금지, 제목·요약·링크 형태가 안전.
      </NoviceTip>
    </div>
  );
}

// 12. 음성·3D·생체
export function Voice3DDiagram() {
  return (
    <div className="space-y-3">
      <Header icon="🎙️" title="음성·3D·생체인식 — 개인정보 보호" />
      <div className="grid md:grid-cols-3 gap-3">
        {[
          { t: 'STT (음성)', s: 'Web Speech API\nWhisper · 클로바 CSR', risk: '음성 = 개인정보' },
          { t: '3D 빌딩', s: 'V월드 3D\n전국 건물 텍스처', risk: '저작권 V월드' },
          { t: '얼굴 인식', s: '페이스타임형 본인 확인', risk: '생체정보 = 민감정보' },
        ].map((c) => (
          <div key={c.t} className="rounded-xl glass border border-white/10 p-3">
            <div className="font-semibold text-sm">{c.t}</div>
            <div className="text-xs text-[color:var(--text-secondary)] mt-1 whitespace-pre-line">{c.s}</div>
            <div className="mt-2 text-[10px] text-amber-300">⚠️ {c.risk}</div>
          </div>
        ))}
      </div>
      <NoviceTip>
        생체정보(얼굴·지문)는 <strong>개인정보보호법 시행령</strong>상 별도 동의 필수. 사용자가 거부 시 서비스 거절 불가.
      </NoviceTip>
    </div>
  );
}

// 13. 협업
export function CollaborationDiagram() {
  const roles = [
    { r: '디자이너 · UX', icon: '🎨' },
    { r: 'V월드 개발', icon: '🗺️' },
    { r: '수지분석 전문가', icon: '📈' },
    { r: '감정평가사', icon: '💼' },
    { r: '회계사', icon: '🧾' },
    { r: '법무사', icon: '📜' },
    { r: '세무사', icon: '💰' },
    { r: '변호사', icon: '⚖️' },
    { r: '지자체 공무원', icon: '🏛️' },
    { r: '국토연구원', icon: '🔬' },
  ];
  return (
    <div className="space-y-3">
      <Header icon="🤝" title="병렬 전문가 협업 구조" />
      <div className="rounded-xl glass border border-white/10 p-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {roles.map((r) => (
            <div key={r.r} className="rounded-lg bg-white/[0.03] border border-white/5 p-3 text-center">
              <div className="text-2xl">{r.icon}</div>
              <div className="text-xs mt-1">{r.r}</div>
            </div>
          ))}
        </div>
      </div>
      <NoviceTip>
        각 전문가의 <strong>업무 범위 (변호사법·세무사법·감정평가법)</strong> 위반은 형사처벌.
        AI는 보조이며, 최종 의사결정과 서명은 자격사가 담당.
      </NoviceTip>
    </div>
  );
}

// 14. 스터디 커리큘럼
export function StudyDiagram() {
  const tracks = [
    { lv: 'L1', t: '기초', body: '실거래가·토지이용계획서·등기부등본 읽는 법' },
    { lv: 'L2', t: '거래·세무', body: '취득세·양도세·종부세 계산, DSR/LTV' },
    { lv: 'L3', t: '경공매', body: '권리분석·말소기준·임차인 대항력' },
    { lv: 'L4', t: '재건축·도시개발', body: '종전·종후·비례율, PF 구조' },
    { lv: 'L5', t: '농지·산지·스마트팜', body: '전용허가·연금·민박·야영장' },
    { lv: 'L6', t: 'AI 활용', body: '미래가치 예측·자동 권리분석·뉴스 모니터링' },
  ];
  return (
    <div className="space-y-3">
      <Header icon="🎓" title="초보자 → 전문가 6단계 커리큘럼" />
      <div className="space-y-2">
        {tracks.map((t) => (
          <div key={t.lv} className="flex items-center gap-3 rounded-xl glass border border-white/10 p-3">
            <div className="grid place-items-center size-9 rounded-lg bg-[color:var(--accent)] text-black font-bold text-sm">
              {t.lv}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm">{t.t}</div>
              <div className="text-xs text-[color:var(--text-secondary)]">{t.body}</div>
            </div>
          </div>
        ))}
      </div>
      <NoviceTip>
        <strong>L1 → L3</strong>까지는 누구나 3개월에 완주 가능. L4부터는 실제 매물·공고로 케이스 스터디가 핵심.
      </NoviceTip>
    </div>
  );
}
