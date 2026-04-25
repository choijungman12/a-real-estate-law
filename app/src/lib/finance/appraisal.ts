/**
 * 보상감정평가 — 토지보상법 §70~79
 * 출처: ref-cjm 의 calculations.ts (검증 완료된 로직)
 */
import type {
  AppraisalInput,
  AppraisalResult,
  ZoningType,
  BuildingStructure,
} from '@/types/redevelopment';

export const ZONING_RULES: Record<
  ZoningType,
  { buildingCoverage: number; floorAreaRatio: number; label: string }
> = {
  exclusive_residential_1: { buildingCoverage: 50, floorAreaRatio: 100, label: '제1종전용주거지역' },
  exclusive_residential_2: { buildingCoverage: 40, floorAreaRatio: 150, label: '제2종전용주거지역' },
  general_residential_1: { buildingCoverage: 60, floorAreaRatio: 200, label: '제1종일반주거지역' },
  general_residential_2: { buildingCoverage: 60, floorAreaRatio: 250, label: '제2종일반주거지역' },
  general_residential_3: { buildingCoverage: 50, floorAreaRatio: 300, label: '제3종일반주거지역' },
  semi_residential: { buildingCoverage: 70, floorAreaRatio: 500, label: '준주거지역' },
  commercial_neighborhood: { buildingCoverage: 70, floorAreaRatio: 900, label: '근린상업지역' },
  commercial_general: { buildingCoverage: 80, floorAreaRatio: 1300, label: '일반상업지역' },
  green_natural: { buildingCoverage: 20, floorAreaRatio: 80, label: '자연녹지지역' },
  green_production: { buildingCoverage: 20, floorAreaRatio: 100, label: '생산녹지지역' },
};

const STRUCTURE_COST: Record<BuildingStructure, number> = {
  wooden: 500_000,
  masonry: 600_000,
  steel: 850_000,
  rc: 950_000,
  src: 1_150_000,
};

const USEFUL_LIFE: Record<BuildingStructure, number> = {
  wooden: 30,
  masonry: 40,
  steel: 40,
  rc: 50,
  src: 60,
};

export const STRUCTURE_LABEL: Record<BuildingStructure, string> = {
  wooden: '목조',
  masonry: '조적조',
  steel: '철골조',
  rc: '철근콘크리트조 (RC)',
  src: '철골철근콘크리트조 (SRC)',
};

/** 보상감정평가 (토지보상법 §70~79) */
export function calculateAppraisal(input: AppraisalInput): AppraisalResult {
  const currentYear = new Date().getFullYear();

  // 1. 토지: 공시지가 × 지역요인 × 개별요인 × 면적
  const landCompensation = Math.round(
    input.publicLandPrice * input.locationFactor * input.individualFactor * input.landArea
  );

  // 2. 건물: 재조달원가 × 잔존가치율 × 면적
  const rawCost = STRUCTURE_COST[input.buildingType];
  const life = USEFUL_LIFE[input.buildingType];
  const buildingAge = Math.max(0, currentYear - input.buildingYear);
  const remainingRatio = Math.max(0.1, 1 - (buildingAge / life) * 0.9);
  const buildingCompensation = Math.round(rawCost * remainingRatio * input.buildingArea);

  // 3. 영업손실 보상: 월 영업이익 × 4개월
  const businessLossCompensation =
    input.hasBusinessLoss && input.businessMonthlyRevenue
      ? Math.round(input.businessMonthlyRevenue * 4)
      : 0;

  // 4. 이주비 (시행규칙 §53·§54)
  let movingExpense = 0;
  if (input.isResident) {
    const settlement = Math.min(Math.max(buildingCompensation * 0.3, 6_000_000), 12_000_000);
    const householdMoving = 10_560_000; // 2개월분 가계지출비 추정
    movingExpense = Math.round(settlement + householdMoving);
  }

  // 5. 세입자 보상 (시행규칙 §54②)
  const tenantCompensation = Math.round(input.tenantCount * 21_120_000);

  const totalCompensation =
    landCompensation +
    buildingCompensation +
    businessLossCompensation +
    movingExpense +
    tenantCompensation;

  return {
    landCompensation,
    buildingCompensation,
    businessLossCompensation,
    movingExpense,
    tenantCompensation,
    totalCompensation,
    breakdown: [
      {
        label: '토지 보상액',
        amount: landCompensation,
        basis: `공시지가(${input.publicLandPrice.toLocaleString()}원/m²) × 지역요인(${input.locationFactor}) × 개별요인(${input.individualFactor}) × ${input.landArea}m²`,
      },
      {
        label: '건물 보상액',
        amount: buildingCompensation,
        basis: `재조달원가(${rawCost.toLocaleString()}원/m²) × 잔존가치율(${(remainingRatio * 100).toFixed(1)}%) × ${input.buildingArea}m²`,
      },
      {
        label: '영업손실 보상',
        amount: businessLossCompensation,
        basis: input.hasBusinessLoss
          ? `월 영업이익(${input.businessMonthlyRevenue?.toLocaleString()}원) × 4개월`
          : '해당 없음',
      },
      {
        label: '이주비 (이주정착금 + 주거이전비)',
        amount: movingExpense,
        basis: input.isResident ? '건물보상액 × 30% (한도 600~1,200만) + 가계지출비 2개월분' : '해당 없음',
      },
      {
        label: '세입자 보상',
        amount: tenantCompensation,
        basis: `세입자 ${input.tenantCount}가구 × (이주정착금 + 주거이전비)`,
      },
    ],
  };
}
