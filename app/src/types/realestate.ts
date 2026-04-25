export type AptTradeRecord = {
  apartmentName: string;
  dealAmount: number;
  dealYear: number;
  dealMonth: number;
  dealDay: number;
  exclusiveArea: number;
  floor: number;
  buildYear: number;
  jibun: string;
  dong: string;
  sigunguCode: string;
  rgstDate?: string;
};

export type AptRentRecord = {
  apartmentName: string;
  deposit: number;
  monthlyRent: number;
  contractYear: number;
  contractMonth: number;
  contractDay: number;
  exclusiveArea: number;
  floor: number;
  buildYear: number;
  jibun: string;
  dong: string;
  sigunguCode: string;
  contractType?: string;
};

export type SigunguCode = {
  code: string;
  name: string;
  sido: string;
};
