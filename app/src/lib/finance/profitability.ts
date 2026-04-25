/**
 * 부동산 수지분석 계산기 — 핵심 공식
 * 출처: 한국감정평가사협회 가이드, 도시정비법 시행령, 소득세법, 종부세법
 */

// ─── 정비사업 (재개발·재건축) ───────────────────────────────

export type RedevelopmentInput = {
  predevAppraisal: number;     // 종전 감정평가액 (개인)
  postdevAppraisal: number;    // 종후 감정평가액 (분양받는 새 아파트)
  totalPredev: number;         // 사업 전체 종전평가합계
  totalPostdev: number;        // 사업 전체 종후평가합계
};

export function computeRedevelopment(i: RedevelopmentInput) {
  const ratio = i.totalPredev > 0 ? i.totalPostdev / i.totalPredev : 0;
  const rights = i.predevAppraisal * ratio; // 권리가액
  const contribution = i.postdevAppraisal - rights; // (+ 분담금 / − 환급금)
  return {
    ratioPct: ratio * 100,
    rights,
    contribution,
    isContribution: contribution >= 0,
  };
}

// ─── 임대 수익률 ─────────────────────────────────────────

export type RentalInput = {
  purchasePrice: number;   // 매입가
  acquisitionCost: number; // 취득세·중개수수료 등
  loanAmount: number;
  loanRatePct: number;
  deposit: number;
  monthlyRent: number;
  monthlyExpenses: number; // 관리비·재산세 환산
};

export function computeRental(i: RentalInput) {
  const equity = i.purchasePrice + i.acquisitionCost - i.loanAmount - i.deposit;
  const monthlyInterest = (i.loanAmount * (i.loanRatePct / 100)) / 12;
  const monthlyNet = i.monthlyRent - i.monthlyExpenses - monthlyInterest;
  const yearlyNet = monthlyNet * 12;
  const grossYieldPct = i.purchasePrice > 0 ? (i.monthlyRent * 12) / i.purchasePrice * 100 : 0;
  const cashOnCashPct = equity > 0 ? (yearlyNet / equity) * 100 : 0;
  return {
    equity,
    monthlyInterest,
    monthlyNet,
    yearlyNet,
    grossYieldPct,
    cashOnCashPct,
  };
}

// ─── 취득세 (주택 단순 추정 — 정확값은 지방세법 별표) ───────

export type AcquisitionTaxInput = {
  price: number;
  isFirstHome: boolean;
  isAdjustedArea: boolean;     // 조정대상지역
  numHomes: 1 | 2 | 3;          // 취득 후 주택수
};

export function computeAcquisitionTax(i: AcquisitionTaxInput) {
  // ⚠️ 단순 추정 — 정확한 산정은 「지방세법」 별표 + 시·도 조례 확인.
  // 1주택 6~9억 구간은 실제 단계 누진(공시가격·전용면적별 세분화)이지만, 여기서는 선형 보간으로 근사.
  let ratePct: number;
  if (i.numHomes === 1) {
    if (i.price <= 6e8) ratePct = 1;
    else if (i.price <= 9e8) ratePct = 1 + ((i.price - 6e8) / 3e8) * 2;
    else ratePct = 3;
  } else if (i.numHomes === 2) {
    ratePct = i.isAdjustedArea ? 8 : 1;
  } else {
    ratePct = i.isAdjustedArea ? 12 : 8;
  }
  const tax = i.price * (ratePct / 100);
  // 농어촌특별세 + 지방교육세 합산 ~10% 추정 (전용면적·세율별 차등 미반영)
  const surtax = tax * 0.1;
  return { ratePct, tax, surtax, total: tax + surtax };
}

// ─── 종부세 (단순 추정) ───────────────────────────────────

export type ComprehensiveTaxInput = {
  publicAssessedValue: number; // 공시가격 합계
  numHomes: 1 | 2 | 3;
};

export function computeComprehensiveTax(i: ComprehensiveTaxInput) {
  // ⚠️ 단순 추정 — 「종부세법」 제8~9조 단계 누진(0.5~5%)을 평균값으로 근사.
  // 실제는 공정시장가액비율(60% 등) + 세부담상한 + 누진세율표 정밀 적용 필요.
  // 1주택자 12억(2024 개정), 다주택자 9억 기본공제 — 공시가격 합계 기준.
  const baseExemption = i.numHomes === 1 ? 12e8 : 9e8;
  const taxableBase = Math.max(0, i.publicAssessedValue - baseExemption);
  // 1주택 평균 1.2%, 다주택 평균 2.5% (구간별 0.5~5% 누진의 중앙값 근사)
  const rate = i.numHomes === 1 ? 0.012 : 0.025;
  return {
    taxableBase,
    estimatedTax: taxableBase * rate,
  };
}
