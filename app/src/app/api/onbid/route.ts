import { NextRequest } from 'next/server';
import { fetchOnbidItems } from '@/lib/api/onbid';
import { z } from 'zod';

const QuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  rows: z.coerce.number().int().positive().max(100).default(30),
  cltrSttsCd: z.string().optional(),
  pbctBgngYmd: z
    .string()
    .regex(/^\d{8}$/)
    .optional(),
  pbctEndYmd: z
    .string()
    .regex(/^\d{8}$/)
    .optional(),
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
  try {
    const data = await fetchOnbidItems(parsed.data);
    return Response.json(data);
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : 'unknown error' },
      { status: 500 }
    );
  }
}
