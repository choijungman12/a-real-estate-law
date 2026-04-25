import { NextRequest } from 'next/server';
import { analyzePdfBuffer } from '@/lib/anthropic/auction-analyzer';

export const runtime = 'nodejs';
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return Response.json({ error: 'multipart/form-data 필요' }, { status: 400 });
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return Response.json({ error: 'file 필드가 필요합니다.' }, { status: 400 });
  }
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    return Response.json({ error: 'PDF 파일만 허용됩니다.' }, { status: 400 });
  }
  if (file.size > 30 * 1024 * 1024) {
    return Response.json({ error: '30MB 이하만 허용됩니다.' }, { status: 400 });
  }

  const modelChoice = (formData.get('model') as string) || 'balanced';
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const analysis = await analyzePdfBuffer(buffer, {
      model: ['fast', 'balanced', 'smart'].includes(modelChoice)
        ? (modelChoice as 'fast' | 'balanced' | 'smart')
        : 'balanced',
    });
    return Response.json({ analysis, fileName: file.name, sizeBytes: file.size });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : 'unknown error' },
      { status: 500 }
    );
  }
}
