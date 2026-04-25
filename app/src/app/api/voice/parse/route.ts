/**
 * 음성/텍스트 → 검색 인텐트 JSON
 * Claude Haiku 4.5 사용 (빠르고 저렴, 한국어 지명 인식 우수)
 *
 * 입력: { text: "강남구 아파트 최근 한 달 실거래가" }
 * 출력: { intent: "realestate", params: { sigunguCode: "11680", ym: "202503" }, route: "/realestate?sigunguCode=11680&ym=202503" }
 */
import { NextRequest } from 'next/server';
import { getAnthropic, MODELS } from '@/lib/anthropic/client';
import { SIDO } from '@/lib/geo/sigungu';

export const runtime = 'nodejs';
export const maxDuration = 30;

type ParsedIntent = {
  intent:
    | 'realestate'
    | 'onbid'
    | 'auction'
    | 'applyhome'
    | 'law'
    | 'map'
    | 'news'
    | 'policy'
    | 'calc'
    | 'study'
    | 'redev'
    | 'unknown';
  sigunguCode?: string;
  sigunguName?: string;
  ym?: string;
  keyword?: string;
  reasoning?: string;
};

const SIGUNGU_LIST = SIDO.flatMap((s) =>
  s.sigungu.map((g) => `${s.name} ${g.name}=${g.code}`)
).join(', ');

const SYSTEM_PROMPT = `너는 한국 부동산 음성 검색 인텐트 분류기다.
사용자 발화를 받아 어떤 페이지로 라우팅할지 + 어떤 파라미터를 추출할지 JSON만 반환하라.

가능한 intent:
- realestate (실거래가, 시세) — sigunguCode + ym 필요
- onbid (공매, 캠코) — keyword 가능
- auction (경매, 권리분석, PDF, 지지옥션)
- applyhome (청약, 분양, LH, SH)
- law (법령, 법률, 도정법, 임대차법)
- map (지도, GIS, 매물 보기)
- news (뉴스, 기사)
- policy (정책, 국토부, 기재부)
- calc (계산, 비례율, 수익률, 취득세, 종부세, 분담금)
- study (학습, 커리큘럼, 강의, 공부)
- redev (재개발, 재건축, 정비사업, 종합 수지)
- unknown (분류 불가)

시군구 코드 매핑 (LAWD_CD 5자리): ${SIGUNGU_LIST}

연월(ym)은 YYYYMM 형식. "최근 1개월/지난달" → 한 달 전, "이번 달" → 당월. 명시 없으면 생략.

응답 스키마(JSON만):
{
  "intent": "realestate|...",
  "sigunguCode": "11680",  // 선택
  "sigunguName": "강남구",  // 선택
  "ym": "202503",           // 선택
  "keyword": "재건축",       // 선택
  "reasoning": "한 줄"
}

JSON만 반환. 코드펜스도 사용 금지.`;

function buildRoute(p: ParsedIntent): string {
  const qs = new URLSearchParams();
  if (p.sigunguCode) qs.set('sigunguCode', p.sigunguCode);
  if (p.ym) qs.set('ym', p.ym);
  if (p.keyword) qs.set('q', p.keyword);
  const query = qs.toString();
  const suffix = query ? `?${query}` : '';
  switch (p.intent) {
    case 'realestate':
      return `/realestate${suffix}`;
    case 'onbid':
      return `/onbid${suffix}`;
    case 'auction':
      return '/auction';
    case 'applyhome':
      return `/applyhome${suffix}`;
    case 'law':
      return p.keyword ? `/law?q=${encodeURIComponent(p.keyword)}` : '/law';
    case 'map':
      return '/map';
    case 'news':
      return p.keyword ? `/news?q=${encodeURIComponent(p.keyword)}` : '/news';
    case 'policy':
      return p.keyword ? `/policy?q=${encodeURIComponent(p.keyword)}` : '/policy';
    case 'calc':
      return '/calc';
    case 'study':
      return '/study';
    case 'redev':
      return '/redev';
    default:
      return '/';
  }
}

export async function POST(req: NextRequest) {
  let body: { text?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'invalid json' }, { status: 400 });
  }
  const text = (body.text ?? '').trim();
  if (!text) return Response.json({ error: 'text required' }, { status: 400 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: 'ANTHROPIC_API_KEY 가 필요합니다.' }, { status: 500 });
  }

  try {
    const client = getAnthropic();
    const msg = await client.messages.create({
      model: MODELS.fast,
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: text }],
    });
    const block = msg.content.find((b) => b.type === 'text');
    if (!block || block.type !== 'text') {
      return Response.json({ error: 'empty LLM response' }, { status: 500 });
    }
    const raw = block.text.trim();
    const jsonText =
      raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/)?.[1] ??
      raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1);
    let parsed: ParsedIntent;
    try {
      parsed = JSON.parse(jsonText) as ParsedIntent;
    } catch {
      return Response.json({ error: 'JSON parse failed', raw }, { status: 500 });
    }
    const route = buildRoute(parsed);
    return Response.json({ ...parsed, route, original: text });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : 'error' },
      { status: 500 }
    );
  }
}
