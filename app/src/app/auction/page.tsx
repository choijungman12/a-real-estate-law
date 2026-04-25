'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { formatKRW } from '@/lib/utils/cn';
import type { AuctionAnalysis } from '@/types/auction';

export default function AuctionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [model, setModel] = useState<'fast' | 'balanced' | 'smart'>('balanced');
  const [analysis, setAnalysis] = useState<AuctionAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const res = await fetch('/api/auction-analysis', {
        method: 'POST',
        body: fd,
      });
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">경매 권리분석 — 지지옥션 PDF 업로드</h1>
        <p className="text-sm text-zinc-600 mt-1">
          본인 계정으로 다운로드한 지지옥션 매물 상세 PDF를 올리면 Claude가 권리분석·임차인 위험·법령 인용을 자체 재분석합니다. (제3자 공유 금지)
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-zinc-300 bg-white'
        }`}
      >
        <input {...getInputProps()} />
        {file ? (
          <div>
            <p className="font-medium">{file.name}</p>
            <p className="text-xs text-zinc-500 mt-1">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <p className="text-zinc-600">
            여기로 PDF를 끌어다 놓거나 클릭해서 선택 (최대 30MB)
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <select
          value={model}
          onChange={(e) => setModel(e.target.value as 'fast' | 'balanced' | 'smart')}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="fast">Haiku 4.5 (빠름·저렴)</option>
          <option value="balanced">Sonnet 4.6 (권장)</option>
          <option value="smart">Opus 4.7 (최고 정확도)</option>
        </select>
        <button
          onClick={analyze}
          disabled={!file || loading}
          className="bg-zinc-900 text-white rounded px-5 py-2 hover:bg-zinc-800 disabled:opacity-50"
        >
          {loading ? '분석 중... (30~60초)' : '권리분석 시작'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 text-sm">
          {error}
        </div>
      )}

      {analysis && (
        <div className="space-y-4">
          <Section title="신뢰도">
            <div className="text-2xl font-bold">
              {Math.round(analysis.confidence * 100)}%
            </div>
          </Section>

          {analysis.cancellationBase && (
            <Section title="말소기준권리">
              <div className="text-sm">
                <strong>{analysis.cancellationBase.type}</strong> · {analysis.cancellationBase.date}{' '}
                · {analysis.cancellationBase.holder}
              </div>
            </Section>
          )}

          {analysis.survivingRights?.length > 0 && (
            <Section title="🚨 인수 권리 (낙찰자 부담)">
              <ul className="text-sm space-y-1">
                {analysis.survivingRights.map((r, i) => (
                  <li key={i} className="border-l-4 border-red-500 pl-3">
                    <strong>{r.type}</strong> · {r.date} · {r.holder}
                    {r.amount ? ` · ${formatKRW(r.amount)}` : ''}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {analysis.tenantRisks?.length > 0 && (
            <Section title="임차인 위험">
              <ul className="text-sm space-y-2">
                {analysis.tenantRisks.map((t, i) => (
                  <li key={i} className="bg-amber-50 border border-amber-200 rounded p-3">
                    <strong>{t.name}</strong> — {t.risk}
                    {t.estimatedBurden ? (
                      <span className="block text-xs mt-1">
                        예상 추가 부담: {formatKRW(t.estimatedBurden)}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {analysis.warnings?.length > 0 && (
            <Section title="⚠️ 특이사항·경고">
              <ul className="text-sm space-y-1 list-disc pl-5">
                {analysis.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </Section>
          )}

          {analysis.discrepanciesWithSource?.length > 0 && (
            <Section title="🔍 지지옥션 분석과의 차이점">
              <ul className="text-sm space-y-1 list-disc pl-5">
                {analysis.discrepanciesWithSource.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </Section>
          )}

          {analysis.legalCitations?.length > 0 && (
            <Section title="📖 법령 인용">
              <ul className="text-sm space-y-2">
                {analysis.legalCitations.map((c, i) => (
                  <li key={i} className="bg-zinc-50 rounded p-3">
                    <strong>
                      {c.law} {c.article}
                    </strong>
                    <div className="text-zinc-600 text-xs mt-1">{c.quote}</div>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border rounded-xl p-5">
      <h3 className="font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}
