import { NextRequest } from 'next/server';
import { analyzeCaseNumber, type CaseAnalysisInput } from '@/lib/anthropic/case-analyzer';
import { getCached, putCache, hashString } from '@/lib/db/cache';
import type { AuctionCaseReport } from '@/types/auction';

export const runtime = 'nodejs';
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  let body: CaseAnalysisInput;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'invalid json' }, { status: 400 });
  }
  if (!body.caseNumber || !body.address) {
    return Response.json(
      { error: 'caseNumber와 address는 필수입니다.' },
      { status: 400 }
    );
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: 'ANTHROPIC_API_KEY 가 필요합니다.' },
      { status: 500 }
    );
  }
  // 캐시 키: 사건번호 + 주소 + 감정가·최저가·면적 (사건의 본질적 식별자)
  const cacheKey = hashString(
    [
      body.caseNumber,
      body.address,
      body.appraisalPrice ?? '',
      body.minimumBidPrice ?? '',
      body.areaM2 ?? '',
    ].join('|')
  );
  const model = 'case-balanced';

  if (req.nextUrl.searchParams.get('refresh') !== '1') {
    const cached = await getCached<AuctionCaseReport>(cacheKey, model);
    if (cached.hit) {
      return Response.json({
        report: cached.analysis,
        source: 'cache',
        cachedAt: cached.createdAt,
      });
    }
  }

  try {
    const report = await analyzeCaseNumber(body);
    await putCache(cacheKey, model, report, {
      fileName: body.caseNumber,
      sizeBytes: 0,
    });
    return Response.json({ report, source: 'fresh' });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : 'unknown error' },
      { status: 500 }
    );
  }
}
