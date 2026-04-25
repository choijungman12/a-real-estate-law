'use client';

import { useState } from 'react';
import { GlassCard, Badge, SectionHeader } from '@/components/ui/Glass';
import { CURRICULUM, type Track } from '@/lib/study/curriculum';
import { CheckCircle2, Clock, ExternalLink } from 'lucide-react';

export default function StudyPage() {
  const [active, setActive] = useState<Track['level']>('L1');
  const track = CURRICULUM.find((t) => t.level === active)!;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <SectionHeader
        title="부동산 학습 커리큘럼"
        subtitle="초보자 → 전문가 6단계 · 법률·세무·AI 활용까지"
        action={<Badge tone="accent">L1 ~ L6</Badge>}
      />

      {/* Level selector */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {CURRICULUM.map((t) => (
          <button
            key={t.level}
            onClick={() => setActive(t.level)}
            className={`rounded-xl p-3 text-left transition border ${
              active === t.level
                ? 'glass-strong border-[color:var(--accent)]/40 accent-glow'
                : 'glass border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{t.icon}</span>
              <span
                className={`text-xs font-bold ${
                  active === t.level ? 'text-[color:var(--accent)]' : 'text-[color:var(--text-muted)]'
                }`}
              >
                {t.level}
              </span>
            </div>
            <div className="font-semibold text-sm mt-2">{t.title}</div>
            <div className="text-[10px] text-[color:var(--text-muted)] flex items-center gap-1 mt-1">
              <Clock className="size-2.5" />
              {t.duration}
            </div>
          </button>
        ))}
      </div>

      {/* Track header */}
      <GlassCard>
        <div className="flex items-start gap-4">
          <div className="grid place-items-center size-14 rounded-2xl bg-gradient-to-br from-[color:var(--accent)] to-emerald-400 text-black text-3xl">
            {track.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs text-[color:var(--text-muted)]">
              <span className="font-bold text-[color:var(--accent)]">{track.level}</span>·
              <span>{track.duration}</span>·
              <span>{track.lessons.length}개 모듈</span>
            </div>
            <h2 className="text-xl font-semibold mt-1">{track.title}</h2>
            <p className="text-sm text-[color:var(--text-secondary)] mt-1">
              🎯 {track.goal}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Lessons */}
      <div className="grid md:grid-cols-2 gap-4">
        {track.lessons.map((l, i) => (
          <GlassCard key={l.id} className="hover:border-white/20 transition">
            <div className="flex items-start gap-3">
              <div className="grid place-items-center size-8 rounded-lg bg-white/5 border border-white/10 text-xs font-bold shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{l.title}</div>
                <p className="text-xs text-[color:var(--text-secondary)] mt-1.5 leading-relaxed">
                  {l.body}
                </p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {l.keywords.map((k) => (
                    <span
                      key={k}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[color:var(--text-secondary)]"
                    >
                      {k}
                    </span>
                  ))}
                </div>
                {l.resources && l.resources.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {l.resources.map((r) => (
                      <a
                        key={r.href}
                        href={r.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-xs text-[color:var(--accent)] hover:underline"
                      >
                        <ExternalLink className="size-3" />
                        {r.label}
                      </a>
                    ))}
                  </div>
                )}
                <button className="mt-3 inline-flex items-center gap-1 text-xs text-[color:var(--text-muted)] hover:text-white">
                  <CheckCircle2 className="size-3" />
                  완료 표시
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
