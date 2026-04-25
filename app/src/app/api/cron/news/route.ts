/**
 * 일일 부동산 뉴스 자동 수집 + 텔레그램 발송 cron
 * Vercel Cron: vercel.json 의 schedule 에 등록
 *
 * 보안: CRON_SECRET 환경변수로 인증 (헤더 Authorization: Bearer xxx)
 *      Vercel cron은 자동으로 x-vercel-cron 헤더 추가
 */
import { NextRequest } from 'next/server';
import { searchNews } from '@/lib/api/naver-news';
import { sendTelegramMessage } from '@/lib/api/telegram';

export const runtime = 'nodejs';
export const maxDuration = 60;

const KEYWORDS = ['부동산', '재건축', '청약', 'LH', '경매', '금리', '주택공급'];

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  const isVercelCron = req.headers.get('x-vercel-cron') === '1';
  const expected = process.env.CRON_SECRET;
  if (!isVercelCron && expected && auth !== `Bearer ${expected}`) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

  const collected: { keyword: string; titles: string[] }[] = [];
  for (const k of KEYWORDS) {
    try {
      const r = await searchNews({ query: k, display: 5, sort: 'date' });
      collected.push({
        keyword: k,
        titles: r.items.map((i) => `• ${i.title}\n  ${i.link}`),
      });
    } catch (e) {
      collected.push({
        keyword: k,
        titles: [`(수집 실패: ${e instanceof Error ? e.message : 'error'})`],
      });
    }
  }

  const today = new Date().toLocaleDateString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const lines = [`📰 <b>${today} 부동산 뉴스 다이제스트</b>`, ''];
  for (const c of collected) {
    lines.push(`<b>[${c.keyword}]</b>`);
    lines.push(...c.titles);
    lines.push('');
  }
  const body = lines.join('\n').slice(0, 4000); // Telegram 메시지 한도

  let telegramResult: 'sent' | 'skipped' | 'error' = 'skipped';
  let telegramError: string | undefined;
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    try {
      await sendTelegramMessage(body);
      telegramResult = 'sent';
    } catch (e) {
      telegramResult = 'error';
      telegramError = e instanceof Error ? e.message : 'unknown';
    }
  }

  return Response.json({
    ok: true,
    collectedKeywords: collected.length,
    telegram: telegramResult,
    telegramError,
    preview: body.slice(0, 600),
  });
}
