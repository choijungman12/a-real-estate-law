import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatKRW(value: number): string {
  if (!Number.isFinite(value)) return '-';
  if (value >= 1_0000_0000) {
    const eok = Math.floor(value / 1_0000_0000);
    const man = Math.floor((value % 1_0000_0000) / 10_000);
    return man > 0 ? `${eok}억 ${man.toLocaleString()}만원` : `${eok}억`;
  }
  if (value >= 10_000) {
    return `${Math.floor(value / 10_000).toLocaleString()}만원`;
  }
  return `${value.toLocaleString()}원`;
}

export function formatArea(m2: number): string {
  const pyeong = m2 / 3.3058;
  return `${m2.toFixed(2)}㎡ (${pyeong.toFixed(1)}평)`;
}
