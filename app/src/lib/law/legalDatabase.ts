/**
 * 정비사업·토지보상 핵심 법령·판례·조례 7건
 * 출처: ref-cjm 의 legalDatabase
 * 용도: 권리분석·감정평가·동의서 화면에서 근거 인용
 */

export type LegalEntry = {
  id: string;
  category: '법률' | '조례' | '판례' | '지침';
  title: string;
  article: string;
  content: string;
  url?: string;
  relatedArticles?: string[];
  caseSummary?: string;
};

export const LEGAL_DATABASE: LegalEntry[] = [
  {
    id: 'l001',
    category: '법률',
    title: '도시 및 주거환경정비법 (도정법)',
    article: '제2조 (정의)',
    content:
      '"정비구역"이란 정비계획을 수립하거나 정비사업을 시행하기 위하여 지정·고시된 구역. "정비사업"은 정비기반시설을 정비하거나 주택 등 건축물을 개량/건설하는 사업: 가. 주거환경개선사업 / 나. 재개발사업 / 다. 재건축사업',
    url: 'https://www.law.go.kr/lsInfoP.do?lsiSeq=245699',
    relatedArticles: ['제3조', '제4조', '제8조'],
  },
  {
    id: 'l002',
    category: '법률',
    title: '도시 및 주거환경정비법',
    article: '제35조 (추진위원회의 구성)',
    content:
      '① 조합 설립 전 정비구역 지정·고시 후 위원장 포함 5명 이상 추진위원회 위원 과반수의 동의를 받아 추진위원회를 구성하여 시장·군수등의 승인을 받아야 한다.',
    url: 'https://www.law.go.kr/lsInfoP.do?lsiSeq=245699',
    relatedArticles: ['제38조', '제41조'],
  },
  {
    id: 'l003',
    category: '법률',
    title: '도시 및 주거환경정비법',
    article: '제38조 (조합의 설립인가)',
    content:
      '① 조합 설립 시 토지등소유자의 4분의 3 이상 및 토지면적의 2분의 1 이상의 토지소유자의 동의를 받아야 한다.',
    url: 'https://www.law.go.kr/lsInfoP.do?lsiSeq=245699',
    relatedArticles: ['제35조', '제44조'],
  },
  {
    id: 'l004',
    category: '조례',
    title: '서울특별시 도시 및 주거환경정비 조례',
    article: '제6조 (정비계획의 입안 — 주택정비형 재개발)',
    content:
      '주택정비형 재개발 입안 요건: 1) 노후·불량 건축물 60% 이상 / 2) 과소필지(90㎡ 미만) 40% 이상 / 3) 접도율(너비 4m 이상 도로) 40% 이하. (1·2·3 중 2개 이상 충족 시 입안 가능)',
    url: 'https://www.law.go.kr/ordinInfoP.do?ordinSeq=1562888',
    relatedArticles: ['도정법 제8조'],
  },
  {
    id: 'l005',
    category: '판례',
    title: '대법원 2019. 3. 14. 선고 2018두60980',
    article: '재개발 보상금 산정 — 개발이익 배제',
    content:
      '토지보상법 §70①의 공시지가 기준 보상은 해당 공익사업으로 인한 지가 변동 이전의 가격으로 보상해야 하므로, 사업인정 고시 이후 개발이익은 보상가에서 제외된다.',
    url: 'https://www.law.go.kr/precInfoP.do?precSeq=193027',
    caseSummary: '재개발 보상가 산정 시 사업으로 인한 개발이익은 포함되지 않음',
  },
  {
    id: 'l006',
    category: '판례',
    title: '대법원 2022. 7. 28. 선고 2019두62244',
    article: '재건축 초과이익 환수 — 법률유보 원칙',
    content:
      '재건축 초과이익 환수의 입법 목적은 개발이익의 사회 환원이므로, 부과처분은 엄격한 법률유보 원칙에 따라야 한다.',
    url: 'https://www.law.go.kr/',
    caseSummary: '재건축 초과이익 환수 제도의 합헌성 및 적용 범위',
  },
  {
    id: 'l007',
    category: '법률',
    title: '공익사업을 위한 토지 등의 취득 및 보상에 관한 법률 (토지보상법)',
    article: '제70조 (취득하는 토지의 보상)',
    content:
      '① 협의/재결로 취득하는 토지는 공시지가를 기준으로 보상하되, 공시기준일~가격시점의 이용계획·지가변동률(공익사업 영향 미포함 지역)·생산자물가상승률·위치·형상·환경·이용상황을 종합 고려한 적정가격으로 평가한다.',
    url: 'https://www.law.go.kr/lsInfoP.do?lsiSeq=246524',
    relatedArticles: ['제61조', '제77조', '제78조'],
  },
  {
    id: 'l008',
    category: '지침',
    title: '재개발·재건축 사업 표준 업무처리 절차',
    article: '추진위원회 → 조합 절차',
    content:
      '1. 정비구역 지정 고시 → 2. 추진위 동의서 (과반수) → 3. 추진위 구성 승인 → 4. 운영 → 5. 조합 설립 동의서 (3/4) → 6. 조합 설립 인가',
    url: '',
    relatedArticles: ['도정법 제35조', '도정법 제38조'],
  },
];

export function findLegal(keyword: string): LegalEntry[] {
  const k = keyword.toLowerCase();
  return LEGAL_DATABASE.filter(
    (l) =>
      l.title.toLowerCase().includes(k) ||
      l.article.toLowerCase().includes(k) ||
      l.content.toLowerCase().includes(k)
  );
}
