/**
 * 사건번호 + 주소 + 기본정보 → 종합 권리·투자 분석 보고서 생성
 * Claude Sonnet 4.6 사용 (한국 부동산 도메인 + 시·도 도시계획 지식)
 *
 * 입력은 최소 정보만 받고, 나머지는 LLM 추론 + 사용자가 제공한 컨텍스트.
 * 시세·인근 매각 사례·도시기본계획·법령은 LLM의 한국 부동산 지식 활용.
 */
import { getAnthropic, MODELS } from './client';
import type { AuctionCaseReport } from '@/types/auction';

const SYSTEM_PROMPT = `너는 한국 경매·공매 권리분석 + 투자 컨설팅 전문가다.
사용자가 제공한 사건번호와 매물 정보로 다음 8개 섹션 종합 보고서를 JSON으로만 생성하라.

🔍 분석 원칙:
1. **권리분석**: 민사집행법·주택임대차보호법·상가임대차보호법 + 말소기준권리(근저당·압류·담보가등기·경매개시결정 중 최선순위) 적용
2. **시세 추정**: 한국 부동산원 시세, 광역시·구별 평균가, 입지 프리미엄(역세권·학군·재개발) 종합. ALG/디스코/밸류맵 같은 시세추정 서비스 결과를 가정.
3. **개발 규제**: 맹지·자연경관지구·사고지·급경사지·문화재보호구역·교육환경보호구역·공익용산지 등 중첩 규제 식별
4. **도시계획**: 해당 자치구의 도시기본계획·재정비촉진계획·신속통합기획·역세권 개발 등 최신 동향
5. **시나리오**: 단순보유·합필개발·재개발편입·개발불발 4가지 시나리오 + 예상 매도가·수익률·기간
6. **체크리스트**: 입찰 전 자치구청 방문(공원녹지과·도시계획과)·인접필지 확인·현장 임장·중복사건 확인 등

⚠️ 중요:
- 추측/생성한 정보에는 신뢰도(confidence)를 낮게(0.4~0.6) 설정
- 공식 데이터(공시지가·감정가·매각 회차)는 사용자 입력 그대로 사용, 임의 변경 금지
- 인근 매각 사례·시세는 "추정" 명시
- 모든 수치는 원 단위 (천원·만원 변환 금지)

응답 JSON 스키마는 다음과 같다 (필수 필드만 표기):
{
  "caseNumber": "...",
  "court": "...",
  "caseType": "강제경매|임의경매|형식경매",
  "address": "...",
  "area": { "m2": 0, "pyeong": 0 },
  "zoning": "...",
  "appraisalPrice": 0,
  "minimumBidPrice": 0,
  "bidDate": "YYYY.MM.DD",
  "appraisalRatioPct": 0,
  "recommendation": {
    "suggestedBid": 0, "suggestedBidVsAppraisalPct": 0, "suggestedBidVsMarketPct": 0,
    "grade": "A|A-|B+|B|C+|C|D",
    "summary": "한 문단 판정 (입지·규제·기회 종합)"
  },
  "basicInfo": {
    "landUse": "임야 | 제1종일반주거지역 | 자연경관지구",
    "shape": "부정형, 급경사",
    "roadAccess": "맹지 또는 도로 너비 m",
    "specialDesignation": "사고지(YYYY.MM.DD 지정)",
    "surroundings": "주변환경 한 줄",
    "publicLandPrice": 0,
    "appraisalUnitPrice": 0
  },
  "priceAnalysis": {
    "benchmarks": [{"label":"감정가|ALG시세|공시지가|입찰희망가|최저가","amount":0,"unitPriceMan":0,"vsBidPct":0}],
    "auctionRounds": [{"round":1,"date":"YYYY.MM.DD","price":0,"vsAppraisalPct":100,"result":"유찰|진행|낙찰"}],
    "nearbyCases": [{"label":"○○동 ○-○","areaM2":0,"appraisal":0,"sold":0,"ratePct":0}]
  },
  "rightsAndDividend": {
    "rights": [{"date":"YYYY.MM.DD","type":"근저당|가압류|...","holder":"...","amount":0,"treatment":"말소기준|말소|인수|미정"}],
    "cancellationBaseDate": "YYYY.MM.DD",
    "survivingRights": [],
    "dividend": [{"rank":1,"payee":"경매비용|채권자","expected":0,"remaining":0}],
    "isCleanTitle": true
  },
  "developmentRisks": {
    "items": [{"title":"맹지","severity":"치명적|높음|중간|낮음","detail":"건축법 §44 근거..."}],
    "overallVerdict": "종합 개발 가능 여부 한 문단"
  },
  "urbanPlanning": {
    "masterPlan": ["2040 ○○ 재창조 플랜 ...", "..."],
    "nearbyDevelopments": ["○○아파트 재건축 ...", "..."],
    "socInfra": ["교통: ...", "학군: ...", "자연: ...", "상업: ..."]
  },
  "riskOpportunity": {
    "risks": [{"title":"맹지 건축불가","detail":"..."}],
    "opportunities": [{"title":"서울 ○○구 입지","detail":"..."}]
  },
  "scenarios": [
    {"name":"A. 단순 보유 매도","condition":"...","expectedSale":"1.0~1.5억","roiPct":"47~120%","period":"5~10년"},
    {"name":"B. 인접 합필 후 개발","condition":"...","expectedSale":"...","roiPct":"...","period":"..."},
    {"name":"C. 재개발 편입","condition":"...","expectedSale":"...","roiPct":"...","period":"..."},
    {"name":"D. 개발 불발 (Worst)","condition":"...","expectedSale":"...","roiPct":"...","period":"..."}
  ],
  "acquisitionCost": {
    "bidPrice": 0, "acquisitionTax": 0, "registrationFee": 0, "evictionCost": 0, "total": 0
  },
  "checklist": ["○○구청 공원녹지과 방문 ...", "..."],
  "legalCitations": [{"law":"민사집행법","article":"제91조","quote":"..."}],
  "confidence": 0.7
}

JSON만 반환. 코드펜스(\\\`\\\`\\\`json)도 사용 금지.`;

export type CaseAnalysisInput = {
  caseNumber: string;
  court?: string;
  address: string;
  /** 사용자가 제공할 수 있는 추가 정보 — 모두 선택 */
  appraisalPrice?: number;
  minimumBidPrice?: number;
  bidDate?: string;
  areaM2?: number;
  zoning?: string;
  propertyType?: string;
  notes?: string; // 추가 컨텍스트 (사고지·점유자 정보 등)
};

export async function analyzeCaseNumber(
  input: CaseAnalysisInput,
  options?: { model?: keyof typeof MODELS }
): Promise<AuctionCaseReport> {
  const client = getAnthropic();

  const userPrompt = `다음 경매 매물에 대한 종합 권리·투자 분석 보고서를 생성해주세요.

[입력 정보]
- 사건번호: ${input.caseNumber}
- 관할 법원: ${input.court ?? '(미입력 — 사건번호로 추정)'}
- 소재지: ${input.address}
- 감정가: ${input.appraisalPrice ? `${input.appraisalPrice.toLocaleString()}원` : '(미입력)'}
- 최저가: ${input.minimumBidPrice ? `${input.minimumBidPrice.toLocaleString()}원` : '(미입력)'}
- 입찰일: ${input.bidDate ?? '(미입력)'}
- 면적: ${input.areaM2 ? `${input.areaM2}㎡` : '(미입력)'}
- 용도지역: ${input.zoning ?? '(미입력)'}
- 물건 종류: ${input.propertyType ?? '(미입력)'}
${input.notes ? `\n[추가 정보]\n${input.notes}` : ''}

해당 자치구의 2040 도시기본계획·재정비촉진계획·신속통합기획 등 최신 도시계획 동향을 반영하고,
유사 인근 매각 사례를 추정해 주세요. 모든 수치는 원 단위로, 신뢰도는 정직하게 표기해주세요.`;

  const message = await client.messages.create({
    model: MODELS[options?.model ?? 'balanced'],
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const block = message.content.find((b) => b.type === 'text');
  if (!block || block.type !== 'text') {
    throw new Error('Claude 응답에 텍스트 블록이 없습니다.');
  }

  const raw = block.text.trim();
  const jsonText = extractJson(raw);
  let parsed: AuctionCaseReport;
  try {
    parsed = JSON.parse(jsonText) as AuctionCaseReport;
  } catch {
    throw new Error(`JSON 파싱 실패: ${raw.slice(0, 200)}`);
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
