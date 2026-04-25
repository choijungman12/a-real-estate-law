/**
 * 지지옥션 PDF → 권리분석·시장가치분석
 *
 * Claude API 네이티브 PDF 입력 사용 (Sonnet 4.6 기준).
 * 출력: AuctionAnalysis JSON.
 */
import { getAnthropic, MODELS } from './client';
import type { AuctionAnalysis } from '@/types/auction';

const SYSTEM_PROMPT = `너는 한국 부동산 경매 권리분석 전문가다. 사용자가 업로드한 지지옥션 매물 PDF를 읽고 다음을 산출하라:

1. **말소기준권리** 식별 — 최선순위 (근)저당, 압류, 담보가등기, 경매개시결정등기 중 가장 빠른 것.
2. **인수/소멸 권리 분류** — 말소기준권리보다 빠른 권리는 인수, 늦은 권리는 소멸.
3. **임차인 위험** — 대항력(전입일+점유), 우선변제권(확정일자), 소액임차인 최우선변제(주임법 시행령 한도)를 판단하고, 낙찰자 추가 부담 가능성을 추정.
4. **특이사항** — 매각물건명세서·현황조사서에서 유치권, 법정지상권, 위반건축물, NPL, 체납, 명도 난이도 단서 추출.
5. **지지옥션 분석과의 차이점** — PDF에 표기된 지지옥션 자체 분석과 너의 재분석 결과 간 불일치 항목 명시.
6. **법령 인용** — 결론마다 관련 법령 조문(정식 법령명: 「민사집행법」, 「주택임대차보호법」, 「상가건물 임대차보호법」, 「민법」 제320조(유치권), 「가등기담보 등에 관한 법률」 등) 인용.
7. **신뢰도 (0~1)** — PDF 정보 부족·모호한 부분 반영.

응답은 반드시 다음 JSON 스키마를 따른다:
{
  "caseSummary": {
    "caseNumber": "2025타경12345",
    "address": "서울특별시 강남구 도곡동 ...",
    "propertyType": "아파트|오피스텔|상가|토지|단독|공장",
    "appraisalAmount": 1500000000,
    "minimumBidPrice": 1050000000,
    "bidDate": "YYYY-MM-DD"
  },
  "cancellationBase": { "type": "...", "date": "YYYY-MM-DD", "holder": "..." },
  "survivingRights": [...],
  "extinguishedRights": [...],
  "tenantRisks": [{"name": "", "risk": "", "estimatedBurden": 0}],
  "warnings": ["..."],
  "legalCitations": [{"law": "주택임대차보호법", "article": "제3조의2", "quote": "..."}],
  "discrepanciesWithSource": ["..."],
  "confidence": 0.85
}

caseSummary.address 는 인근 실거래가 자동 조회에 사용되므로 시·군·구가 명확히 포함된 형태로 추출하라.

JSON만 반환하고 설명 텍스트는 넣지 마라. 코드펜스(\`\`\`json)도 사용하지 마라.`;

export async function analyzePdfBuffer(
  pdfBuffer: Buffer,
  options?: { model?: keyof typeof MODELS }
): Promise<AuctionAnalysis> {
  const client = getAnthropic();
  const base64 = pdfBuffer.toString('base64');

  const message = await client.messages.create({
    model: MODELS[options?.model ?? 'balanced'],
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: base64,
            },
          },
          {
            type: 'text',
            text: '위 지지옥션 매물 PDF를 권리분석·임차인분석·특이사항 추출하여 지정된 JSON 스키마로만 응답하라.',
          },
        ],
      },
    ],
  });

  const textBlock = message.content.find((b) => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('Claude 응답에 텍스트 블록이 없습니다.');
  }

  const raw = textBlock.text.trim();
  const jsonText = extractJson(raw);

  let parsed: AuctionAnalysis;
  try {
    parsed = JSON.parse(jsonText) as AuctionAnalysis;
  } catch {
    throw new Error(`Claude JSON 파싱 실패: ${raw.slice(0, 200)}`);
  }

  parsed.rawLLMOutput = raw;
  return parsed;
}

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenced) return fenced[1];
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start >= 0 && end > start) return text.slice(start, end + 1);
  return text;
}
