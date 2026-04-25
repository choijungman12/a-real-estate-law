# 한국 부동산 플랫폼

검증된 공식 OPEN API 11종 + 지지옥션 PDF 권리분석 (Claude Sonnet 4.6) 으로 구성된 부동산 종합 플랫폼.

## 디렉터리 구조

```
realestate-platform/
├── app/                       # Next.js 16 App Router 풀스택
│   ├── src/
│   │   ├── app/              # 페이지 + API routes
│   │   │   ├── api/          # /api/realestate, /api/onbid, /api/law, /api/auction-analysis 등
│   │   │   ├── realestate/   # 실거래가 검색 페이지
│   │   │   ├── onbid/        # 공매 페이지
│   │   │   ├── auction/      # 지지옥션 PDF 업로드 + 권리분석
│   │   │   ├── applyhome/    # 청약·분양
│   │   │   ├── law/          # 법령 검색
│   │   │   └── news/         # 부동산 뉴스
│   │   ├── lib/
│   │   │   ├── api/          # 공식 API 클라이언트 (molit, onbid, law, vworld, applyhome, lh, eais, naver-news, telegram)
│   │   │   ├── anthropic/    # Claude 클라이언트 + 권리분석기
│   │   │   └── utils/        # 포매터, cn
│   │   ├── components/
│   │   │   └── map/          # KakaoMap.tsx
│   │   └── types/            # AuctionCase, AptTradeRecord 등
│   └── .env.example          # 환경변수 템플릿
└── docs/
    ├── data-sources.md           # 11개 API 검증 보고서
    ├── auction-analysis-pipeline.md  # 지지옥션 PDF 분석 파이프라인 설계
    └── api-keys-setup.md         # API 키 발급 가이드
```

## 시작하기

```bash
cd app
cp .env.example .env.local   # 키 입력 (docs/api-keys-setup.md 참조)
pnpm install
pnpm dev                     # http://localhost:3000
```

## 사용된 공식 API

| 카테고리 | API | 발급 |
|---|---|---|
| 실거래가 | 국토부 OPEN API | data.go.kr |
| 공매 | 온비드 (KAMCO) | data.go.kr |
| 청약 | 청약홈 분양정보 | data.go.kr |
| 임대주택 | LH 분양임대공고 | data.go.kr |
| 건축물대장 | 건축HUB | data.go.kr |
| 법령 | 국가법령정보 | open.law.go.kr |
| 지도/지적/3D | V월드 | vworld.kr |
| 통계 | 한국부동산원 R-ONE | reb.or.kr |
| 지도 SDK | 카카오맵 | developers.kakao.com |
| 뉴스 | 네이버 검색 | developers.naver.com |
| 알림 | 텔레그램 봇 | @BotFather |
| AI | Claude (Sonnet 4.6 / Opus 4.7) | console.anthropic.com |

## 핵심 기능

### 1. 지지옥션 PDF 자동 권리분석 (`/auction`)
- 본인 계정으로 받은 지지옥션 매물 PDF를 업로드
- Claude가 네이티브 PDF 입력으로 직접 읽고 분석:
  - 말소기준권리 식별
  - 인수/소멸 권리 분류
  - 임차인 대항력·우선변제권·소액임차인 최우선변제 판단
  - 지지옥션 분석과의 차이점 표시
  - 법령 조문 인용
- ⚠️ 본인 분석 전용, 제3자 공유 금지

### 2. 실거래가 검색 (`/realestate`)
시군구코드 + 연월별 아파트 매매·전월세 조회

### 3. 공매 (`/onbid`)
온비드 OPEN API 실시간 캠코공매물건

### 4. 그 외
청약·법령·뉴스 검색, 카카오맵 표시 컴포넌트

## 다음 단계 (TODO)
- DB 연동 (Drizzle + Supabase) — 즐겨찾기·알림 저장
- 텔레그램 봇 입찰일 알림 cron
- V월드 3D 빌딩 뷰어
- 권리분석 결과 PDF 출력
- 다중 매물 비교
- 수지분석 시뮬레이터 (대출·세금·명도비)
