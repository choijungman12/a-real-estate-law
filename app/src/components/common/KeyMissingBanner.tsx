'use client';

import { AlertTriangle, ExternalLink } from 'lucide-react';

export type KeySpec = {
  envVar: string;
  label: string;
  url: string;
  helper?: string;
};

export default function KeyMissingBanner({
  required,
  optional = [],
}: {
  required: KeySpec[];
  optional?: KeySpec[];
}) {
  return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="size-4 text-amber-400" />
        <span className="font-semibold text-amber-300">
          API 키 미설정 — 실제 데이터 호출이 안 됩니다
        </span>
      </div>
      <p className="text-[color:var(--text-secondary)] mb-3 text-xs">
        <code className="bg-black/30 px-1 rounded">app/.env.local</code> 에 아래 키를 입력하고
        dev 서버를 재시작하면 즉시 작동합니다. (또는 Vercel 배포 시 Environment Variables에 추가)
      </p>
      <div className="space-y-2">
        {required.map((k) => (
          <div key={k.envVar} className="flex items-center justify-between gap-3 rounded-lg bg-black/20 border border-white/5 px-3 py-2">
            <div className="min-w-0">
              <code className="text-xs font-mono text-amber-300">{k.envVar}</code>
              <span className="text-xs text-[color:var(--text-muted)] ml-2">{k.label}</span>
              {k.helper && (
                <div className="text-[10px] text-[color:var(--text-muted)] mt-0.5">{k.helper}</div>
              )}
            </div>
            <a
              href={k.url}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 inline-flex items-center gap-1 text-xs text-[color:var(--accent)] hover:underline"
            >
              발급 <ExternalLink className="size-3" />
            </a>
          </div>
        ))}
        {optional.length > 0 && (
          <details className="mt-2">
            <summary className="text-xs text-[color:var(--text-muted)] cursor-pointer hover:text-white">
              선택적 키 ({optional.length}개)
            </summary>
            <div className="mt-2 space-y-2">
              {optional.map((k) => (
                <div key={k.envVar} className="flex items-center justify-between gap-3 rounded-lg bg-black/20 border border-white/5 px-3 py-2">
                  <div className="min-w-0">
                    <code className="text-xs font-mono text-[color:var(--text-secondary)]">
                      {k.envVar}
                    </code>
                    <span className="text-xs text-[color:var(--text-muted)] ml-2">{k.label}</span>
                  </div>
                  <a
                    href={k.url}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 inline-flex items-center gap-1 text-xs text-[color:var(--accent)] hover:underline"
                  >
                    발급 <ExternalLink className="size-3" />
                  </a>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
