/**
 * 정비사업 사업성 분석 (비례율·분담금·수익률)
 * 출처: ref-cjm 의 calculations.ts
 *
 * 비례율 = (종후자산가치 − 총사업비) / 종전자산가치 × 100
 * 분담금 = 조합원 분양가 − (종전자산 × 비례율)
 */
import type { FeasibilityInput, FeasibilityResult } from '@/types/redevelopment';

export function calculateFeasibility(input: FeasibilityInput): FeasibilityResult {
  const totalSaleRevenue = Math.round(input.expectedSalePrice * input.totalSaleArea);
  const rentalIncome = input.rentalIncome ?? 0;
  const additionalCosts = input.additionalCosts ?? 0;

  const postAssetValue = totalSaleRevenue + rentalIncome;
  const totalCost = input.totalProjectCost + additionalCosts;

  const proportionalRate =
    input.totalBefore > 0 ? ((postAssetValue - totalCost) / input.totalBefore) * 100 : 0;

  const netProfit = postAssetValue - totalCost;
  const profitRate = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

  const memberCount = input.memberCount > 0 ? input.memberCount : 1;
  const avgBeforeAsset = input.totalBefore / memberCount;
  const avgSalePrice = input.expectedSalePrice * input.avgUnitArea;
  const averageAdditionalCost = avgSalePrice - (avgBeforeAsset * proportionalRate) / 100;

  const requiredRevenue = totalCost + input.totalBefore - rentalIncome;
  const breakEvenRate = totalSaleRevenue > 0 ? (requiredRevenue / totalSaleRevenue) * 100 : 0;

  return {
    proportionalRate,
    postAssetValue,
    totalSaleRevenue,
    netProfit,
    profitRate,
    averageAdditionalCost,
    breakEvenRate,
  };
}

/** 개인 분담금 = (개인 종전자산 × 비례율) − 조합원 분양가 */
export function calculatePersonalShare(
  personalBeforeAsset: number,
  proportionalRate: number,
  memberSalePrice: number
): number {
  const adjustedAsset = personalBeforeAsset * (proportionalRate / 100);
  return memberSalePrice - adjustedAsset;
}

/** 동의율 (도정법 §35 추진위 과반수, §38 조합 3/4) */
export function calculateConsentRate(agreed: number, total: number): number {
  if (total === 0) return 0;
  return (agreed / total) * 100;
}

/** 노후·불량 건축물 비율 (도정법 시행령 별표 1, 20년+) */
export function calculateDecrepitRate(buildings: { buildingAge: number }[]): number {
  if (buildings.length === 0) return 0;
  const currentYear = new Date().getFullYear();
  const decrepit = buildings.filter((b) => currentYear - b.buildingAge >= 20).length;
  return (decrepit / buildings.length) * 100;
}

/** 과소필지 (서울시 조례 90m² 미만) */
export function isSmallLot(areaM2: number): boolean {
  return areaM2 < 90;
}
