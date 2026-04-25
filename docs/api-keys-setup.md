# API 키 발급 가이드

이 문서대로 키를 발급해서 `app/.env.local`에 입력하세요. 발급 자체는 사용자 본인 계정으로 진행.

---

## 1. 공공데이터포털 (data.go.kr) — 가장 많은 API의 통합 발급처

### 1-1. 회원가입
https://www.data.go.kr/ → 회원가입 (개인/사업자)

### 1-2. 활용신청 (각 API마다 별도 신청, 개발 단계는 자동 승인)
다음 7개 API를 각각 들어가서 "활용신청" 클릭, 트래픽 기본값(개발 1,000~10,000건/일)으로 신청:

| API | 신청 URL |
|---|---|
| 국토부 아파트 매매 실거래가 | https://www.data.go.kr/data/15126469/openapi.do |
| 국토부 아파트 전월세 실거래가 | https://www.data.go.kr/data/15126474/openapi.do |
| 온비드 캠코공매물건 조회 | https://www.data.go.kr/data/15000851/openapi.do |
| 청약홈 분양정보 | https://www.data.go.kr/data/15098547/openapi.do |
| LH 분양임대공고 공급정보 | https://www.data.go.kr/data/15056765/openapi.do |
| LH 분양임대공고 상세정보 | https://www.data.go.kr/data/15057999/openapi.do |
| 건축HUB 건축물대장 | https://www.data.go.kr/data/15134735/openapi.do |

### 1-3. 키 확인
마이페이지 → 인증키 발급현황. **일반 인증키(Encoding)** 와 **일반 인증키(Decoding)** 두 개 다 복사해 `.env.local`의 `DATA_GO_KR_KEY_ENCODED`, `DATA_GO_KR_KEY_DECODED`에 입력.

---

## 2. 국가법령정보센터 (open.law.go.kr)

1. https://open.law.go.kr/LSO/main.do → 회원가입
2. 마이페이지 → API 신청 → "법령" 서비스 신청 (1~2일 승인)
3. **OC 코드는 가입 시 이메일 ID의 앞부분** (예: `12wjdaks@gmail.com` → OC = `12wjdaks`)
4. `LAW_GO_KR_OC=12wjdaks`

---

## 3. V월드 (vworld.kr)

1. https://www.vworld.kr/ → 회원가입
2. 오픈API → **인증키 발급** → 사용 도메인 입력 (개발은 `localhost:3000`, 운영은 실제 도메인)
3. `VWORLD_API_KEY=` 에 입력

---

## 4. 카카오 디벨로퍼스 (developers.kakao.com)

1. https://developers.kakao.com/ → 카카오 계정 로그인
2. 내 애플리케이션 → 추가 → 앱 이름 `RealEstate`
3. **앱 키 → JavaScript 키** → `NEXT_PUBLIC_KAKAO_JS_KEY`
4. **앱 키 → REST API 키** → `KAKAO_REST_KEY`
5. **플랫폼 → Web 플랫폼 추가** → `http://localhost:3000` 등록 (필수)
6. **카카오맵 활성화**: 제품 설정 → 카카오맵 → ON

---

## 5. 네이버 검색 API (developers.naver.com)

1. https://developers.naver.com/main/ → 로그인
2. Application → 애플리케이션 등록 → 사용 API에 **검색** 체크
3. Client ID / Secret → `.env.local`

---

## 6. 텔레그램 봇

1. 텔레그램에서 `@BotFather` 검색 → `/newbot` → 봇 이름·username 입력
2. 받은 토큰 → `TELEGRAM_BOT_TOKEN`
3. 본인 텔레그램 채팅 ID 확인: `@userinfobot` 검색 → ID 복사 → `TELEGRAM_CHAT_ID`

---

## 7. Anthropic API

1. https://console.anthropic.com/ → 로그인 → API Keys → Create Key
2. `ANTHROPIC_API_KEY=sk-ant-...`
3. 결제 수단 등록 (월 한도 설정 권장: $20~$50 시작)

---

## 8. 한국부동산원 R-ONE

1. https://www.reb.or.kr/r-one/ → 회원가입
2. Open API 신청 → 인증키 발급
3. `REB_API_KEY=` 에 입력

---

## 9. DB (Supabase)

1. https://supabase.com/dashboard → 새 프로젝트 (무료 500MB)
2. Project Settings → Database → Connection string (URI) 복사
3. `DATABASE_URL=postgres://...`

---

## 발급 우선순위 (MVP에 꼭 필요한 것)

- ⭐ Anthropic (없으면 권리분석 불가)
- ⭐ 카카오 JS 키 (지도 표시 필수)
- ⭐ data.go.kr (실거래가·온비드)
- ⭐ V월드 (지적·3D)
- ⚪ 법령정보 (1~2일 걸리니 미리 신청)
- ⚪ 텔레그램 봇 (알림 단계에서 필요)
- ⚪ 네이버 (뉴스 수집 단계)
- ⚪ R-ONE, Supabase (확장 단계)
