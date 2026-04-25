import { NextRequest } from 'next/server';
import { analyzeCaseNumber, type CaseAnalysisInput } from '@/lib/anthropic/case-analyzer';

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
  try {
    const report = await analyzeCaseNumber(body);
    return Response.json({ report });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : 'unknown error' },
      { status: 500 }
    );
  }
}
