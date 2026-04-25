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

export type AuctionAnalysis = {
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
