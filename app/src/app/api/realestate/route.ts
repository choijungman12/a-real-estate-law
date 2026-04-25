import { NextRequest } from 'next/server';
import { fetchAptTrades, fetchAptRents } from '@/lib/api/molit';
import { z } from 'zod';

const QuerySchema = z.object({
  type: z.enum(['trade', 'rent']).default('trade'),
  sigunguCode: z.string().regex(/^\d{5}$/),
  ym: z.string().regex(/^\d{6}$/),
  page: z.coerce.number().int().positive().default(1),
  rows: z.coerce.number().int().positive().max(1000).default(100),
});

export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = QuerySchema.safeParse(params);
  if (!parsed.success) {
    return Response.json(
      { error: 'invalid params', issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const { type, sigunguCode, ym, page, rows } = parsed.data;
  try {
    if (type === 'trade') {
      const result = await fetchAptTrades({
        sigunguCode,
        dealYearMonth: ym,
        page,
        rows,
      });
      return Response.json(result);
    } else {
      const result = await fetchAptRents({
        sigunguCode,
        dealYearMonth: ym,
        page,
        rows,
      });
      return Response.json(result);
    }
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : 'unknown error' },
      { status: 500 }
    );
  }
}
