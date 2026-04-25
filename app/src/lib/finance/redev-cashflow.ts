/**
 * 정비사업 종합 수지분석 — 평형별 매출 + 지출 9개 카테고리
 * 출처: 사용자 제공 PDF "정비사업 수지분석 (구기동 138-1대 일원)" 양식
 *
 * 매출:
 *   - 평형별 조합원 분양 (전용면적/분양평형/세대수/평당단가)
 *   - 평형별 일반분양 (조합원 분양가의 80% → 일반은 시세)
 *   - 상가 분양 (층별)
 *   - 매출부가세 (~7%)
 *
 * 지출 (9개 카테고리, PDF 비율 기준):
 *   1. 공사비 (도급공사·인입·예술장식 등) ~59%
 *   2. 보상비 (현금청산·영업손실·주거이전비 등) ~4%
 *   3. 분양홍보 (광고·분양대행·SH·분양보증) ~2%
 *   4. 업무용역비 (설계·감리·PM·신탁·정비전문) ~10%
 *   5. 등기비용 (보존·이전) ~3%
 *   6. 운영비 (조합운영·총회) ~0%
 *   7. 부담금 (광역교통·학교용지·상하수도·인입) ~2%
 *   8. 제세공과금 (재산세·채권매입·매입부가세) ~1%
 *   9. 금융비용 (사업비대출·이주비·금융주선) ~15%
 *  + 사업관리비 (민원보상·하자보수·예비비) ~4%
 */

export type UnitTypeMix = {
  exclusiveType: number;     // 전용면적 (㎡)
  saleAreaPyeong: number;    // 분양평형 (평)
  households: number;        // 세대수
  unitPriceMan: number;      // 평당단가 (만원)
};

export type RedevCashflowInput = {
  // 사업 개요
  totalLandM2: number;          // 총 토지면적 (㎡)
  totalFloorM2: number;         // 지상 연면적 (㎡)
  basementFloorM2: number;      // 지하 연면적 (㎡)
  totalUnits: number;           // 총 세대수
  preAssetTotal: number;        // 종전자산 총평가 (원)
  preAssetMembers: number;      // 조합원 수

  // 매출 - 조합원 분양
  memberMix: UnitTypeMix[];     // 평형별 (단가는 일반의 80%)
  // 매출 - 일반분양
  generalMix: UnitTypeMix[];    // 평형별 일반 단가
  // 상가
  shopAreaPyeong: number;
  shopUnitPriceMan: number;
  // 부가세율
  vatRatePct: number;           // 7

  // 직접 공사비
  constructionUnitCostMan: number; // 평당 직접공사비 (만원) — 850
  // 금융 조건
  pfRatePct: number;            // 7
  pfMonths: number;             // 27
  pfPrincipal: number;          // 사업비 대출 원금 (원)
  movingLoanPrincipal: number;  // 이주비 대출 원금 (원)
  movingLoanMonths: number;     // 33
};

export type CategorySum = {
  key: string;
  label: string;
  amount: number;
  pct: number;
};

export type RedevCashflowResult = {
  // 매출
  memberSale: number;           // 조합원 분양 합계
  generalSale: number;          // 일반 분양 합계
  shopSale: number;             // 상가
  vat: number;                  // 매출부가세
  totalRevenue: number;         // 매출 합계 (PDF '수입 합계')

  // 지출 카테고리별
  costs: CategorySum[];
  totalCost: number;

  // 정비사업 핵심 지표
  proportionalRate: number;     // 비례율 (%)
  rightsValuePerMember: number; // 세대당 권리가액 (원)
  contributionPerMember: number; // 세대당 분담금 (원, +면 부담)
  netProfit: number;            // 매출 − 지출
};

function sumMix(mix: UnitTypeMix[]): { revenue: number; pyeong: number; units: number } {
  let rev = 0,
    pyeong = 0,
    units = 0;
  for (const m of mix) {
    const r = m.households * m.saleAreaPyeong * (m.unitPriceMan * 10_000);
    rev += r;
    pyeong += m.households * m.saleAreaPyeong;
    units += m.households;
  }
  return { revenue: rev, pyeong, units };
}

export function computeRedevCashflow(i: RedevCashflowInput): RedevCashflowResult {
  // ─── 매출 ────────────────────────────────
  const member = sumMix(i.memberMix);
  const general = sumMix(i.generalMix);
  const shopSale = i.shopAreaPyeong * i.shopUnitPriceMan * 10_000;
  const apartmentSale = member.revenue + general.revenue;
  const vat = (apartmentSale + shopSale) * (i.vatRatePct / 100);
  const totalRevenue = apartmentSale + shopSale + vat;

  // ─── 지출 ────────────────────────────────
  const totalFloorPyeong = i.totalFloorM2 / 3.3058;
  const basementFloorPyeong = i.basementFloorM2 / 3.3058;
  const totalLandPyeong = i.totalLandM2 / 3.3058;

  // 1. 공사비
  const aboveGroundConst =
    totalFloorPyeong * i.constructionUnitCostMan * 10_000;
  const undergroundConst =
    basementFloorPyeong * i.constructionUnitCostMan * 10_000;
  const inletCost = totalFloorPyeong * 50 * 10_000; // 평당 5만원 가정 (PDF)
  const artInstall = totalFloorPyeong * 7868 * 0.001; // 0.1% 추정 (PDF)
  const construction = aboveGroundConst + undergroundConst + inletCost + artInstall;

  // 2. 보상비 — 현금청산만 단순 추정 (미동의자 5%)
  const cashClearing = i.preAssetTotal * 0.05;

  // 3. 분양홍보
  const adCost = general.revenue * 0.008;
  const saleAgentFee = general.units * 7_000_000;
  const saleBondFee = totalRevenue * 0.7 * 0.0024;
  const promotion = adCost + saleAgentFee + saleBondFee + 240_000_000; // SH·운영 추정

  // 4. 업무용역비
  const designFee = totalFloorPyeong * 150 * 10_000;
  const supervisionFee = construction * 0.0093;
  const pmFee = totalRevenue * 0.025;
  const trustFee = totalRevenue * 0.01;
  const officeServices = designFee + supervisionFee + pmFee + trustFee + 200_000_000; // 기타

  // 5. 등기비용
  const registrationFee = (construction + officeServices) * 0.036;

  // 6. 운영비
  const opCost = 960_000_000;

  // 7. 부담금
  const transportFee = (totalFloorPyeong - basementFloorPyeong) * 7868 * 0.04 * 0.5;
  const schoolFee = general.revenue * 0.004;
  const waterFee = i.totalUnits * 1_100_000;
  const inputFacility = totalFloorPyeong * 30 * 10_000;
  const burdens = transportFee + schoolFee + waterFee + inputFacility;

  // 8. 제세공과금
  const propertyTax = i.preAssetTotal * 0.7 * 0.0048 * 2;
  const vatNonDeductible = construction * 0.02;
  const taxes = propertyTax + vatNonDeductible;

  // 9. 금융비용
  const pfInterest =
    i.pfPrincipal * (i.pfRatePct / 100) * (i.pfMonths / 12);
  const movingInterest =
    i.movingLoanPrincipal * (i.pfRatePct / 100) * (i.movingLoanMonths / 12);
  const pfArrangement = i.pfPrincipal * 0.01;
  const finance = pfInterest + movingInterest + pfArrangement;

  // 10. 사업관리비
  const civilCompensation = construction * 0.002;
  const moveInMgmt = i.totalUnits * 1_500_000;
  const defectReserve = construction * 0.009;
  const contingency = construction * 0.05;
  const projectMgmt = civilCompensation + moveInMgmt + defectReserve + contingency;

  const rawCosts: { key: string; label: string; amount: number }[] = [
    { key: 'construction', label: '공사비', amount: construction },
    { key: 'compensation', label: '보상비', amount: cashClearing },
    { key: 'promotion', label: '분양·홍보', amount: promotion },
    { key: 'services', label: '업무용역비', amount: officeServices },
    { key: 'registration', label: '등기비용', amount: registrationFee },
    { key: 'operation', label: '운영비', amount: opCost },
    { key: 'burdens', label: '각종 부담금', amount: burdens },
    { key: 'taxes', label: '제세공과금', amount: taxes },
    { key: 'finance', label: '금융비용', amount: finance },
    { key: 'mgmt', label: '사업관리비', amount: projectMgmt },
  ];

  const totalCost = rawCosts.reduce((a, b) => a + b.amount, 0);
  const costs: CategorySum[] = rawCosts.map((c) => ({
    ...c,
    pct: totalCost > 0 ? (c.amount / totalCost) * 100 : 0,
  }));

  // ─── 정비사업 지표 ──────────────────────────
  const postAssetMinusCost = totalRevenue - totalCost;
  const proportionalRate =
    i.preAssetTotal > 0 ? (postAssetMinusCost / i.preAssetTotal) * 100 : 0;
  const avgPreAsset = i.preAssetTotal / Math.max(1, i.preAssetMembers);
  const rightsValuePerMember = avgPreAsset * (proportionalRate / 100);
  // 평균 조합원 분양가
  const avgMemberSalePrice =
    member.units > 0 ? member.revenue / member.units : 0;
  const contributionPerMember = avgMemberSalePrice - rightsValuePerMember;
  const netProfit = totalRevenue - totalCost;

  return {
    memberSale: member.revenue,
    generalSale: general.revenue,
    shopSale,
    vat,
    totalRevenue,
    costs,
    totalCost,
    proportionalRate,
    rightsValuePerMember,
    contributionPerMember,
    netProfit,
  };
}

/** PDF 샘플(구기동) 기본값 */
export const REDEV_SAMPLE: RedevCashflowInput = {
  totalLandM2: 86_676,
  totalFloorM2: 173_698,
  basementFloorM2: 69_341,
  totalUnits: 1_302,
  preAssetTotal: 500_557_066_000,
  preAssetMembers: 456,
  memberMix: [
    { exclusiveType: 24, saleAreaPyeong: 34, households: 104, unitPriceMan: 3613 },
    { exclusiveType: 32, saleAreaPyeong: 41, households: 220, unitPriceMan: 3613 },
    { exclusiveType: 42, saleAreaPyeong: 54, households: 132, unitPriceMan: 3613 },
  ],
  generalMix: [
    { exclusiveType: 24, saleAreaPyeong: 34, households: 390, unitPriceMan: 4516 },
    { exclusiveType: 32, saleAreaPyeong: 41, households: 294, unitPriceMan: 4516 },
    { exclusiveType: 42, saleAreaPyeong: 54, households: 162, unitPriceMan: 4516 },
  ],
  shopAreaPyeong: 0,
  shopUnitPriceMan: 0,
  vatRatePct: 7,
  constructionUnitCostMan: 850,
  pfRatePct: 7,
  pfMonths: 27,
  pfPrincipal: 641_824_500_000,
  movingLoanPrincipal: 300_334_240_000,
  movingLoanMonths: 33,
};
