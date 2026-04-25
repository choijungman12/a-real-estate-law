/**
 * 분석 결과 캐시 — analysis_cache 테이블 활용
 * Claude API 비용 절감 + 응답 속도 개선
 *
 * 키: SHA-256(file binary) 또는 SHA-256(caseNumber + address + 핵심필드)
 * 값: 분석 JSON (model 분리 저장)
 */
import { createHash } from 'node:crypto';
import { eq, and } from 'drizzle-orm';
import { getDb, schema } from './client';

export function hashBuffer(buf: Buffer | Uint8Array): string {
  return createHash('sha256').update(buf).digest('hex');
}

export function hashString(s: string): string {
  return createHash('sha256').update(s, 'utf8').digest('hex');
}

export type CacheHit<T> = {
  hit: true;
  source: 'cache';
  createdAt: Date;
  analysis: T;
} | {
  hit: false;
  source: 'fresh';
};

export async function getCached<T>(
  fileHash: string,
  model: string
): Promise<CacheHit<T>> {
  const db = getDb();
  if (!db) return { hit: false, source: 'fresh' };
  try {
    const rows = await db
      .select()
      .from(schema.analysisCache)
      .where(
        and(
          eq(schema.analysisCache.fileHash, fileHash),
          eq(schema.analysisCache.model, model)
        )
      )
      .limit(1);
    if (rows.length === 0) return { hit: false, source: 'fresh' };
    const r = rows[0];
    return {
      hit: true,
      source: 'cache',
      createdAt: r.createdAt,
      analysis: r.analysisJson as T,
    };
  } catch {
    return { hit: false, source: 'fresh' };
  }
}

export async function putCache<T>(
  fileHash: string,
  model: string,
  analysis: T,
  meta?: { fileName?: string; sizeBytes?: number }
): Promise<void> {
  const db = getDb();
  if (!db) return;
  try {
    await db
      .insert(schema.analysisCache)
      .values({
        fileHash,
        model,
        fileName: meta?.fileName,
        sizeBytes: meta?.sizeBytes,
        analysisJson: analysis as Record<string, unknown>,
      })
      .onConflictDoNothing();
  } catch {
    /* 캐시 실패는 무시 (DB 다운 시 분석은 정상 반환) */
  }
}
