/**
 * 부동산 학습 커리큘럼 — L1(기초) ~ L6(AI 활용)
 * 초보자도 따라갈 수 있도록 모듈별 핵심 키워드 + 학습 자원 + 다음 단계
 */

export type Lesson = {
  id: string;
  title: string;
  body: string;
  keywords: string[];
  resources?: { label: string; href: string }[];
};

export type Track = {
  level: 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6';
  title: string;
  goal: string;
  duration: string;
  icon: string;
  lessons: Lesson[];
};

export const CURRICULUM: Track[] = [
  {
    level: 'L1',
    title: '부동산 기초',
    goal: '문서를 스스로 읽고 해석할 수 있다',
    duration: '2~3주',
    icon: '📘',
    lessons: [
      {
        id: 'l1-1',
        title: '실거래가 vs 공시가격 vs 감정가',
        body: '세 가격의 정의·용도 차이. 매매·세금·대출 한도 산정에 각각 어디 쓰이는지.',
        keywords: ['국토부 실거래가', '공시가격(공시지가/주택공시가)', '감정평가액'],
        resources: [
          { label: '국토부 실거래가 공개시스템', href: 'https://rt.molit.go.kr/' },
          { label: '한국부동산원 R-ONE', href: 'https://www.reb.or.kr/r-one/' },
        ],
      },
      {
        id: 'l1-2',
        title: '토지이용계획확인서 읽기',
        body: '토지이음에서 발급. 용도지역·지구단위·건폐율·용적률·도시계획시설을 한 장에서 확인.',
        keywords: ['용도지역', '용도지구', '건폐율', '용적률'],
        resources: [{ label: '토지이음', href: 'https://www.eum.go.kr/' }],
      },
      {
        id: 'l1-3',
        title: '등기부등본 갑구·을구 읽기',
        body: '갑구=소유권 변동, 을구=소유권 외 권리(저당·전세권 등). 시간순서가 권리분석의 핵심.',
        keywords: ['갑구', '을구', '근저당', '가압류'],
      },
      {
        id: 'l1-4',
        title: '건축물대장 표제부·전유부',
        body: '건물 면적·용도·층수·사용승인일. 위반건축물 표시 확인 필수.',
        keywords: ['표제부', '전유부', '위반건축물'],
        resources: [{ label: '세움터 건축데이터 개방', href: 'https://open.eais.go.kr/' }],
      },
    ],
  },
  {
    level: 'L2',
    title: '거래·세무',
    goal: '취득~보유~양도 전 구간의 세금을 직접 계산한다',
    duration: '3~4주',
    icon: '💰',
    lessons: [
      {
        id: 'l2-1',
        title: '취득세 — 주택수·조정지역별 차등',
        body: '1주택 1~3% / 2주택 8% / 3주택+ 12% (조정지역). 농특세·지방교육세 합산.',
        keywords: ['지방세법', '조정대상지역', '주택수 산정'],
      },
      {
        id: 'l2-2',
        title: '보유세 — 재산세 + 종부세',
        body: '공시가격 기준. 1주택자 12억 공제, 다주택 9억 공제. 공정시장가액비율 적용.',
        keywords: ['재산세', '종부세', '공정시장가액비율'],
      },
      {
        id: 'l2-3',
        title: '양도소득세 — 비과세·중과·장기보유특별공제',
        body: '1세대1주택 12억 비과세. 다주택 중과 + 장기보유특별공제 6~30%.',
        keywords: ['1세대1주택', '중과세', '장기보유특별공제'],
      },
      {
        id: 'l2-4',
        title: 'LTV·DTI·DSR — 대출 한도',
        body: 'LTV(담보), DTI(소득 대비 원리금), DSR(모든 대출 합산). 규제지역·주택수별 차등.',
        keywords: ['LTV', 'DSR', 'KB시세'],
      },
    ],
  },
  {
    level: 'L3',
    title: '경공매·권리분석',
    goal: '낙찰 전 위험을 스스로 진단한다',
    duration: '4~6주',
    icon: '🔨',
    lessons: [
      {
        id: 'l3-1',
        title: '말소기준권리 식별',
        body: '근저당·압류·담보가등기·경매개시결정등기 중 가장 빠른 것. 그보다 먼저면 인수, 뒤면 소멸.',
        keywords: ['민사집행법', '말소기준권리', '인수/소멸'],
      },
      {
        id: 'l3-2',
        title: '임차인 대항력·우선변제권',
        body: '전입+점유=대항력. 전입+확정일자=우선변제권. 소액임차인은 최우선변제.',
        keywords: ['주택임대차보호법', '대항력', '우선변제'],
      },
      {
        id: 'l3-3',
        title: '유치권·법정지상권·예고등기',
        body: '함정 권리 3종. 매각물건명세서·현황조사서에서 단서를 찾아내는 법.',
        keywords: ['민법 320조', '유치권', '법정지상권'],
      },
      {
        id: 'l3-4',
        title: '명도(인도) 절차 + 대출',
        body: '잔금 → 인도명령 → 협의 → 강제집행. 경락잔금대출 최대 80%.',
        keywords: ['인도명령', '강제집행', '경락잔금대출'],
      },
    ],
  },
  {
    level: 'L4',
    title: '재건축·재개발·도시개발',
    goal: '정비사업 사업성·분담금을 직접 추정한다',
    duration: '6~8주',
    icon: '🏗️',
    lessons: [
      {
        id: 'l4-1',
        title: '정비구역 지정 → 조합 → 사업시행 → 관리처분',
        body: '도시정비법 8단계. 단계마다 다음 동의율·평가가 결정.',
        keywords: ['도시정비법', '동의율', '관리처분'],
      },
      {
        id: 'l4-2',
        title: '종전·종후 평가 + 비례율',
        body: '비례율 = 종후합계 / 종전합계. 100% 이상이면 사업성 양호.',
        keywords: ['종전평가', '종후평가', '비례율'],
      },
      {
        id: 'l4-3',
        title: '도시개발·PF 자금구조',
        body: '자기자본 ~20% + 브릿지 ~30% + 본PF ~50%. 분양으로 본PF 상환.',
        keywords: ['브릿지론', '본PF', 'ABS/ABCP'],
      },
      {
        id: 'l4-4',
        title: '환경·교통영향평가',
        body: '사업면적 기준 의무. 주민의견 청취·평가서 협의 절차.',
        keywords: ['환경영향평가법', '교통영향평가'],
      },
    ],
  },
  {
    level: 'L5',
    title: '농지·산지·개발',
    goal: '농어촌 개발의 모든 인허가를 안다',
    duration: '4~6주',
    icon: '🌾',
    lessons: [
      {
        id: 'l5-1',
        title: '농지전용 — 농지보전부담금',
        body: '공시지가 × 30% (㎡당 상한 5만원). 농업진흥구역은 전용 제한.',
        keywords: ['농지법 34조', '농업진흥구역', '농지보전부담금'],
      },
      {
        id: 'l5-2',
        title: '산지전용 — 대체산림자원조성비',
        body: '경사도·표고·인접 거리 심사. 보전산지 vs 준보전산지.',
        keywords: ['산지관리법', '대체산림자원조성비', '복구비 예치'],
      },
      {
        id: 'l5-3',
        title: '스마트팜 / 농어촌민박 / 야영장',
        body: '각 사업의 면적·시설·등록 요건. 청년창업농 자금 활용법.',
        keywords: ['스마트농업육성법', '농어촌정비법', '관광진흥법'],
      },
      {
        id: 'l5-4',
        title: '농지·산지연금',
        body: '65세+, 5년+ 보유. 매월 종신 또는 기간 수령.',
        keywords: ['농지연금', '산지연금', '한국농어촌공사'],
      },
    ],
  },
  {
    level: 'L6',
    title: 'AI 활용·미래가치',
    goal: 'AI로 권리분석·미래가치 예측을 자동화한다',
    duration: '4~6주',
    icon: '🤖',
    lessons: [
      {
        id: 'l6-1',
        title: 'PDF → JSON 권리분석 자동화',
        body: 'Claude 네이티브 PDF 입력 → 말소기준·임차인 위험·법령 인용을 JSON으로 받기.',
        keywords: ['Claude PDF input', 'RAG', '법령 RAG'],
      },
      {
        id: 'l6-2',
        title: '실거래가·시세지수로 시장가치 추정',
        body: '인근 12개월 거래 중간값 + 평형/층수/경과 보정 + R-ONE 지수.',
        keywords: ['median', '회귀', '계절성 보정'],
      },
      {
        id: 'l6-3',
        title: '뉴스 자동 수집·요약·알림',
        body: '네이버 검색 API → Gemini Flash-Lite 요약 → 텔레그램·카카오 알림톡.',
        keywords: ['크롤링 합법성', '저작권', '비즈메시지'],
      },
      {
        id: 'l6-4',
        title: '자율 에이전트로 매물 모니터링',
        body: '지정 키워드/지역에 매물 등록 시 자동 알림 + 권리분석 1차 자동 실행.',
        keywords: ['에이전트', 'cron', '워크플로우'],
      },
    ],
  },
];
