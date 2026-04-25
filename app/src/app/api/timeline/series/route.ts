/**
 * 매물 타임라인 시계열 데이터
 * 일별 신규 등록 건수 × 시·도 필터 (top 5)
 */
import { NextRequest } from 'next/server';
import { getDb, schema } from '@/lib/db/client';
import { sql } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const days = Math.min(90, Math.max(7, Number(req.nextUrl.searchParams.get('days') ?? '30')));
  const db = getDb();
  if (!db) {
    return Response.json({
      ok: false,
      error: 'DATABASE_URL 미설정. /api/cron/snapshot/onbid를 매일 호출해야 시계열이 누적됩니다.',
      series: [],
      sidoBreakdown: [],
    });
  }

  try {
    // 일별 카운트
    const series = await db.execute(sql`
      select
        snapshot_date::text as date,
        count(*)::int as count
      from ${schema.onbidSnapshots}
      where snapshot_date >= current_date - ${sql.raw(`interval '${days} days'`)}
      group by snapshot_date
      order by snapshot_date asc
    `);

    // 시·도별 누적 (top 5)
    const sido = await db.execute(sql`
      select
        coalesce(sido, '기타') as sido,
        count(*)::int as count
      from ${schema.onbidSnapshots}
      where snapshot_date >= current_date - ${sql.raw(`interval '${days} days'`)}
      group by sido
      order by count desc
      limit 10
    `);

    return Response.json({
      ok: true,
      days,
      series: series as unknown as { date: string; count: number }[],
      sidoBreakdown: sido as unknown as { sido: string; count: number }[],
    });
  } catch (e) {
    return Response.json(
      {
        ok: false,
        error: e instanceof Error ? e.message : 'error',
        hint: '마이그레이션 미실행일 수 있습니다. `pnpm exec drizzle-kit push` 실행하세요.',
      },
      { status: 500 }
    );
  }
}
