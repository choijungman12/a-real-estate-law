import { NextRequest } from 'next/server';
import { searchLaws } from '@/lib/api/law';
import { z } from 'zod';

const QuerySchema = z.object({
  query: z.string().min(1),
  page: z.coerce.number().int().positive().default(1),
  display: z.coerce.number().int().positive().max(100).default(20),
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
    const items = await searchLaws(parsed.data);
    return Response.json({ items, total: items.length });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : 'unknown error' },
      { status: 500 }
    );
  }
}
