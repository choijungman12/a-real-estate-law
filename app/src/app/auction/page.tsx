'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { formatKRW } from '@/lib/utils/cn';
import { GlassCard, Badge, SectionHeader } from '@/components/ui/Glass';
import AutoBanner from '@/components/common/AutoBanner';
import PropertyDetailModal, { type DetailItem } from '@/components/map/PropertyDetailModal';
import type { AuctionAnalysis } from '@/types/auction';
import { Upload, Sparkles, AlertTriangle, FileText, BookOpen, Eye, MapPin } from 'lucide-react';

export default function AuctionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [model, setModel] = useState<'fast' | 'balanced' | 'smart'>('balanced');
  const [analysis, setAnalysis] = useState<AuctionAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailItem, setDetailItem] = useState<DetailItem | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 30 * 1024 * 1024,
    multiple: false,
    onDrop: (accepted) => {
      if (accepted[0]) {
        setFile(accepted[0]);
        setAnalysis(null);
        setError(null);
      }
    },
  });

  async function analyze() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('model', model);
      const res = await fetch('/api/auction-analysis', { method: 'POST', body: fd });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error ?? 'API 오류');
      }
      const json = await res.json();
      setAnalysis(json.analysis);
    } catch (e) {
      setError(e instanceof Error ? e.message : '오류');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <SectionHeader
        title="경매 권리분석"
        subtitle="지지옥션 매물 PDF → Claude 자체 권리분석 (말소기준·인수권리·임차인 위험·법령 인용)"
        action={<Badge tone="accent">AI · CORE</Badge>}
      />

      <AutoBanner required={['anthropic']} />

      <div
        {...getRootProps()}
        className={`relative overflow-hidden rounded-3xl p-12 text-center cursor-pointer transition border-2 border-dashed ${
          isDragActive
            ? 'border-[color:var(--accent)] bg-[color:var(--accent-soft)]'
            : 'border-white/15 bg-white/[0.03] hover:bg-white/[0.06]'
        }`}
      >
        <input {...getInputProps()} />
        <div className="grid place-items-center mb-4">
          <div className="grid place-items-center size-16 rounded-2xl bg-gradient-to-br from-[color:var(--accent)] to-emerald-400 text-black">
            <Upload className="size-8" />
          </div>
        </div>
        {file ? (
          <div>
            <div className="flex items-center justify-center gap-2 text-sm">
              <FileText className="size-4 text-[color:var(--accent)]" />
              <span className="font-medium">{file.name}</span>
            </div>
            <div className="text-xs text-[color:var(--text-muted)] mt-1">
              {(file.size / 1024 / 1024).toFixed(2)} MB · 다른 파일을 끌어다 놓으면 교체
            </div>
          </div>
        ) : (
          <div>
            <p className="text-base font-medium tracking-wider">
              {isDragActive ? '여기에 놓으세요' : 'REAL ESTATE 드래그 또는 클릭'}
            </p>
            <p className="text-xs text-[color:var(--text-muted)] mt-1">
              본인 계정으로 다운로드한 경매·공매 매물 PDF · 최대 30MB · 제3자 공유 금지
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-xl bg-white/5 border border-white/10 p-1">
          {(['fast', 'balanced', 'smart'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setModel(m)}
              className={`px-3 py-1.5 text-xs rounded-lg transition ${
                model === m
                  ? 'bg-white/10 text-white'
                  : 'text-[color:var(--text-muted)] hover:text-white'
              }`}
            >
              {m === 'fast' ? 'Haiku 4.5' : m === 'balanced' ? 'Sonnet 4.6' : 'Opus 4.7'}
            </button>
          ))}
        </div>
        <button
          onClick={analyze}
          disabled={!file || loading}
          className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--accent)] text-black px-5 py-2.5 text-sm font-semibold disabled:opacity-50 accent-glow"
        >
          <Sparkles className="size-4" />
          {loading ? '분석 중… (30~60초)' : '권리분석 시작'}
        </button>
      </div>

      {error && (
        <GlassCard className="border-red-500/30 bg-red-500/5 text-red-300 text-sm">
          {error}
        </GlassCard>
      )}

      {analysis && (
        <div className="space-y-4">
          {/* PDF에서 추출한 매물 식별 정보 + 인근 실거래가 자동 조회 트리거 */}
          {analysis.caseSummary?.address && (
            <GlassCard className="border-[color:var(--accent)]/40">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="grid place-items-center size-10 rounded-xl bg-gradient-to-br from-[color:var(--accent)] to-emerald-400 text-black shrink-0">
                    <MapPin className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-[color:var(--accent)]">
                      {analysis.caseSummary.caseNumber ?? '사건번호 미인식'} · {analysis.caseSummary.propertyType ?? '용도 미인식'}
                    </div>
                    <div className="font-semibold text-sm mt-0.5 truncate">
                      {analysis.caseSummary.address}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setDetailItem({
                      id: analysis.caseSummary!.caseNumber ?? 'auction',
                      title: analysis.caseSummary!.caseNumber ?? '경매 매물',
                      address: analysis.caseSummary!.address!,
                      category: 'auction',
                      appraisalAmount: analysis.caseSummary!.appraisalAmount,
                      minimumBidPrice: analysis.caseSummary!.minimumBidPrice,
                      startDate: analysis.caseSummary!.bidDate,
                    })
                  }
                  className="inline-flex items-center gap-1 rounded-lg bg-[color:var(--accent)] text-black px-3 py-1.5 text-xs font-semibold shrink-0"
                >
                  <MapPin className="size-3" /> 인근 실거래가 자동 조회
                </button>
              </div>
            </GlassCard>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlassCard>
              <div className="text-xs uppercase text-[color:var(--text-muted)]">신뢰도</div>
              <div className="mt-2 text-3xl font-semibold tabular-nums">
                {Math.round(analysis.confidence * 100)}
                <span className="text-sm text-[color:var(--text-muted)]">%</span>
              </div>
            </GlassCard>
            {analysis.cancellationBase && (
              <GlassCard className="md:col-span-2">
                <div className="text-xs uppercase text-[color:var(--text-muted)]">
                  말소기준권리
                </div>
                <div className="mt-2 text-base">
                  <span className="font-semibold">{analysis.cancellationBase.type}</span>
                  <span className="text-[color:var(--text-secondary)] ml-2">
                    · {analysis.cancellationBase.date} · {analysis.cancellationBase.holder}
                  </span>
                </div>
              </GlassCard>
            )}
          </div>

          {analysis.survivingRights?.length > 0 && (
            <GlassCard>
              <SectionHeader
                title="🚨 인수 권리"
                subtitle="낙찰자가 추가 부담"
                action={<Badge tone="danger">{analysis.survivingRights.length}건</Badge>}
              />
              <ul className="space-y-2">
                {analysis.survivingRights.map((r, i) => (
                  <li
                    key={i}
                    className="rounded-xl bg-red-500/5 border border-red-500/20 p-3 text-sm"
                  >
                    <span className="font-semibold">{r.type}</span>
                    <span className="text-[color:var(--text-secondary)] ml-2">
                      {r.date} · {r.holder}
                    </span>
                    {r.amount && (
                      <span className="text-red-300 ml-2">{formatKRW(r.amount)}</span>
                    )}
                  </li>
                ))}
              </ul>
            </GlassCard>
          )}

          {analysis.tenantRisks?.length > 0 && (
            <GlassCard>
              <SectionHeader
                title="임차인 위험"
                action={<Badge tone="warn">{analysis.tenantRisks.length}건</Badge>}
              />
              <ul className="space-y-2">
                {analysis.tenantRisks.map((t, i) => (
                  <li
                    key={i}
                    className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-3 text-sm"
                  >
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-[color:var(--text-secondary)] mt-1">{t.risk}</div>
                    {t.estimatedBurden && (
                      <div className="text-amber-300 text-xs mt-1">
                        예상 추가 부담 {formatKRW(t.estimatedBurden)}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </GlassCard>
          )}

          {analysis.warnings?.length > 0 && (
            <GlassCard>
              <SectionHeader title="⚠️ 특이사항" />
              <ul className="space-y-2 text-sm">
                {analysis.warnings.map((w, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <AlertTriangle className="size-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          )}

          {analysis.discrepanciesWithSource?.length > 0 && (
            <GlassCard className="border-[color:var(--accent-soft)]">
              <SectionHeader
                title="🔍 지지옥션 분석과의 차이점"
                subtitle="자체 재분석 결과 불일치 항목"
                action={<Badge tone="accent">{analysis.discrepanciesWithSource.length}건</Badge>}
              />
              <ul className="space-y-2 text-sm">
                {analysis.discrepanciesWithSource.map((d, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <Eye className="size-4 text-[color:var(--accent)] shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          )}

          {analysis.legalCitations?.length > 0 && (
            <GlassCard>
              <SectionHeader title="📖 법령 인용" />
              <ul className="space-y-2">
                {analysis.legalCitations.map((c, i) => (
                  <li
                    key={i}
                    className="rounded-xl bg-white/[0.03] border border-white/5 p-3 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="size-4 text-[color:var(--accent)]" />
                      <span className="font-semibold">
                        {c.law} {c.article}
                      </span>
                    </div>
                    <div className="text-[color:var(--text-secondary)] text-xs mt-1.5 pl-6">
                      {c.quote}
                    </div>
                  </li>
                ))}
              </ul>
            </GlassCard>
          )}
        </div>
      )}

      <PropertyDetailModal item={detailItem} onClose={() => setDetailItem(null)} />
    </div>
  );
}
