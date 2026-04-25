import { NextRequest } from 'next/server';
import { fetchAptCompetition, fetchAptModelDetail } from '@/lib/api/applyhome';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const pblancNo = req.nextUrl.searchParams.get('pblancNo') ?? undefined;
  const houseManageNo = req.nextUrl.searchParams.get('houseManageNo') ?? undefined;
  const includeModel = req.nextUrl.searchParams.get('model') === '1';
  if (!pblancNo && !houseManageNo) {
    return Response.json(
      { error: 'pblancNo 또는 houseManageNo 파라미터가 필요합니다.' },
      { status: 400 }
    );
  }
  try {
    const competition = await fetchAptCompetition({ pblancNo, houseManageNo });
    const model = includeModel
      ? await fetchAptModelDetail({ pblancNo, houseManageNo })
      : [];
    return Response.json({ competition, model });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : 'error' },
      { status: 500 }
    );
  }
}
