'use client';

import { useMemo, useState } from 'react';
import { GlassCard, Badge, SectionHeader, StatCard } from '@/components/ui/Glass';
import { formatKRW } from '@/lib/utils/cn';
import {
  calculateAppraisal,
  ZONING_RULES,
  STRUCTURE_LABEL,
} from '@/lib/finance/appraisal';
import {
  calculateFeasibility,
  calculateConsentRate,
  calculateDecrepitRate,
} from '@/lib/finance/feasibility';
import { LEGAL_DATABASE } from '@/lib/law/legalDatabase';
import { buildConsentHTML, generateCertId } from '@/lib/consent/buildConsentHTML';
import type {
  AppraisalInput,
  FeasibilityInput,
  ZoningType,
  BuildingStructure,
} from '@/types/redevelopment';
import { Building2, Calculator, ScrollText, FileSignature, ArrowRight } from 'lucide-react';

type Tab = 'overview' | 'appraisal' | 'feasibility' | 'consent';

export default function RedevPage() {
  const [tab, setTab] = useState<Tab>('overview');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SectionHeader
        title="정비사업 워크스페이스"
        subtitle="재개발·재건축 — 보상감정평가, 비례율·분담금, 동의서 발급, 법령 인용"
        action={
          <a
            href="/redev/cashflow"
            className="inline-flex items-center gap-1 rounded-lg bg-[color:var(--accent)] text-black px-3 py-1.5 text-xs font-semibold"
          >
            종합 수지분석 (PDF 양식) <ArrowRight className="size-3" />
          </a>
        }
      />

      <div className="flex gap-1 rounded-xl glass p-1 w-fit overflow-x-auto">
        {(
          [
            { v: 'overview', icon: <Building2 className="size-4" />, label: '사업 개요·법령' },
            { v: 'appraisal', icon: <Calculator className="size-4" />, label: '보상감정평가' },
            { v: 'feasibility', icon: <Calculator className="size-4" />, label: '사업성 (비례율)' },
            { v: 'consent', icon: <FileSignature className="size-4" />, label: '동의서 발급' },
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

      {tab === 'overview' && <OverviewTab />}
      {tab === 'appraisal' && <AppraisalTab />}
      {tab === 'feasibility' && <FeasibilityTab />}
      {tab === 'consent' && <ConsentTab />}
    </div>
  );
}

// ─── Overview ───────────────────────────────────────

function OverviewTab() {
  const fakeBuildings = Array.from({ length: 90 }).map((_, i) => ({
    buildingAge: 1980 + (i % 30),
  }));
  const decrepit = calculateDecrepitRate(fakeBuildings);
  const consentRate = calculateConsentRate(245, 480);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="구역 면적" value="88,165㎡" hint="약 2.67ha" />
        <StatCard label="필지 수" value="179" hint="과소필지 비율 점검 필요" />
        <StatCard
          label="노후·불량 (20년+)"
          value={`${decrepit.toFixed(1)}%`}
          hint="기준 60% 이상 (도정법 시행령)"
          delta={{ value: decrepit >= 60 ? '✓ 충족' : '미충족', positive: decrepit >= 60 }}
        />
        <StatCard
          label="입안 동의율"
          value={`${consentRate.toFixed(1)}%`}
          hint="목표 50% (도정법 §8 + 서울조례 §6)"
          delta={{ value: consentRate >= 50 ? '✓ 달성' : '진행 중', positive: consentRate >= 50 }}
        />
      </div>

      <GlassCard>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <ScrollText className="size-4 text-[color:var(--accent)]" /> 핵심 법령·판례 ({LEGAL_DATABASE.length}건)
        </h3>
        <div className="space-y-2">
          {LEGAL_DATABASE.map((l) => (
            <div key={l.id} className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
              <div className="flex items-center gap-2 text-xs">
                <Badge tone={l.category === '판례' ? 'warn' : 'accent'}>{l.category}</Badge>
                <span className="font-semibold">{l.title}</span>
                <span className="text-[color:var(--text-muted)]">· {l.article}</span>
              </div>
              <p className="text-xs text-[color:var(--text-secondary)] mt-2 leading-relaxed">
                {l.content}
              </p>
              {l.url && (
                <a
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-[color:var(--accent)] hover:underline mt-2 inline-block"
                >
                  → 국가법령정보센터 원문
                </a>
              )}
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

// ─── Appraisal ───────────────────────────────────────

function AppraisalTab() {
  const [input, setInput] = useState<AppraisalInput>({
    landArea: 165,
    publicLandPrice: 2_850_000,
    locationFactor: 1.1,
    individualFactor: 1.05,
    zoning: 'general_residential_2',
    buildingArea: 89,
    buildingYear: 1988,
    buildingType: 'rc',
    hasBusinessLoss: false,
    businessMonthlyRevenue: 0,
    tenantCount: 0,
    isResident: true,
  });

  const result = useMemo(() => calculateAppraisal(input), [input]);

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <GlassCard>
        <div className="text-xs uppercase tracking-wider text-[color:var(--text-muted)] mb-3">
          입력 (토지보상법 §70~79)
        </div>
        <Row label="토지면적 (㎡)" value={input.landArea} onChange={(v) => setInput({ ...input, landArea: v })} />
        <Row label="공시지가 (원/㎡)" value={input.publicLandPrice} onChange={(v) => setInput({ ...input, publicLandPrice: v })} />
        <RowFloat label="지역요인 보정치" value={input.locationFactor} onChange={(v) => setInput({ ...input, locationFactor: v })} />
        <RowFloat label="개별요인 보정치" value={input.individualFactor} onChange={(v) => setInput({ ...input, individualFactor: v })} />
        <Select
          label="용도지역"
          value={input.zoning}
          options={Object.entries(ZONING_RULES).map(([k, v]) => ({
            value: k,
            label: `${v.label} (건폐 ${v.buildingCoverage}/용적 ${v.floorAreaRatio})`,
          }))}
          onChange={(v) => setInput({ ...input, zoning: v as ZoningType })}
        />
        <Row label="건축물 연면적 (㎡)" value={input.buildingArea} onChange={(v) => setInput({ ...input, buildingArea: v })} />
        <Row label="건축년도" value={input.buildingYear} onChange={(v) => setInput({ ...input, buildingYear: v })} />
        <Select
          label="건물 구조"
          value={input.buildingType}
          options={(Object.keys(STRUCTURE_LABEL) as BuildingStructure[]).map((k) => ({
            value: k,
            label: STRUCTURE_LABEL[k],
          }))}
          onChange={(v) => setInput({ ...input, buildingType: v as BuildingStructure })}
        />
        <Row label="세입자 수" value={input.tenantCount} onChange={(v) => setInput({ ...input, tenantCount: v })} />
        <label className="flex items-center gap-2 text-sm mt-2">
          <input
            type="checkbox"
            checked={input.isResident}
            onChange={(e) => setInput({ ...input, isResident: e.target.checked })}
          />
          소유자 본인 거주
        </label>
        <label className="flex items-center gap-2 text-sm mt-2">
          <input
            type="checkbox"
            checked={input.hasBusinessLoss}
            onChange={(e) => setInput({ ...input, hasBusinessLoss: e.target.checked })}
          />
          영업손실 있음
        </label>
        {input.hasBusinessLoss && (
          <Row
            label="월 영업이익 (원)"
            value={input.businessMonthlyRevenue ?? 0}
            onChange={(v) => setInput({ ...input, businessMonthlyRevenue: v })}
          />
        )}
      </GlassCard>

      <GlassCard>
        <div className="text-xs uppercase tracking-wider text-[color:var(--text-muted)] mb-3">
          보상 산정 결과
        </div>
        <div className="rounded-xl bg-[color:var(--accent-soft)] border border-[color:var(--accent-soft)] p-4 mb-4">
          <div className="text-xs text-[color:var(--text-secondary)]">총 보상액</div>
          <div className="text-3xl font-bold text-[color:var(--accent)] tabular-nums mt-1">
            {formatKRW(result.totalCompensation)}
          </div>
        </div>
        <div className="space-y-2">
          {result.breakdown.map((b) => (
            <div key={b.label} className="rounded-lg bg-white/[0.03] border border-white/5 p-3">
              <div className="flex justify-between text-sm">
                <span>{b.label}</span>
                <span className="font-semibold tabular-nums">{formatKRW(b.amount)}</span>
              </div>
              <div className="text-[10px] text-[color:var(--text-muted)] mt-1">{b.basis}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

// ─── Feasibility ───────────────────────────────────────

function FeasibilityTab() {
  const [input, setInput] = useState<FeasibilityInput>({
    totalProjectCost: 800_000_000_000,
    expectedSalePrice: 12_000_000,
    totalSaleArea: 250_000,
    totalBefore: 600_000_000_000,
    memberCount: 480,
    avgUnitArea: 84,
    rentalIncome: 0,
    additionalCosts: 0,
  });
  const r = useMemo(() => calculateFeasibility(input), [input]);

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <GlassCard>
        <div className="text-xs uppercase tracking-wider text-[color:var(--text-muted)] mb-3">
          입력
        </div>
        <Row label="총 사업비 (원)" value={input.totalProjectCost} onChange={(v) => setInput({ ...input, totalProjectCost: v })} />
        <Row label="평당 분양가 → 단가 (원/㎡)" value={input.expectedSalePrice} onChange={(v) => setInput({ ...input, expectedSalePrice: v })} />
        <Row label="총 분양면적 (㎡)" value={input.totalSaleArea} onChange={(v) => setInput({ ...input, totalSaleArea: v })} />
        <Row label="종전자산 총가치 (원)" value={input.totalBefore} onChange={(v) => setInput({ ...input, totalBefore: v })} />
        <Row label="조합원 수" value={input.memberCount} onChange={(v) => setInput({ ...input, memberCount: v })} />
        <Row label="평균 분양 전용 (㎡)" value={input.avgUnitArea} onChange={(v) => setInput({ ...input, avgUnitArea: v })} />
        <Row label="임대수입 (원, 선택)" value={input.rentalIncome ?? 0} onChange={(v) => setInput({ ...input, rentalIncome: v })} />
        <Row label="추가 비용 (원, 선택)" value={input.additionalCosts ?? 0} onChange={(v) => setInput({ ...input, additionalCosts: v })} />
      </GlassCard>

      <GlassCard>
        <div className="text-xs uppercase tracking-wider text-[color:var(--text-muted)] mb-3">결과</div>
        <Stat label="비례율" value={`${r.proportionalRate.toFixed(2)}%`} accent={r.proportionalRate >= 100} danger={r.proportionalRate < 95} />
        <Stat label="종후 자산가치" value={formatKRW(r.postAssetValue)} />
        <Stat label="총 분양수입" value={formatKRW(r.totalSaleRevenue)} />
        <Stat label="순이익" value={formatKRW(r.netProfit)} accent={r.netProfit > 0} danger={r.netProfit <= 0} />
        <Stat label="수익률" value={`${r.profitRate.toFixed(2)}%`} />
        <Stat label="조합원 평균 분담금" value={formatKRW(r.averageAdditionalCost)} danger={r.averageAdditionalCost > 0} />
        <Stat label="손익분기 분양가 비율" value={`${r.breakEvenRate.toFixed(2)}%`} />
        <p className="text-xs text-[color:var(--text-muted)] mt-3">
          💡 비례율 100%↑ 사업성 양호 / 95%↓ 분담금 부담 큼.
        </p>
      </GlassCard>
    </div>
  );
}

// ─── Consent ───────────────────────────────────────

function ConsentTab() {
  const [form, setForm] = useState({
    name: '홍길동',
    phone: '010-0000-0000',
    birthdate: '1980-01-01',
    propertyAddress: '서울특별시 종로구 구기동 138-1',
    propertyType: '토지·건물 (소유)',
    propertyArea: '165',
    project: '구기동 재개발정비사업',
    projectAddress: '서울특별시 종로구 구기동 138-1 일원',
    projectArea: '약 88,165.5㎡ (약 2.67ha)',
    authMethod: 'kakao' as 'kakao' | 'pass' | 'other',
  });

  function open() {
    const certId = generateCertId();
    const html = buildConsentHTML({
      ...form,
      certId,
      signedAt: new Date().toLocaleString('ko-KR'),
      signature: form.name,
      document: '정비계획 입안 동의서',
    });
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <GlassCard>
        <div className="text-xs uppercase tracking-wider text-[color:var(--text-muted)] mb-3">
          동의자·사업 정보
        </div>
        {(
          [
            ['name', '성명'],
            ['birthdate', '생년월일'],
            ['phone', '연락처'],
            ['propertyAddress', '소유 부동산 주소'],
            ['propertyType', '소유 구분'],
            ['propertyArea', '면적 (㎡)'],
            ['project', '사업 명칭'],
            ['projectAddress', '사업 위치'],
            ['projectArea', '사업 면적'],
          ] as const
        ).map(([k, label]) => (
          <div key={k} className="mb-3">
            <label className="text-xs text-[color:var(--text-muted)] uppercase tracking-wider">
              {label}
            </label>
            <input
              value={form[k]}
              onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-[color:var(--accent)]/40"
            />
          </div>
        ))}
        <div className="mb-3">
          <label className="text-xs text-[color:var(--text-muted)] uppercase tracking-wider">
            인증수단
          </label>
          <div className="mt-1 flex gap-2">
            {(['kakao', 'pass', 'other'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setForm({ ...form, authMethod: m })}
                className={`flex-1 rounded-lg px-3 py-2 text-sm border ${
                  form.authMethod === m
                    ? 'bg-[color:var(--accent)] text-black border-transparent'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                {m === 'kakao' ? '카카오' : m === 'pass' ? 'PASS' : '기타'}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={open}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[color:var(--accent)] text-black px-4 py-3 text-sm font-semibold accent-glow"
        >
          <FileSignature className="size-4" /> 동의서 PDF 발급 (인쇄 미리보기)
        </button>
      </GlassCard>

      <GlassCard>
        <div className="text-xs uppercase tracking-wider text-[color:var(--text-muted)] mb-3">
          법적 효력 안내
        </div>
        <div className="space-y-3 text-sm text-[color:var(--text-secondary)]">
          <p>본 동의서는 「전자서명법」 제3조 + 「전자문서 및 전자거래 기본법」 제4조에 따라
          공인 전자서명을 통해 서명된 전자문서로서, 「도시 및 주거환경정비법 시행령」 제8조 제4항
          서면 동의서와 동일한 법적 효력을 가집니다.</p>
          <p>발급된 동의서에는 다음이 자동 포함됩니다:</p>
          <ul className="list-disc pl-5 text-xs space-y-1">
            <li>인증수단·인증번호·서명일시</li>
            <li>도정법 제13조①·시행령 제8조 근거</li>
            <li>개인정보 수집·이용·보유기간 (5년)</li>
            <li>전자서명 완료 인장</li>
          </ul>
          <p className="text-xs text-[color:var(--text-muted)]">
            발급 후 새 탭에서 인쇄 미리보기 → "PDF로 저장"으로 보관하세요.
          </p>
        </div>
      </GlassCard>
    </div>
  );
}

// ─── primitives ───────────────────────────────────────

function Row({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="mb-3">
      <label className="text-xs text-[color:var(--text-muted)] uppercase tracking-wider">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm tabular-nums focus:outline-none focus:border-[color:var(--accent)]/40"
      />
    </div>
  );
}
function RowFloat(props: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="mb-3">
      <label className="text-xs text-[color:var(--text-muted)] uppercase tracking-wider">{props.label}</label>
      <input
        type="number"
        step="0.01"
        value={props.value}
        onChange={(e) => props.onChange(Number(e.target.value) || 0)}
        className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm tabular-nums focus:outline-none focus:border-[color:var(--accent)]/40"
      />
    </div>
  );
}
function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-3">
      <label className="text-xs text-[color:var(--text-muted)] uppercase tracking-wider">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-[color:var(--accent)]/40"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-zinc-900">
            {o.label}
          </option>
        ))}
      </select>
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
