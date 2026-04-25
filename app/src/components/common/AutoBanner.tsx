'use client';

import { useHealth, type HealthKeys } from './useHealth';
import KeyMissingBanner, { type KeySpec } from './KeyMissingBanner';

const KEY_SPECS: Record<keyof HealthKeys, KeySpec> = {
  anthropic: {
    envVar: 'ANTHROPIC_API_KEY',
    label: 'Claude API (PDF 권리분석)',
    url: 'https://console.anthropic.com/settings/keys',
  },
  data_go_kr: {
    envVar: 'DATA_GO_KR_KEY_ENCODED',
    label: '공공데이터포털 통합 키 (실거래가·온비드·청약·LH·건축물대장)',
    url: 'https://www.data.go.kr/iim/api/selectAcountAuthMng.do',
    helper: '활용신청 후 마이페이지에서 인증키 복사',
  },
  law_go_kr: {
    envVar: 'LAW_GO_KR_OC',
    label: '국가법령정보 OC (이메일 ID 앞부분)',
    url: 'https://open.law.go.kr/LSO/main.do',
  },
  vworld: {
    envVar: 'VWORLD_API_KEY',
    label: 'V월드 (지적도·3D·Geocoder)',
    url: 'https://www.vworld.kr/dev/v4dv_apikey_s002.do',
  },
  reb: {
    envVar: 'REB_API_KEY',
    label: '한국부동산원 R-ONE 통계',
    url: 'https://www.reb.or.kr/r-one/portal/openapi/openApiIntroPage.do',
  },
  kakao_js: {
    envVar: 'NEXT_PUBLIC_KAKAO_JS_KEY',
    label: '카카오맵 JavaScript 키',
    url: 'https://developers.kakao.com/console/app',
    helper: 'Web 플랫폼에 http://localhost:3013 도메인 등록 필수',
  },
  kakao_rest: {
    envVar: 'KAKAO_REST_KEY',
    label: '카카오 REST 키 (서버용)',
    url: 'https://developers.kakao.com/console/app',
  },
  naver: {
    envVar: 'NAVER_CLIENT_ID',
    label: '네이버 검색 API (뉴스)',
    url: 'https://developers.naver.com/apps/#/register',
  },
  telegram: {
    envVar: 'TELEGRAM_BOT_TOKEN',
    label: '텔레그램 봇 (알림)',
    url: 'https://t.me/BotFather',
  },
  database: {
    envVar: 'DATABASE_URL',
    label: 'Supabase PostgreSQL (시계열·캐시)',
    url: 'https://supabase.com/dashboard/new',
    helper: 'Settings → Database → Transaction pooler URI',
  },
  iros: {
    envVar: 'IROS_API_KEY',
    label: '법원 등기정보광장 (선택, 권리분석 정확도 향상)',
    url: 'https://data.iros.go.kr/rp/oa/openOapiAppl.do',
  },
};

export default function AutoBanner({
  required,
  optional = [],
}: {
  required: (keyof HealthKeys)[];
  optional?: (keyof HealthKeys)[];
}) {
  const health = useHealth();
  if (!health) return null;
  const missingRequired = required.filter((k) => !health[k]).map((k) => KEY_SPECS[k]);
  const missingOptional = optional.filter((k) => !health[k]).map((k) => KEY_SPECS[k]);
  if (missingRequired.length === 0 && missingOptional.length === 0) return null;
  if (missingRequired.length === 0) {
    // optional only — softer notice
    return <KeyMissingBanner required={[]} optional={missingOptional} />;
  }
  return <KeyMissingBanner required={missingRequired} optional={missingOptional} />;
}
