/**
 * 환경변수 설정 상태 점검 — 어떤 API가 활성화됐는지 클라이언트에 알림.
 * 값은 절대 노출하지 않고 boolean만 반환.
 */
export const runtime = 'nodejs';

export function GET() {
  const e = process.env;
  return Response.json({
    keys: {
      anthropic: !!e.ANTHROPIC_API_KEY,
      data_go_kr: !!(e.DATA_GO_KR_KEY_ENCODED || e.DATA_GO_KR_KEY_DECODED),
      law_go_kr: !!e.LAW_GO_KR_OC,
      vworld: !!e.VWORLD_API_KEY,
      reb: !!e.REB_API_KEY,
      kakao_js: !!e.NEXT_PUBLIC_KAKAO_JS_KEY,
      kakao_rest: !!e.KAKAO_REST_KEY,
      naver: !!(e.NAVER_CLIENT_ID && e.NAVER_CLIENT_SECRET),
      telegram: !!e.TELEGRAM_BOT_TOKEN,
      database: !!e.DATABASE_URL,
      iros: !!e.IROS_API_KEY,
    },
  });
}
