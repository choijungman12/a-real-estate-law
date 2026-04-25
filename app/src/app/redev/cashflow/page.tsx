'use client';

import { useMemo, useState } from 'react';
import { GlassCard, Badge, SectionHeader } from '@/components/ui/Glass';
import { formatKRW } from '@/lib/utils/cn';
import {
  computeRedevCashflow,
  REDEV_SAMPLE,
  type RedevCashflowInput,
  type UnitTypeMix,
} from '@/lib/finance/redev-cashflow';
import { Calculator, TrendingUp, Percent } from 'lucide-react';

const COST_COLORS: Record<string, string> = {
  construction: '#b6ff4a',
  compensation: '#ff8080',
  promotion: '#ffb547',
  services: '#7cdfff',
  registration: '#c89bff',
  operation: '#9ca3af',
  burdens: '#fdba74',
  taxes: '#fb7185',
  finance: '#facc15',
  mgmt: '#34d399',
};

export default function RedevCashflowPage() {
  const [input, setInput] = useState<RedevCashflowInput>(REDEV_SAMPLE);
  const r = useMemo(() => computeRedevCashflow(input), [input]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SectionHeader
        title="정비사업 종합 수지분석"
        subtitle="PDF 양식(구기동 138-1) 기반 — 평형별 매출 + 지출 10카테고리 + 비례율·분담금"
        action={<Badge tone="accent">CASHFLOW</Badge>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI label="총 매출" value={formatKRW(r.totalRevenue)} />
        <KPI label="총 지출" value={formatKRW(r.totalCost)} danger />
        <KPI label="순이익 (A−B)" value={formatKRW(r.netProfit)} accent={r.netProfit >= 0} />
        <KPI
          label="비례율"
          value={`${r.proportionalRate.toFixed(2)}%`}
          accent={r.proportionalRate >= 100}
          danger={r.proportionalRate < 95}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <GlassCard>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Calculator className="size-4 text-[color:var(--accent)]" /> 사업 개요
          </h3>
          <Field
            label="총 토지면적 (㎡)"
            value={input.totalLandM2}
            onChange={(v) => setInput({ ...input, totalLandM2: v })}
          />
          <Field
            label="지상 연면적 (㎡)"
            value={input.totalFloorM2}
            onChange={(v) => setInput({ ...input, totalFloorM2: v })}
          />
          <Field
            label="지하 연면적 (㎡)"
            value={input.basementFloorM2}
            onChange={(v) => setInput({ ...input, basementFloorM2: v })}
          />
          <Field
            label="총 세대수"
            value={input.totalUnits}
            onChange={(v) => setInput({ ...input, totalUnits: v })}
          />
          <Field
            label="종전자산 총평가 (원)"
            value={input.preAssetTotal}
            onChange={(v) => setInput({ ...input, preAssetTotal: v })}
          />
          <Field
            label="조합원 수"
            value={input.preAssetMembers}
            onChange={(v) => setInput({ ...input, preAssetMembers: v })}
          />
          <Field
            label="평당 직접공사비 (만원)"
            value={input.constructionUnitCostMan}
            onChange={(v) => setInput({ ...input, constructionUnitCostMan: v })}
          />
        </GlassCard>

        <GlassCard>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Percent className="size-4 text-[color:var(--accent)]" /> 비례율·분담금 결과
          </h3>
          <Stat
            label="비례율"
            value={`${r.proportionalRate.toFixed(2)}%`}
            accent={r.proportionalRate >= 100}
            danger={r.proportionalRate < 95}
          />
          <Stat
            label="세대당 평균 권리가액"
            value={formatKRW(r.rightsValuePerMember)}
          />
          <Stat
            label={r.contributionPerMember >= 0 ? '세대당 분담금 (지급)' : '세대당 환급금'}
            value={formatKRW(Math.abs(r.contributionPerMember))}
            danger={r.contributionPerMember > 0}
            accent={r.contributionPerMember < 0}
          />
          <Stat label="조합원 분양 합계" value={formatKRW(r.memberSale)} />
          <Stat label="일반 분양 합계" value={formatKRW(r.generalSale)} />
          <Stat label="매출 부가세" value={formatKRW(r.vat)} />
          <p className="text-xs text-[color:var(--text-muted)] mt-3">
            💡 비례율 100%↑ 사업성 양호 / 95%↓ 분담금 부담 큼. PDF 샘플 비례율 234.17%
          </p>
        </GlassCard>
      </div>

      <GlassCard>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <TrendingUp className="size-4 text-[color:var(--accent)]" />
          평형별 매출 (조합원 + 일반)
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <MixEditor
            title="조합원 분양 (단가: 일반의 80%)"
            mix={input.memberMix}
            onChange={(m) => setInput({ ...input, memberMix: m })}
          />
          <MixEditor
            title="일반 분양 (시세 단가)"
            mix={input.generalMix}
            onChange={(m) => setInput({ ...input, generalMix: m })}
          />
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="font-semibold mb-3">지출 10개 카테고리 (스택 막대)</h3>
        <div className="space-y-2">
          {r.costs.map((c) => (
            <div key={c.key} className="text-xs">
              <div className="flex justify-between mb-1">
                <span className="flex items-center gap-2">
                  <span
                    className="size-2 rounded-full"
                    style={{ background: COST_COLORS[c.key] ?? '#b6ff4a' }}
                  />
                  {c.label}
                </span>
                <span className="tabular-nums">
                  {formatKRW(c.amount)}{' '}
                  <span className="text-[color:var(--text-muted)]">({c.pct.toFixed(1)}%)</span>
                </span>
              </div>
              <div className="h-2 bg-white/5 rounded">
                <div
                  className="h-full rounded"
                  style={{
                    width: `${Math.min(100, c.pct)}%`,
                    background: COST_COLORS[c.key] ?? '#b6ff4a',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-white/5 flex justify-between text-sm">
          <span className="font-semibold">지출 합계</span>
          <span className="font-bold tabular-nums text-red-300">{formatKRW(r.totalCost)}</span>
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="font-semibold mb-3">금융 조건</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Field
              label="사업비 대출 원금 (원)"
              value={input.pfPrincipal}
              onChange={(v) => setInput({ ...input, pfPrincipal: v })}
            />
            <FieldFloat
              label="PF 금리 (%)"
              value={input.pfRatePct}
              onChange={(v) => setInput({ ...input, pfRatePct: v })}
            />
            <Field
              label="PF 기간 (월)"
              value={input.pfMonths}
              onChange={(v) => setInput({ ...input, pfMonths: v })}
            />
          </div>
          <div>
            <Field
              label="이주비 대출 원금 (원)"
              value={input.movingLoanPrincipal}
              onChange={(v) => setInput({ ...input, movingLoanPrincipal: v })}
            />
            <Field
              label="이주비 대출 기간 (월)"
              value={input.movingLoanMonths}
              onChange={(v) => setInput({ ...input, movingLoanMonths: v })}
            />
            <FieldFloat
              label="매출 부가세율 (%)"
              value={input.vatRatePct}
              onChange={(v) => setInput({ ...input, vatRatePct: v })}
            />
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

function MixEditor({
  title,
  mix,
  onChange,
}: {
  title: string;
  mix: UnitTypeMix[];
  onChange: (m: UnitTypeMix[]) => void;
}) {
  function update(i: number, patch: Partial<UnitTypeMix>) {
    const next = [...mix];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }
  return (
    <div>
      <div className="text-xs text-[color:var(--text-muted)] mb-2">{title}</div>
      <div className="space-y-2">
        {mix.map((m, i) => (
          <div key={i} className="grid grid-cols-4 gap-1 text-xs">
            <Mini
              label="전용㎡"
              value={m.exclusiveType}
              onChange={(v) => update(i, { exclusiveType: v })}
            />
            <Mini
              label="분양평"
              value={m.saleAreaPyeong}
              onChange={(v) => update(i, { saleAreaPyeong: v })}
            />
            <Mini
              label="세대"
              value={m.households}
              onChange={(v) => update(i, { households: v })}
            />
            <Mini
              label="평당만"
              value={m.unitPriceMan}
              onChange={(v) => update(i, { unitPriceMan: v })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function Mini({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="text-[9px] text-[color:var(--text-muted)] block">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-full rounded bg-white/5 border border-white/10 px-2 py-1 text-xs tabular-nums focus:outline-none focus:border-[color:var(--accent)]/40"
      />
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="mb-3">
      <label className="text-xs text-[color:var(--text-muted)] uppercase tracking-wider">{label}</label>
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
function FieldFloat(props: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="mb-3">
      <label className="text-xs text-[color:var(--text-muted)] uppercase tracking-wider">{props.label}</label>
      <input
        type="number"
        step="0.1"
        value={props.value}
        onChange={(e) => props.onChange(Number(e.target.value) || 0)}
        className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm tabular-nums focus:outline-none focus:border-[color:var(--accent)]/40"
      />
    </div>
  );
}
function Stat({ label, value, accent, danger }: { label: string; value: string; accent?: boolean; danger?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span className="text-xs text-[color:var(--text-secondary)]">{label}</span>
      <span className={`text-sm font-semibold tabular-nums ${accent ? 'text-[color:var(--accent)]' : danger ? 'text-red-400' : 'text-white'}`}>
        {value}
      </span>
    </div>
  );
}
function KPI({ label, value, accent, danger }: { label: string; value: string; accent?: boolean; danger?: boolean }) {
  return (
    <GlassCard>
      <div className="text-xs uppercase tracking-wider text-[color:var(--text-muted)]">{label}</div>
      <div className={`text-2xl font-semibold mt-2 tabular-nums ${accent ? 'text-[color:var(--accent)]' : danger ? 'text-red-300' : 'text-white'}`}>
        {value}
      </div>
    </GlassCard>
  );
}
