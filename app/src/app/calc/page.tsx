'use client';

import { useMemo, useState } from 'react';
import { GlassCard, Badge, SectionHeader } from '@/components/ui/Glass';
import { formatKRW } from '@/lib/utils/cn';
import {
  computeRedevelopment,
  computeRental,
  computeAcquisitionTax,
  computeComprehensiveTax,
} from '@/lib/finance/profitability';
import { Calculator, TrendingUp, Home, Receipt } from 'lucide-react';

type Tab = 'redev' | 'rental' | 'tax_acq' | 'tax_compr';

export default function CalcPage() {
  const [tab, setTab] = useState<Tab>('redev');

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <SectionHeader
        title="수지분석 계산기"
        subtitle="비례율·분담금 · 임대수익률 · 취득세·종부세 자동 산출"
        action={<Badge tone="accent">FINANCE</Badge>}
      />

      <div className="flex gap-1 rounded-xl glass p-1 w-fit overflow-x-auto">
        {(
          [
            { v: 'redev', icon: <Home className="size-4" />, label: '재건축 비례율·분담금' },
            { v: 'rental', icon: <TrendingUp className="size-4" />, label: '임대수익률' },
            { v: 'tax_acq', icon: <Receipt className="size-4" />, label: '취득세' },
            { v: 'tax_compr', icon: <Calculator className="size-4" />, label: '종부세' },
          ] as const
        ).map((t) => (
          <button
            key={t.v}
            onClick={() => setTab(t.v as Tab)}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition whitespace-nowrap ${
              tab === t.v ? 'bg-white/10 text-white' : 'text-[color:var(--text-muted)] hover:text-white'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'redev' && <RedevelopmentCalc />}
      {tab === 'rental' && <RentalCalc />}
      {tab === 'tax_acq' && <AcquisitionTaxCalc />}
      {tab === 'tax_compr' && <ComprehensiveTaxCalc />}
    </div>
  );
}

// ─── Redevelopment ──────────────────────────────────

function RedevelopmentCalc() {
  const [predev, setPredev] = useState(800_000_000);
  const [postdev, setPostdev] = useState(1_500_000_000);
  const [totalPredev, setTotalPredev] = useState(800_000_000_000);
  const [totalPostdev, setTotalPostdev] = useState(1_400_000_000_000);

  const r = useMemo(
    () =>
      computeRedevelopment({
        predevAppraisal: predev,
        postdevAppraisal: postdev,
        totalPredev,
        totalPostdev,
      }),
    [predev, postdev, totalPredev, totalPostdev]
  );

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <GlassCard>
        <div className="text-xs uppercase tracking-wider text-[color:var(--text-muted)] mb-3">
          입력
        </div>
        <Field label="내 종전 감정평가액" value={predev} onChange={setPredev} />
        <Field label="내가 받을 종후 평가액 (새 아파트)" value={postdev} onChange={setPostdev} />
        <Field label="사업 전체 종전평가 합계" value={totalPredev} onChange={setTotalPredev} />
        <Field label="사업 전체 종후평가 합계" value={totalPostdev} onChange={setTotalPostdev} />
      </GlassCard>
      <GlassCard>
        <div className="text-xs uppercase tracking-wider text-[color:var(--text-muted)] mb-3">
          결과
        </div>
        <Result label="비례율" value={`${r.ratioPct.toFixed(2)}%`} accent={r.ratioPct >= 100} />
        <Result label="권리가액 (종전 × 비례율)" value={formatKRW(r.rights)} />
        <Result
          label={r.isContribution ? '추가 분담금' : '환급금'}
          value={formatKRW(Math.abs(r.contribution))}
          danger={r.isContribution}
        />
        <p className="text-xs text-[color:var(--text-muted)] mt-3">
          * 도시정비법 기준. 비례율 100% 이상 = 사업성 양호. 95% 미만 = 분담금 부담 큼.
        </p>
      </GlassCard>
    </div>
  );
}

// ─── Rental ─────────────────────────────────────────

function RentalCalc() {
  const [s, set] = useState({
    purchasePrice: 1_500_000_000,
    acquisitionCost: 30_000_000,
    loanAmount: 700_000_000,
    loanRatePct: 4.5,
    deposit: 50_000_000,
    monthlyRent: 3_500_000,
    monthlyExpenses: 500_000,
  });
  const r = useMemo(() => computeRental(s), [s]);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <GlassCard>
        <div className="text-xs uppercase tracking-wider text-[color:var(--text-muted)] mb-3">
          입력
        </div>
        <Field label="매입가" value={s.purchasePrice} onChange={(v) => set({ ...s, purchasePrice: v })} />
        <Field label="취득비용 (취득세·중개료 등)" value={s.acquisitionCost} onChange={(v) => set({ ...s, acquisitionCost: v })} />
        <Field label="대출액" value={s.loanAmount} onChange={(v) => set({ ...s, loanAmount: v })} />
        <FieldFloat label="대출 금리 (%)" value={s.loanRatePct} onChange={(v) => set({ ...s, loanRatePct: v })} />
        <Field label="보증금" value={s.deposit} onChange={(v) => set({ ...s, deposit: v })} />
        <Field label="월세" value={s.monthlyRent} onChange={(v) => set({ ...s, monthlyRent: v })} />
        <Field label="월 비용 (관리비·재산세 환산)" value={s.monthlyExpenses} onChange={(v) => set({ ...s, monthlyExpenses: v })} />
      </GlassCard>
      <GlassCard>
        <div className="text-xs uppercase tracking-wider text-[color:var(--text-muted)] mb-3">
          결과
        </div>
        <Result label="실투자금 (자기자본)" value={formatKRW(r.equity)} />
        <Result label="월 이자 비용" value={formatKRW(r.monthlyInterest)} />
        <Result label="월 순현금흐름" value={formatKRW(r.monthlyNet)} accent={r.monthlyNet > 0} danger={r.monthlyNet <= 0} />
        <Result label="연 순수익" value={formatKRW(r.yearlyNet)} />
        <Result label="단순 임대수익률 (Gross)" value={`${r.grossYieldPct.toFixed(2)}%`} />
        <Result
          label="자기자본 수익률 (Cash-on-Cash)"
          value={`${r.cashOnCashPct.toFixed(2)}%`}
          accent={r.cashOnCashPct >= 5}
        />
      </GlassCard>
    </div>
  );
}

// ─── Acquisition Tax ────────────────────────────────

function AcquisitionTaxCalc() {
  const [price, setPrice] = useState(1_000_000_000);
  const [numHomes, setNumHomes] = useState<1 | 2 | 3>(1);
  const [adjusted, setAdjusted] = useState(true);

  const r = useMemo(
    () =>
      computeAcquisitionTax({
        price,
        isFirstHome: numHomes === 1,
        isAdjustedArea: adjusted,
        numHomes,
      }),
    [price, numHomes, adjusted]
  );

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <GlassCard>
        <div className="text-xs uppercase tracking-wider text-[color:var(--text-muted)] mb-3">
          입력
        </div>
        <Field label="매매가" value={price} onChange={setPrice} />
        <div className="mb-3">
          <label className="text-xs text-[color:var(--text-muted)] uppercase tracking-wider">
            취득 후 주택수
          </label>
          <div className="mt-1 flex gap-2">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => setNumHomes(n as 1 | 2 | 3)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm border ${
                  numHomes === n
                    ? 'bg-[color:var(--accent)] text-black border-transparent'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                {n}주택{n === 3 ? '+' : ''}
              </button>
            ))}
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={adjusted}
            onChange={(e) => setAdjusted(e.target.checked)}
            className="size-4"
          />
          조정대상지역
        </label>
      </GlassCard>
      <GlassCard>
        <div className="text-xs uppercase tracking-wider text-[color:var(--text-muted)] mb-3">
          결과
        </div>
        <Result label="취득세율 (단순추정)" value={`${r.ratePct.toFixed(2)}%`} />
        <Result label="취득세 본세" value={formatKRW(r.tax)} />
        <Result label="농특세·지방교육세 (~10%)" value={formatKRW(r.surtax)} />
        <Result label="총 부담" value={formatKRW(r.total)} danger />
        <p className="text-xs text-[color:var(--text-muted)] mt-3">
          * 정확한 산정은 「지방세법」 별표·시행령 확인. 1세대 1주택 12억 초과 누진 등 예외 다수.
        </p>
      </GlassCard>
    </div>
  );
}

// ─── Comprehensive Tax ──────────────────────────────

function ComprehensiveTaxCalc() {
  const [val, setVal] = useState(1_500_000_000);
  const [numHomes, setNumHomes] = useState<1 | 2 | 3>(1);

  const r = useMemo(
    () => computeComprehensiveTax({ publicAssessedValue: val, numHomes }),
    [val, numHomes]
  );

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <GlassCard>
        <div className="text-xs uppercase tracking-wider text-[color:var(--text-muted)] mb-3">
          입력
        </div>
        <Field label="공시가격 합계" value={val} onChange={setVal} />
        <div className="mb-3">
          <label className="text-xs text-[color:var(--text-muted)] uppercase tracking-wider">
            주택수
          </label>
          <div className="mt-1 flex gap-2">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => setNumHomes(n as 1 | 2 | 3)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm border ${
                  numHomes === n
                    ? 'bg-[color:var(--accent)] text-black border-transparent'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                {n}주택{n === 3 ? '+' : ''}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>
      <GlassCard>
        <div className="text-xs uppercase tracking-wider text-[color:var(--text-muted)] mb-3">
          결과
        </div>
        <Result label="과세 표준" value={formatKRW(r.taxableBase)} />
        <Result label="추정 종부세" value={formatKRW(r.estimatedTax)} danger={r.estimatedTax > 0} />
        <p className="text-xs text-[color:var(--text-muted)] mt-3">
          * 공정시장가액비율·세부담상한 미반영 단순 추정. 실제는 「종부세법」 + 지자체별 공시가격 확정 필요.
        </p>
      </GlassCard>
    </div>
  );
}

// ─── primitives ─────────────────────────────────────

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mb-3">
      <label className="text-xs text-[color:var(--text-muted)] uppercase tracking-wider">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm tabular-nums focus:outline-none focus:border-[color:var(--accent)]/40"
      />
      <div className="text-[10px] text-[color:var(--text-muted)] mt-1">{formatKRW(value)}</div>
    </div>
  );
}

function FieldFloat({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mb-3">
      <label className="text-xs text-[color:var(--text-muted)] uppercase tracking-wider">
        {label}
      </label>
      <input
        type="number"
        step="0.1"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm tabular-nums focus:outline-none focus:border-[color:var(--accent)]/40"
      />
    </div>
  );
}

function Result({
  label,
  value,
  accent,
  danger,
}: {
  label: string;
  value: string;
  accent?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span className="text-xs text-[color:var(--text-secondary)]">{label}</span>
      <span
        className={`text-sm font-semibold tabular-nums ${
          accent ? 'text-[color:var(--accent)]' : danger ? 'text-red-400' : 'text-white'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
