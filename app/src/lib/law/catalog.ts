/**
 * 14개 부동산 주제별 핵심 법령 카탈로그
 * 각 주제에서 자주 쓰는 법령·시행령·시행규칙·고시를 묶어 RAG 검색 시드로 사용.
 */

export type LawCategory =
  | 'market_research'      // 1. 시장·경제 리서치
  | 'redevelopment'        // 2. 재개발·재건축·리모델링·건물·지산
  | 'valuation'            // 3·4. 회계·감정평가·수지분석
  | 'auction'              // 5. 경매·공매 권리분석
  | 'subscription'         // 6. LH/SH/수자원공사 청약·분양
  | 'finance_regulation'   // 7. 대출·규제
  | 'urban_development'    // 8. 도시개발사업
  | 'farm_forest'          // 9. 농지·산지·스마트팜·연금·펜션
  | 'map_property'         // 10. 지도·매물·명도
  | 'news'                 // 11. 뉴스
  | 'voice_3d'             // 12. 음성·3D·타임라인
  | 'collaboration'        // 13. 전문가 협업
  | 'study';               // 14. 스터디 커리큘럼

export type LawSeed = {
  category: LawCategory;
  title: string;            // 주제 한글 제목
  description: string;
  laws: string[];           // 국가법령정보센터에서 검색할 법령명
  notes?: string;
};

export const LAW_CATALOG: LawSeed[] = [
  {
    category: 'market_research',
    title: '한국 부동산 시장·경제 리서치',
    description: 'KDI·한은·국토연구원·산업연구원 발간물 중 부동산·경제 정책 관련.',
    laws: [
      '주택법',
      '부동산 가격공시에 관한 법률',
      '부동산 거래신고 등에 관한 법률',
      '한국개발연구원법',
      '한국은행법',
    ],
  },
  {
    category: 'redevelopment',
    title: '재개발·재건축·리모델링·빌딩·지식산업센터',
    description: '정비사업, 소규모주택정비, 리모델링, 산업집적·지식산업센터 관련.',
    laws: [
      '도시 및 주거환경정비법',
      '빈집 및 소규모주택 정비에 관한 특례법',
      '주택법',
      '집합건물의 소유 및 관리에 관한 법률',
      '건축법',
      '산업집적활성화 및 공장설립에 관한 법률',
      '도시재정비 촉진을 위한 특별법',
    ],
  },
  {
    category: 'valuation',
    title: '회계·감정평가·수지분석 (종전·종후)',
    description: '감정평가, 부동산 가격공시, 회계 기준, 정비사업 종전·종후 평가 근거.',
    laws: [
      '감정평가 및 감정평가사에 관한 법률',
      '부동산 가격공시에 관한 법률',
      '도시 및 주거환경정비법',
      '주식회사 등의 외부감사에 관한 법률',
      '국세기본법',
      '소득세법',
      '법인세법',
      '지방세법',
    ],
  },
  {
    category: 'auction',
    title: '경매·공매·권리분석 (유치권·대항력·우선변제)',
    description: '경매·공매 절차, 임차인 보호, 유치권, 가등기담보, 명도.',
    laws: [
      '민사집행법',
      '주택임대차보호법',
      '상가건물 임대차보호법',
      '민법',
      '가등기담보 등에 관한 법률',
      '국세징수법',
      '지방세징수법',
      '부동산등기법',
      '집합건물의 소유 및 관리에 관한 법률',
    ],
  },
  {
    category: 'subscription',
    title: 'LH·SH·수자원공사 청약·택지·분양',
    description: '주택 청약, 공공주택, 택지개발, 분양가상한제.',
    laws: [
      '주택법',
      '주택공급에 관한 규칙',
      '공공주택 특별법',
      '택지개발촉진법',
      '한국토지주택공사법',
      '한국수자원공사법',
      '분양가상한제 적용주택의 분양가격 산정기준',
    ],
  },
  {
    category: 'finance_regulation',
    title: '대출 규제·주택 수·정책',
    description: 'LTV/DTI/DSR, 다주택자 규제, 부동산 정책 (국토부·기재부·금융위).',
    laws: [
      '주택법',
      '소득세법',
      '종합부동산세법',
      '지방세법',
      '주택도시기금법',
      '한국주택금융공사법',
      '은행법',
      '여신전문금융업법',
      '금융소비자 보호에 관한 법률',
      '농어촌정비법',
    ],
  },
  {
    category: 'urban_development',
    title: '도시개발사업 추진·인허가·환경/교통영향평가',
    description: '도시개발법, 환경영향평가, 교통영향평가, PF·자금조달, 사업비 회수.',
    laws: [
      '도시개발법',
      '국토의 계획 및 이용에 관한 법률',
      '환경영향평가법',
      '도시교통정비 촉진법',
      '도시 및 주거환경정비법',
      '공공주택 특별법',
      '산업입지 및 개발에 관한 법률',
      '물류시설의 개발 및 운영에 관한 법률',
    ],
  },
  {
    category: 'farm_forest',
    title: '농지법·산지법·개발행위·스마트팜·농지/산지연금·펜션·야영장',
    description: '농지·산지 전용, 개발행위허가, 농어촌숙박, 야영장, 농지연금.',
    laws: [
      '농지법',
      '산지관리법',
      '국토의 계획 및 이용에 관한 법률',
      '농어촌정비법',
      '농어촌민박사업 운영에 관한 규정',
      '관광진흥법',
      '한국농어촌공사 및 농지관리기금법',
      '산림자원의 조성 및 관리에 관한 법률',
      '스마트농업 육성 및 지원에 관한 법률',
    ],
  },
  {
    category: 'map_property',
    title: '지도·경공매 매물·명도',
    description: '주소·지적·공간정보, 명도(인도) 절차.',
    laws: [
      '공간정보의 구축 및 관리 등에 관한 법률',
      '국가공간정보 기본법',
      '도로명주소법',
      '민사집행법',
      '주택임대차보호법',
      '상가건물 임대차보호법',
    ],
  },
  {
    category: 'news',
    title: '뉴스 자동 수집·전송',
    description: '저작권, 통신비밀, 위치정보 (정보 수집/발송 합법성).',
    laws: [
      '저작권법',
      '신문 등의 진흥에 관한 법률',
      '정보통신망 이용촉진 및 정보보호 등에 관한 법률',
      '통신비밀보호법',
      '개인정보 보호법',
    ],
  },
  {
    category: 'voice_3d',
    title: '음성·3D·개인정보·생체인식',
    description: 'STT, 페이스타임형 영상, 생체정보 처리.',
    laws: [
      '개인정보 보호법',
      '정보통신망 이용촉진 및 정보보호 등에 관한 법률',
      '위치정보의 보호 및 이용 등에 관한 법률',
      '국가공간정보 기본법',
    ],
  },
  {
    category: 'collaboration',
    title: '전문가 협업 (감정평가사·법무사·세무사·변호사·공무원)',
    description: '각 사의 자격·업무범위·수임 한계.',
    laws: [
      '감정평가 및 감정평가사에 관한 법률',
      '변호사법',
      '법무사법',
      '세무사법',
      '공인회계사법',
      '공인중개사법',
      '국가공무원법',
      '지방공무원법',
    ],
  },
  {
    category: 'study',
    title: '부동산 스터디 커리큘럼 — 법률·세무·AI 활용',
    description: '초보자가 알아야 할 핵심 법령(거래·세금·임대차·중개)을 묶어 학습 트랙으로 활용.',
    laws: [
      '공인중개사법',
      '주택임대차보호법',
      '상가건물 임대차보호법',
      '부동산 거래신고 등에 관한 법률',
      '소득세법',
      '종합부동산세법',
      '지방세법',
      '주택법',
      '민법',
    ],
  },
];

export function categoriesIndex(): Array<{
  category: LawCategory;
  title: string;
  description: string;
  count: number;
}> {
  return LAW_CATALOG.map((c) => ({
    category: c.category,
    title: c.title,
    description: c.description,
    count: c.laws.length,
  }));
}

export function getCategory(category: LawCategory): LawSeed | undefined {
  return LAW_CATALOG.find((c) => c.category === category);
}
