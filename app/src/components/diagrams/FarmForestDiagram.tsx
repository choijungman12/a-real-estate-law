/**
 * 농지·산지 전용 + 농지연금·산지연금·스마트팜·펜션
 */
export function FarmForestDiagram() {
  return (
    <div className="space-y-4">
      <div className="text-xs uppercase tracking-wider text-[color:var(--text-muted)]">
        🌾 농지·산지 — 전용허가·연금·농어촌숙박·스마트팜
      </div>

      {/* 농지전용 / 산지전용 비교 */}
      <div className="grid md:grid-cols-2 gap-3">
        <div className="rounded-2xl glass border border-white/10 p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="size-7 grid place-items-center rounded-lg bg-[color:var(--accent-soft)] text-[color:var(--accent)]">🌾</span>
            <div>
              <div className="font-semibold text-sm">농지전용</div>
              <div className="text-xs text-[color:var(--text-muted)]">농지법 제34조</div>
            </div>
          </div>
          <Steps
            items={[
              { t: '농지', s: '농업진흥구역/보호구역/일반농지' },
              { t: '농지전용 허가/협의/신고', s: '시장·군수' },
              { t: '농지보전부담금', s: '공시지가 × 30%, ㎡당 5만원 상한 (농지법 §49 시행규칙)' },
              { t: '대체부지 확보 / 인허가', s: '건축·개발행위' },
              { t: '준공 → 지목변경', s: '농지 → 대지/잡종지 등' },
            ]}
          />
        </div>

        <div className="rounded-2xl glass border border-white/10 p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="size-7 grid place-items-center rounded-lg bg-emerald-500/15 text-emerald-300">🌲</span>
            <div>
              <div className="font-semibold text-sm">산지전용</div>
              <div className="text-xs text-[color:var(--text-muted)]">산지관리법 제14조</div>
            </div>
          </div>
          <Steps
            items={[
              { t: '산지', s: '보전산지(임업용/공익용) / 준보전산지' },
              { t: '산지전용 허가', s: '경사도·표고·인접 거리 심사' },
              { t: '대체산림자원조성비', s: '공시지가 + 단위면적당 산정' },
              { t: '복구비 예치', s: '재해방지 의무' },
              { t: '준공 → 지목변경', s: '임야 → 대지/공장용지 등' },
            ]}
          />
        </div>
      </div>

      {/* 활용 4가지 */}
      <div className="rounded-2xl glass border border-white/10 p-4">
        <div className="text-xs uppercase tracking-wider text-[color:var(--text-muted)] mb-3">
          활용 4가지
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <UseCard
            icon="🚜"
            name="스마트팜"
            law="스마트농업육성법"
            desc="ICT 시설농업 · 청년창업농 자금"
          />
          <UseCard
            icon="🏡"
            name="농어촌민박"
            law="농어촌정비법"
            desc="연면적 230㎡ 미만 · 본인 거주 의무"
          />
          <UseCard
            icon="⛺"
            name="야영장"
            law="관광진흥법"
            desc="등록 의무 · 안전기준 강화"
          />
          <UseCard
            icon="💰"
            name="농지·산지연금"
            law="한국농어촌공사법 / 산림법"
            desc="65세+, 소유 5년+ · 매월 수령"
          />
        </div>
      </div>

      <div className="rounded-xl bg-[color:var(--accent-soft)] border border-[color:var(--accent-soft)] p-3 text-xs text-[color:var(--text-secondary)]">
        💡 <strong className="text-[color:var(--accent)]">초보자 포인트</strong> — 농지/산지를 사려면 가장 먼저
        <strong> 토지이음</strong>(eum.go.kr)에서 「토지이용계획확인서」를 떼어 보세요. 거기 표기된
        <strong> 용도지역·구역</strong>이 모든 가능성과 부담금을 결정합니다. 보전산지·농업진흥구역은 전용이 까다롭습니다.
      </div>
    </div>
  );
}

function Steps({ items }: { items: { t: string; s: string }[] }) {
  return (
    <ol className="space-y-2">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 items-start">
          <span className="grid place-items-center size-5 rounded-full bg-white/10 text-[10px] font-bold shrink-0 mt-0.5">
            {i + 1}
          </span>
          <div className="text-xs">
            <div className="font-medium">{it.t}</div>
            <div className="text-[color:var(--text-muted)]">{it.s}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

function UseCard({
  icon,
  name,
  law,
  desc,
}: {
  icon: string;
  name: string;
  law: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="font-semibold text-sm">{name}</div>
      <div className="text-[10px] text-[color:var(--accent)] mt-0.5">{law}</div>
      <div className="text-xs text-[color:var(--text-muted)] mt-1">{desc}</div>
    </div>
  );
}
