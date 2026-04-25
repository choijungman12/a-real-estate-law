/**
 * 정비사업 (재개발·재건축) 도메인 타입
 * 출처: ref-cjm (구기동 재개발 프로젝트) — 도시정비법·토지보상법 기반
 */

export type ProjectStage =
  | 'planning'
  | 'committee'
  | 'association'
  | 'implementation'
  | 'management'
  | 'construction'
  | 'completion';

export const STAGE_LABEL: Record<ProjectStage, string> = {
  planning: '정비계획 수립',
  committee: '추진위원회 승인',
  association: '조합 설립',
  implementation: '사업시행 인가',
  management: '관리처분 인가',
  construction: '착공·준공',
  completion: '이전고시·청산',
};

export type ConsentStatus = 'agreed' | 'opposed' | 'pending' | 'withdrawn';
export type OwnerType = 'land' | 'building' | 'both';

export type ZoningType =
  | 'exclusive_residential_1'
  | 'exclusive_residential_2'
  | 'general_residential_1'
  | 'general_residential_2'
  | 'general_residential_3'
  | 'semi_residential'
  | 'commercial_neighborhood'
  | 'commercial_general'
  | 'green_natural'
  | 'green_production';

export type BuildingStructure = 'wooden' | 'masonry' | 'steel' | 'rc' | 'src';

export interface AppraisalInput {
  landArea: number;
  publicLandPrice: number;
  locationFactor: number;
  individualFactor: number;
  zoning: ZoningType;
  buildingArea: number;
  buildingYear: number;
  buildingType: BuildingStructure;
  hasBusinessLoss: boolean;
  businessMonthlyRevenue?: number;
  tenantCount: number;
  isResident: boolean;
}

export interface AppraisalResult {
  landCompensation: number;
  buildingCompensation: number;
  businessLossCompensation: number;
  movingExpense: number;
  tenantCompensation: number;
  totalCompensation: number;
  breakdown: { label: string; amount: number; basis: string }[];
}

export interface FeasibilityInput {
  totalProjectCost: number;
  expectedSalePrice: number;
  totalSaleArea: number;
  totalBefore: number;
  memberCount: number;
  avgUnitArea: number;
  rentalIncome?: number;
  additionalCosts?: number;
}

export interface FeasibilityResult {
  proportionalRate: number;
  postAssetValue: number;
  totalSaleRevenue: number;
  netProfit: number;
  profitRate: number;
  averageAdditionalCost: number;
  breakEvenRate: number;
}

export interface Owner {
  id: string;
  name: string;
  ownerType: OwnerType;
  landArea: number;
  buildingArea: number;
  consentStatus: ConsentStatus;
  publicLandPrice: number;
  buildingAge: number;
}

export interface ProjectInfo {
  id: string;
  name: string;
  address: string;
  totalArea: number;
  lotCount: number;
  buildingCount: number;
  ownerCount: number;
  currentStage: ProjectStage;
  startDate: string;
  targetEndDate?: string;
  zoningTypes: ZoningType[];
  projectType: 'redevelopment' | 'reconstruction' | 'urban_development';
}
