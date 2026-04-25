import { cn } from '@/lib/utils/cn';
import type { ReactNode, HTMLAttributes } from 'react';

export function GlassCard({
  className,
  children,
  glow = false,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { glow?: boolean; children: ReactNode }) {
  return (
    <div
      className={cn(
        'glass rounded-2xl p-5 transition',
        glow && 'accent-glow',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  delta,
  hint,
  icon,
}: {
  label: string;
  value: string | number;
  delta?: { value: string; positive?: boolean };
  hint?: string;
  icon?: ReactNode;
}) {
  return (
    <GlassCard className="relative overflow-hidden">
      <div className="flex items-center justify-between text-xs text-[color:var(--text-muted)]">
        <span className="uppercase tracking-wider">{label}</span>
        {icon && <span className="opacity-70">{icon}</span>}
      </div>
      <div className="mt-3 flex items-end justify-between gap-2">
        <div className="text-3xl font-semibold tabular-nums">{value}</div>
        {delta && (
          <div
            className={cn(
              'rounded-full px-2 py-0.5 text-xs font-medium',
              delta.positive
                ? 'bg-[color:var(--accent-soft)] text-[color:var(--accent)]'
                : 'bg-red-500/10 text-red-400'
            )}
          >
            {delta.value}
          </div>
        )}
      </div>
      {hint && <div className="mt-1 text-xs text-[color:var(--text-muted)]">{hint}</div>}
    </GlassCard>
  );
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'accent' | 'warn' | 'danger';
}) {
  const tones = {
    neutral: 'bg-white/5 text-[color:var(--text-secondary)] border-white/10',
    accent: 'bg-[color:var(--accent-soft)] text-[color:var(--accent)] border-[color:var(--accent-soft)]',
    warn: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    danger: 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider',
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {subtitle && (
          <p className="text-sm text-[color:var(--text-secondary)] mt-0.5">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
