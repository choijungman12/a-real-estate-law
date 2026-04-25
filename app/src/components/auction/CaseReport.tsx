'use client';

import { GlassCard, Badge, SectionHeader, StatCard } from '@/components/ui/Glass';
import { formatKRW } from '@/lib/utils/cn';
import type { AuctionCaseReport } from '@/types/auction';
import {
  AlertTriangle,
  TrendingUp,
  Building2,
  Scale,
  Map as MapIcon,
  Sparkles,
  ListChecks,
  BookOpen,
  ChevronRight,
} from 'lucide-react';

const GRADE_COLOR: Record<string, string> = {
  A: 'text-emerald-300',
  'A-': 'text-emerald-300',
  'B+': 'text-cyan-300',
  B: 'text-cyan-300',
  'C+': 'text-amber-300',
  C: 'text-amber-400',
  D: 'text-red-400',
};
const SEVERITY_COLOR: Record<string, string> = {
  치명적: 'border-red-500/40 bg-red-500/10 text-red-300',
  높음: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  중간: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300',
  낮음: 'border-white/10 bg-white/5 text-[color:var(--text-secondary)]',
};

export default function CaseReport({
  report,
  source,
  cachedAt,
}: {
  report: AuctionCaseReport;
  source?: 'cache' | 'fresh';
  cachedAt?: string;
}) {
  return (
    <div className="space-y-6">
      {source === 'cache' && (
        <div className="text-xs text-[color:var(--accent)] flex items-center gap-2">
          ⚡ 캐시에서 즉시 반환 — {cachedAt ? new Date(cachedAt).toLocaleString('ko-KR') : '저장됨'}
          (analysis_cache 테이블)
        </div>
      )}
      {/* 헤더 */}
      <GlassCard className="border-[color:var(--accent)]/40">
        <div className="flex items-center gap-2 text-xs">
          <Badge tone="accent">{report.caseType}</Badge>
          <span className="text-[color:var(--text-muted)]">
            {report.court} · {report.caseNumber}
          </span>
        </div>
        <h2 className="text-xl font-semibold mt-2">{report.address}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-xs">
          <Field label="면적" value={`${report.area.m2}㎡ (${report.area.pyeong}평)`} />
          <Field label="용도지역" value={report.zoning} />
          <Field label="감정가" value={formatKRW(report.appraisalPrice)} />
          <Field
            label="최저가"
            value={`${formatKRW(report.minimumBidPrice)} (${report.appraisalRatioPct}%)`}
          />
        </div>
        <div className="mt-3 text-xs text-[color:var(--text-muted)]">
          입찰예정일: <strong className="text-[color:var(--accent)]">{report.bidDate}</strong>
        </div>
      </GlassCard>

      {/* 종합 판단 */}
      <GlassCard className="border-[color:var(--accent)]/40 accent-glow">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="size-4 text-[color:var(--accent)]" />
          <h3 className="font-semibold">◆ 투자 종합 판단</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="입찰 희망가" value={formatKRW(report.recommendation.suggestedBid)} />
          <StatCard
            label="감정가 대비"
            value={`${report.recommendation.suggestedBidVsAppraisalPct}%`}
          />
          <StatCard
            label="시세 대비"
            value={`${report.recommendation.suggestedBidVsMarketPct}%`}
          />
          <GlassCard>
            <div className="text-xs uppercase text-[color:var(--text-muted)]">투자 등급</div>
            <div
              className={`text-3xl font-bold mt-2 ${GRADE_COLOR[report.recommendation.grade] ?? ''}`}
            >
              {report.recommendation.grade}
            </div>
          </GlassCard>
        </div>
        <p className="mt-4 text-sm text-[color:var(--text-secondary)] leading-relaxed">
          <strong className="text-white">판정:</strong> {report.recommendation.summary}
        </p>
      </GlassCard>

      {/* 1. 물건 기본 분석 */}
      <Section
        title="1. 물건 기본 분석"
        icon={<Building2 className="size-4 text-[color:var(--accent)]" />}
      >
        <KVTable
          rows={[
            ['소재지', report.address],
            ['지목/용도', report.basicInfo.landUse],
            ['면적', `${report.area.m2}㎡ (${report.area.pyeong}평)`],
            ['지형', report.basicInfo.shape],
            ['도로접면', report.basicInfo.roadAccess],
            ...(report.basicInfo.specialDesignation
              ? [['특수지정', report.basicInfo.specialDesignation] as [string, string]]
              : []),
            ['주변환경', report.basicInfo.surroundings],
            [
              '개별공시지가',
              `${report.basicInfo.publicLandPrice.toLocaleString()}원/㎡`,
            ],
            [
              '감정평가',
              `${report.basicInfo.appraisalUnitPrice.toLocaleString()}원/㎡ (공시지가 대비 ${(
                report.basicInfo.appraisalUnitPrice / Math.max(1, report.basicInfo.publicLandPrice)
              ).toFixed(2)}배)`,
            ],
          ]}
        />
      </Section>

      {/* 2. 가격 분석 */}
      <Section
        title="2. 가격 및 수지 분석"
        icon={<TrendingUp className="size-4 text-[color:var(--accent)]" />}
      >
        <h4 className="text-xs uppercase text-[color:var(--text-muted)] mb-2">
          ◈ 감정가·시세·입찰가 비교
        </h4>
        <Table
          headers={['기준', '금액', '평당가', '입찰가 대비']}
          rows={report.priceAnalysis.benchmarks.map((b) => [
            b.label,
            formatKRW(b.amount),
            `${b.unitPriceMan}만`,
            b.vsBidPct ? `${b.vsBidPct}%` : '—',
          ])}
        />

        <h4 className="text-xs uppercase text-[color:var(--text-muted)] mt-5 mb-2">
          ◈ 매각 과정 ({report.priceAnalysis.auctionRounds.length}회)
        </h4>
        <Table
          headers={['회차', '일자', '매각가', '감정가 대비', '결과']}
          rows={report.priceAnalysis.auctionRounds.map((r) => [
            String(r.round),
            r.date,
            formatKRW(r.price),
            `${r.vsAppraisalPct}%`,
            r.result,
          ])}
        />

        {report.priceAnalysis.nearbyCases.length > 0 && (
          <>
            <h4 className="text-xs uppercase text-[color:var(--text-muted)] mt-5 mb-2">
              ◈ 인근 매각 사례
            </h4>
            <Table
              headers={['사건', '면적', '감정가', '매각가', '매각가율']}
              rows={report.priceAnalysis.nearbyCases.map((c) => [
                c.label,
                c.areaM2 ? `${c.areaM2}㎡` : '—',
                formatKRW(c.appraisal),
                formatKRW(c.sold),
                `${c.ratePct}%`,
              ])}
            />
          </>
        )}
      </Section>

      {/* 3. 권리·배당 */}
      <Section
        title="3. 권리 및 배당 분석"
        icon={<Scale className="size-4 text-[color:var(--accent)]" />}
      >
        <h4 className="text-xs uppercase text-[color:var(--text-muted)] mb-2">
          ◈ 등기부 권리 현황
        </h4>
        <Table
          headers={['접수일', '종류', '권리자', '채권액', '처리']}
          rows={report.rightsAndDividend.rights.map((r) => [
            r.date,
            r.type,
            r.holder,
            r.amount ? formatKRW(r.amount) : '—',
            r.treatment,
          ])}
        />
        <div className="mt-3 space-y-1 text-xs">
          {report.rightsAndDividend.cancellationBaseDate && (
            <div className="text-[color:var(--accent)]">
              ✓ 말소기준일: {report.rightsAndDividend.cancellationBaseDate}
            </div>
          )}
          <div
            className={
              report.rightsAndDividend.isCleanTitle
                ? 'text-[color:var(--accent)]'
                : 'text-red-400'
            }
          >
            {report.rightsAndDividend.isCleanTitle
              ? '✓ 인수사항 없음 → 깨끗한 소유권 취득 가능'
              : `🚨 인수: ${report.rightsAndDividend.survivingRights.join(', ')}`}
          </div>
        </div>

        {report.rightsAndDividend.dividend.length > 0 && (
          <>
            <h4 className="text-xs uppercase text-[color:var(--text-muted)] mt-5 mb-2">
              ◈ 배당 예상
            </h4>
            <Table
              headers={['순위', '배당자', '예상배당', '잔액']}
              rows={report.rightsAndDividend.dividend.map((d) => [
                String(d.rank),
                d.payee,
                formatKRW(d.expected),
                formatKRW(d.remaining),
              ])}
            />
          </>
        )}
      </Section>

      {/* 4. 개발 가능성·규제 */}
      <Section
        title="4. 개발 가능성 & 규제 분석"
        icon={<AlertTriangle className="size-4 text-[color:var(--accent)]" />}
      >
        <h4 className="text-xs uppercase text-[color:var(--text-muted)] mb-2">
          ◈ 토지이용규제 중첩 현황
        </h4>
        <div className="grid md:grid-cols-2 gap-2">
          {report.developmentRisks.items.map((it, i) => (
            <div
              key={i}
              className={`rounded-lg border p-3 text-xs ${SEVERITY_COLOR[it.severity] ?? ''}`}
            >
              <div className="flex items-center justify-between">
                <strong className="text-sm">{it.title}</strong>
                <Badge tone={it.severity === '치명적' || it.severity === '높음' ? 'danger' : 'warn'}>
                  {it.severity}
                </Badge>
              </div>
              <p className="text-[color:var(--text-secondary)] mt-1">{it.detail}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-lg bg-[color:var(--accent-soft)] border border-[color:var(--accent-soft)] p-3 text-sm">
          <strong className="text-[color:var(--accent)]">종합 판단:</strong>{' '}
          {report.developmentRisks.overallVerdict}
        </div>
      </Section>

      {/* 5. 도시계획·SOC */}
      <Section
        title="5. 도시계획 · SOC · 재개발"
        icon={<MapIcon className="size-4 text-[color:var(--accent)]" />}
      >
        <SubList title="◈ 도시기본계획" items={report.urbanPlanning.masterPlan} />
        <SubList title="◈ 인근 개발 동향" items={report.urbanPlanning.nearbyDevelopments} />
        <SubList title="◈ SOC 인프라" items={report.urbanPlanning.socInfra} />
      </Section>

      {/* 6. 리스크 vs 기회 */}
      <Section title="6. 리스크 vs 기회 매트릭스" icon={<Sparkles className="size-4 text-[color:var(--accent)]" />}>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            {report.riskOpportunity.risks.map((r, i) => (
              <div key={i} className="rounded-lg bg-red-500/5 border border-red-500/20 p-3 mb-2 text-xs">
                <div className="text-red-300 font-semibold">▼ RISK — {r.title}</div>
                <p className="text-[color:var(--text-secondary)] mt-1">{r.detail}</p>
              </div>
            ))}
          </div>
          <div>
            {report.riskOpportunity.opportunities.map((o, i) => (
              <div key={i} className="rounded-lg bg-[color:var(--accent-soft)] border border-[color:var(--accent-soft)] p-3 mb-2 text-xs">
                <div className="text-[color:var(--accent)] font-semibold">▲ OPPORTUNITY — {o.title}</div>
                <p className="text-[color:var(--text-secondary)] mt-1">{o.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 7. 시나리오 + 취득비용 */}
      <Section title="7. 투자 시나리오별 수익 분석" icon={<TrendingUp className="size-4 text-[color:var(--accent)]" />}>
        <Table
          headers={['시나리오', '조건', '예상 매도가', '수익률', '기간']}
          rows={report.scenarios.map((s) => [s.name, s.condition, s.expectedSale, s.roiPct, s.period])}
        />
        <h4 className="text-xs uppercase text-[color:var(--text-muted)] mt-5 mb-2">
          ◈ 취득 비용 추정
        </h4>
        <Table
          headers={['항목', '금액']}
          rows={[
            ['낙찰대금', formatKRW(report.acquisitionCost.bidPrice)],
            ['취득세', formatKRW(report.acquisitionCost.acquisitionTax)],
            ['등기비용', formatKRW(report.acquisitionCost.registrationFee)],
            ['명도비용', formatKRW(report.acquisitionCost.evictionCost)],
            ['총 투자액', formatKRW(report.acquisitionCost.total)],
          ]}
        />
      </Section>

      {/* 8. 체크리스트 */}
      <Section title="8. 입찰 전 필수 확인사항" icon={<ListChecks className="size-4 text-[color:var(--accent)]" />}>
        <ol className="space-y-2">
          {report.checklist.map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="grid place-items-center size-5 rounded-full bg-[color:var(--accent-soft)] text-[color:var(--accent)] text-[10px] font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-[color:var(--text-secondary)]">{c}</span>
            </li>
          ))}
        </ol>
      </Section>

      {/* 법령 인용 */}
      {report.legalCitations.length > 0 && (
        <Section title="📖 법령 인용" icon={<BookOpen className="size-4 text-[color:var(--accent)]" />}>
          <ul className="space-y-2">
            {report.legalCitations.map((c, i) => (
              <li key={i} className="rounded-lg bg-white/[0.03] border border-white/5 p-3 text-sm">
                <strong>{c.law} {c.article}</strong>
                <div className="text-xs text-[color:var(--text-muted)] mt-1">{c.quote}</div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <div className="text-center text-[10px] text-[color:var(--text-muted)] py-4">
        본 보고서는 공개 자료 + AI 추론으로 작성된 참고용 분석입니다 · 신뢰도 {Math.round(report.confidence * 100)}%
      </div>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="font-semibold text-base">{title}</h3>
      </div>
      {children}
    </GlassCard>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/[0.04] border border-white/5 p-2.5">
      <div className="text-[10px] uppercase text-[color:var(--text-muted)] tracking-wider">
        {label}
      </div>
      <div className="text-sm font-semibold mt-1 truncate">{value}</div>
    </div>
  );
}

function KVTable({ rows }: { rows: [string, string][] }) {
  return (
    <table className="w-full text-sm">
      <tbody>
        {rows.map(([k, v], i) => (
          <tr key={i} className="border-b border-white/5 last:border-0">
            <td className="py-2 pr-3 text-xs text-[color:var(--text-muted)] w-32">{k}</td>
            <td className="py-2 text-[color:var(--text-secondary)]">{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead className="text-[color:var(--text-muted)] uppercase">
          <tr className="border-b border-white/5">
            {headers.map((h) => (
              <th key={h} className="text-left py-2 px-2 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-white/5 hover:bg-white/[0.03]">
              {r.map((c, j) => (
                <td key={j} className="py-2 px-2 text-[color:var(--text-secondary)]">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SubList({ title, items }: { title: string; items: string[] }) {
  if (!items?.length) return null;
  return (
    <div className="mb-4">
      <h4 className="text-xs uppercase text-[color:var(--text-muted)] mb-2">{title}</h4>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <ChevronRight className="size-3 text-[color:var(--accent)] shrink-0 mt-1" />
            <span className="text-[color:var(--text-secondary)]">{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
