export type RightType =
  | '근저당'
  | '저당'
  | '가압류'
  | '압류'
  | '가처분'
  | '가등기'
  | '전세권'
  | '임차권'
  | '지상권'
  | '예고등기'
  | '경매개시결정등기';

export type Right = {
  type: RightType;
  date: string;
  amount?: number;
  holder: string;
  isCancellationBase?: boolean;
  willSurvive: boolean;
};

export type Tenant = {
  name: string;
  moveInDate: string;
  fixedDate?: string;
  deposit: number;
  monthlyRent?: number;
  hasOpposingPower: boolean;
  hasPriorityPayment: boolean;
};

export type AuctionCase = {
  caseNumber: string;
  court: string;
  address: {
    road?: string;
    jibun: string;
    sido: string;
    sigungu: string;
    dong: string;
  };
  propertyType:
    | '아파트'
    | '오피스텔'
    | '상가'
    | '토지'
    | '단독'
    | '공장'
    | '지식산업센터';
  area: { land?: number; building: number };
  appraisalPrice: number;
  minimumBid: number;
  bidDate: string;
  bidRound: number;
  rights: Right[];
  tenants: Tenant[];
  notices: string[];
};

/**
 * 사건번호 입력 → 자동 종합 권리·투자 분석 보고서
 * 사용자 샘플 (서울 광진구 광장동 372-11, 2024타경2542) 레이아웃 기준 8개 섹션
 */
export type AuctionCaseReport = {
  // ─── 헤더 ───────────────────────────
  caseNumber: string;
  court: string;
  caseType: string; // 강제경매 / 임의경매 / 형식경매
  address: string;
  area: { m2: number; pyeong: number };
  zoning: string;
  appraisalPrice: number;
  minimumBidPrice: number;
  bidDate: string;
  appraisalRatioPct: number; // 최저가 / 감정가 × 100

  // ─── 종합 판단 ───────────────────────
  recommendation: {
    suggestedBid: number;
    suggestedBidVsAppraisalPct: number;
    suggestedBidVsMarketPct: number;
    grade: 'A' | 'A-' | 'B+' | 'B' | 'C+' | 'C' | 'D'; // 투자 등급
    summary: string; // 한 문단 판정
  };

  // ─── 1. 물건 기본 분석 ──────────────
  basicInfo: {
    landUse: string;             // 지목/용도
    shape: string;               // 지형 (부정형·정형·급경사 등)
    roadAccess: string;          // 도로접면
    specialDesignation?: string; // 사고지·문화재 등 특수지정
    surroundings: string;        // 주변환경
    publicLandPrice: number;     // 공시지가 원/㎡
    appraisalUnitPrice: number;  // 감정평가액 원/㎡ (공시지가 대비 배수 계산용)
  };

  // ─── 2. 가격 분석 ──────────────────
  priceAnalysis: {
    benchmarks: {
      label: string;
      amount: number;
      unitPriceMan: number; // 평당 만원
      vsBidPct: number;     // 입찰희망가 대비
    }[];
    auctionRounds: {
      round: number;
      date: string;
      price: number;
      vsAppraisalPct: number;
      result: '유찰' | '진행' | '낙찰';
    }[];
    nearbyCases: {
      label: string;
      areaM2?: number;
      appraisal: number;
      sold: number;
      ratePct: number;
    }[];
  };

  // ─── 3. 권리·배당 ──────────────────
  rightsAndDividend: {
    rights: {
      date: string;
      type: string;
      holder: string;
      amount?: number;
      treatment: '말소기준' | '말소' | '인수' | '미정';
    }[];
    cancellationBaseDate?: string;
    survivingRights: string[]; // 인수 목록
    dividend: {
      rank: number;
      payee: string;
      expected: number;
      remaining: number;
    }[];
    isCleanTitle: boolean; // 인수사항 없음 여부
  };

  // ─── 4. 개발 가능성·규제 ────────────
  developmentRisks: {
    items: {
      title: string;
      severity: '치명적' | '높음' | '중간' | '낮음';
      detail: string;
    }[];
    overallVerdict: string; // 종합 개발 가능 여부
  };

  // ─── 5. 도시계획·SOC ───────────────
  urbanPlanning: {
    masterPlan: string[]; // 2040 도시기본계획 등 — 5~10 bullet
    nearbyDevelopments: string[];
    socInfra: string[]; // 교통·학군·자연·상업
  };

  // ─── 6. 리스크 vs 기회 ──────────────
  riskOpportunity: {
    risks: { title: string; detail: string }[];
    opportunities: { title: string; detail: string }[];
  };

  // ─── 7. 시나리오 ───────────────────
  scenarios: {
    name: string;
    condition: string;
    expectedSale: string;
    roiPct: string;
    period: string;
  }[];
  acquisitionCost: {
    bidPrice: number;
    acquisitionTax: number;
    registrationFee: number;
    evictionCost: number;
    total: number;
  };

  // ─── 8. 입찰 전 확인사항 ───────────
  checklist: string[];

  // 메타
  legalCitations: { law: string; article: string; quote: string }[];
  confidence: number;
  rawLLMOutput?: string;
};

export type AuctionAnalysis = {
  /** PDF에서 추출된 핵심 식별 정보 (인근 실거래가 자동 조회용) */
  caseSummary?: {
    caseNumber?: string;
    address?: string;        // 도로명 또는 지번 주소 — 시·군·구 추출에 사용
    propertyType?: string;
    appraisalAmount?: number;
    minimumBidPrice?: number;
    bidDate?: string;
  };
  cancellationBase?: { type: RightType; date: string; holder: string };
  survivingRights: Right[];
  extinguishedRights: Right[];
  tenantRisks: Array<{
    name: string;
    risk: string;
    estimatedBurden?: number;
  }>;
  warnings: string[];
  marketValue?: {
    estimated: number;
    sources: string[];
  };
  recommendedBid?: {
    conservative: number;
    neutral: number;
    aggressive: number;
  };
  legalCitations: Array<{ law: string; article: string; quote: string }>;
  discrepanciesWithSource: string[];
  confidence: number;
  rawLLMOutput?: string;
};
