/**
 * 일일 온비드 매물 스냅샷 적재
 * Vercel Cron 또는 수동 트리거로 호출
 *
 * 매일 1회 호출 시: 그날의 매물 N건을 onbid_snapshots에 누적 저장.
 * 같은 날·같은 매물은 unique 인덱스로 중복 방지.
 */
import { NextRequest } from 'next/server';
import { fetchOnbidItems } from '@/lib/api/onbid';
import { getDb, schema } from '@/lib/db/client';
import { detectSigunguFromAddress } from '@/lib/geo/sigungu';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  const isVercelCron = req.headers.get('x-vercel-cron') === '1';
  const expected = process.env.CRON_SECRET;
  if (!isVercelCron && expected && auth !== `Bearer ${expected}`) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return Response.json(
      {
        ok: false,
        error: 'DATABASE_URL 미설정 — Supabase 또는 Postgres URL을 .env.local에 추가하세요.',
      },
      { status: 500 }
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const collected: { items: number; pages: number; inserted: number; errors: string[] } = {
    items: 0,
    pages: 0,
    inserted: 0,
    errors: [],
  };

  // 5페이지 = ~150건
  for (let page = 1; page <= 5; page++) {
    try {
      const { items } = await fetchOnbidItems({ page, rows: 30 });
      if (items.length === 0) break;
      collected.items += items.length;
      collected.pages = page;

      const rows = items.map((it) => {
        const detected = detectSigunguFromAddress(it.cltrAddr);
        return {
          snapshotDate: today,
          cltrNo: it.cltrNo,
          pbctNo: it.pbctNo,
          cltrNm: it.cltrNm,
          cltrAddr: it.cltrAddr,
          sido: detected?.sidoName,
          sigunguName: detected?.sigunguName,
          sigunguCode: detected?.code,
          apprAmt: it.apprAmt,
          minBidPrc: it.minBidPrc,
          cltrSttsCd: it.cltrSttsCd,
          pbctBgngDtm: it.pbctBgngDtm,
          pbctEndDtm: it.pbctEndDtm,
          useLclsfNm: it.cltrUseLclsfNm,
          useMclsfNm: it.cltrUseMclsfNm,
        };
      });

      const inserted = await db
        .insert(schema.onbidSnapshots)
        .values(rows)
        .onConflictDoNothing()
        .returning({ id: schema.onbidSnapshots.id });
      collected.inserted += inserted.length;
    } catch (e) {
      collected.errors.push(
        `page ${page}: ${e instanceof Error ? e.message : 'unknown'}`
      );
    }
  }

  return Response.json({
    ok: true,
    date: today,
    ...collected,
  });
}
