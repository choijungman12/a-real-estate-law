# 🔑 API 키 발급 완전 가이드

발급 우선순위순으로 정리. 각 항목 끝의 `→ .env.local` 박스를 그대로 `app/.env.local` 에 복사·붙여넣기 후 값만 채우면 됩니다.

소요시간: ⭐ 즉시 / ⏱ 1~2일 / 💳 결제 등록 필요 / 📋 사업자등록 필요

---

## 1. 🟢 ⭐ Anthropic Claude (필수 — PDF 권리분석·음성 인텐트)

**발급처**: https://console.anthropic.com

1. 회원가입 (Google 로그인 가능)
2. 좌측 **Settings → API Keys → Create Key**
3. Key 이름: `realestate-platform`
4. **Plans & Billing → 결제 수단 등록** + 월 한도 설정 (`$20~50` 시작 권장)
5. **Workspace Limits**: Daily limit `$5`, Monthly `$50` 권장

**주요 사용처**: `/auction` PDF 권리분석 (Sonnet 4.6), `/api/voice/parse` 음성 인텐트 (Haiku 4.5)

**예상 월 비용**: PDF 분석 50건 기준 약 $5~15

```env
# → app/.env.local
ANTHROPIC_API_KEY=sk-ant-api03-...
```

---

## 2. 🟢 ⭐ 공공데이터포털 (data.go.kr) — 통합 키 1개로 7개 API

**발급처**: https://www.data.go.kr

### 2-1. 회원가입 (1회만)
1. 우상단 **회원가입** → 개인 / 사업자 선택
2. 이메일 인증 후 로그인

### 2-2. 7개 API 활용신청 (각각 클릭, 자동승인)

| # | API | 활용신청 직링크 | env 매핑 |
|---|---|---|---|
| 1 | 국토부 아파트 매매 실거래가 | https://www.data.go.kr/data/15126469/openapi.do | DATA_GO_KR_KEY |
| 2 | 국토부 아파트 전월세 실거래가 | https://www.data.go.kr/data/15126474/openapi.do | DATA_GO_KR_KEY |
| 3 | 온비드 캠코공매물건 조회 | https://www.data.go.kr/data/15000851/openapi.do | DATA_GO_KR_KEY |
| 4 | 청약홈 분양정보 (한국부동산원) | https://www.data.go.kr/data/15098547/openapi.do | DATA_GO_KR_KEY |
| 5 | LH 분양임대공고 공급정보 | https://www.data.go.kr/data/15056765/openapi.do | DATA_GO_KR_KEY |
| 6 | LH 분양임대공고 상세정보 | https://www.data.go.kr/data/15057999/openapi.do | DATA_GO_KR_KEY |
| 7 | 건축HUB 건축물대장정보 | https://www.data.go.kr/data/15134735/openapi.do | DATA_GO_KR_KEY |

각 페이지에서 **활용신청** → 활용목적 한 줄 작성 → 시스템유형 **REST** → 신청 → 즉시 승인.

### 2-3. 키 확인
**마이페이지 → 데이터활용 → Open API → 인증키 발급현황**
- **일반 인증키 (Encoding)** 복사 → `DATA_GO_KR_KEY_ENCODED`
- **일반 인증키 (Decoding)** 복사 → `DATA_GO_KR_KEY_DECODED`

> ⚠️ 두 개를 모두 받아두세요. URL `searchParams` 자동 인코딩과 충돌 시 둘 중 하나가 작동합니다.

```env
# → app/.env.local
DATA_GO_KR_KEY_ENCODED=발급받은Encoding키
DATA_GO_KR_KEY_DECODED=발급받은Decoding키
```

---

## 3. 🟢 ⏱ 국가법령정보 (open.law.go.kr) — 1~2일 승인 → **이미 발급됨**

**발급처**: https://open.law.go.kr/LSO/main.do

✅ **이미 발급 완료**: `OC = realestate_ai_01` (이미 .env.local에 설정됨)

다른 OC가 필요한 경우:
1. 회원가입 → 마이페이지 → API 신청
2. **법령** 서비스 신청 → 1~2일 후 승인
3. **OC = 가입 시 이메일 ID 앞부분** (예: `12wjdaks@gmail.com` → `12wjdaks`)

```env
# → app/.env.local (이미 적용됨)
LAW_GO_KR_OC=realestate_ai_01
```

---

## 4. 🟢 ⭐ V월드 (vworld.kr) — 지적도·3D 빌딩·Geocoder

**발급처**: https://www.vworld.kr

1. 회원가입 (개인)
2. **오픈API → 인증키 관리 → 인증키 발급**
3. **사용 도메인 등록** (필수):
   - 개발: `localhost:3013`, `localhost:3000`
   - 운영: 실제 도메인 (예: `your-app.vercel.app`)
4. 발급된 키 복사 (사용유형: **모두 선택**)

```env
# → app/.env.local
VWORLD_API_KEY=발급받은키
NEXT_PUBLIC_VWORLD_API_KEY=동일한키  # 클라이언트 노출용 (지도 오버레이)
```

---

## 5. 🟢 ⭐ 카카오 디벨로퍼스 — 카카오맵

**발급처**: https://developers.kakao.com

1. 카카오 계정 로그인
2. **내 애플리케이션 → 애플리케이션 추가하기**
   - 앱 이름: `RealEstate`
   - 사업자명: 본인 이름 또는 회사명
3. 좌측 **앱 키** 메뉴:
   - **JavaScript 키** → `NEXT_PUBLIC_KAKAO_JS_KEY`
   - **REST API 키** → `KAKAO_REST_KEY`
4. 좌측 **플랫폼 → Web 플랫폼 등록** (필수):
   - `http://localhost:3013`
   - `http://localhost:3000`
   - 운영 도메인
5. 좌측 **제품 설정 → 카카오맵 → 활성화: ON**

```env
# → app/.env.local
NEXT_PUBLIC_KAKAO_JS_KEY=발급받은JS키
KAKAO_REST_KEY=발급받은REST키
```

**무료 한도**: 지도 SDK 일 30만건 / 좌표→주소 일 10만건 (충분)

---

## 6. 🟢 ⭐ 네이버 검색 API — 부동산 뉴스

**발급처**: https://developers.naver.com/apps/#/register

1. 네이버 로그인
2. **Application → 애플리케이션 등록**
   - 애플리케이션 이름: `RealEstate`
   - **사용 API → 검색** 체크 ✓
   - 환경: **Web** + 서비스 URL `http://localhost:3013` 입력
3. 등록 완료 → **내 애플리케이션** 진입
4. **Client ID** + **Client Secret** 복사

```env
# → app/.env.local
NAVER_CLIENT_ID=발급받은ID
NAVER_CLIENT_SECRET=발급받은Secret
```

**무료 한도**: 일 25,000회 (호출당 100건 → 일 2,500,000건 수집 가능)

---

## 7. 🟢 ⭐ 텔레그램 봇 — 자동 알림 (사업자등록 불필요)

**발급처**: 텔레그램 앱

1. 텔레그램 앱에서 **`@BotFather`** 검색 → 대화 시작
2. `/newbot` 입력
3. 봇 이름 입력 (예: `RealEstateAlert`)
4. 봇 username 입력 (예: `my_realestate_bot`, 끝이 `bot`이어야 함)
5. **HTTP API 토큰** 복사 → `TELEGRAM_BOT_TOKEN`
6. 본인 채팅 ID 확인:
   - `@userinfobot` 검색 → 대화 시작 → `/start`
   - 표시되는 **Id 숫자** 복사 → `TELEGRAM_CHAT_ID`
7. 만든 봇과 먼저 대화 시작 (`/start`)해야 봇이 메시지 보낼 수 있음

```env
# → app/.env.local
TELEGRAM_BOT_TOKEN=숫자:문자열
TELEGRAM_CHAT_ID=본인_숫자_id
```

**무료**, 사업자등록 불필요. cron으로 매일 09시 부동산 뉴스 다이제스트 자동 발송됨.

---

## 8. 🟡 ⏱ 한국부동산원 R-ONE 통계 (선택)

**발급처**: https://www.reb.or.kr/r-one/

1. 회원가입 → 로그인
2. 우상단 **Open API → 인증키 발급 신청**
3. 활용목적 작성 → 즉시 승인
4. 발급된 키 복사

```env
# → app/.env.local
REB_API_KEY=발급받은키
```

**용도**: 부동산 가격지수·시세 통계 (R-ONE)

---

## 9. 🟢 ⭐ Supabase (DB — 매물 시계열 누적용)

**발급처**: https://supabase.com/dashboard

1. GitHub 로그인 (가장 빠름)
2. **New Project** → Organization 선택
   - Name: `realestate`
   - Database Password: 강력한 비밀번호 (저장 필수, 잊으면 복구 불가)
   - Region: **Northeast Asia (Seoul) — ap-northeast-2**
   - Pricing Plan: **Free** (500MB·2GB egress)
3. 1~2분 대기 (프로젝트 생성)
4. 좌측 **Settings → Database → Connection string**
5. **Transaction pooler (port 6543) — Connection string (URI)** 복사
6. `[YOUR-PASSWORD]` 부분을 2번에서 만든 비밀번호로 교체

```env
# → app/.env.local
DATABASE_URL=postgresql://postgres.xxx:비밀번호@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres
```

**스키마 마이그레이션** (DB URL 입력 직후 1회만):
```bash
cd C:\Users\Pro\realestate-platform\app
pnpm exec drizzle-kit push
```
→ `onbid_snapshots`, `news_archive`, `analysis_cache` 3개 테이블 자동 생성

---

## 10. 🟡 💳 네이버 클라우드 Maps Geocoder (선택, 폴백용)

V월드만 발급해도 지오코딩 충분. NCP는 V월드 실패 시 폴백.

**발급처**: https://www.ncloud.com/product/applicationService/maps

1. 네이버 클라우드 가입 + **결제수단 등록** (월 무료 한도 내 무료)
2. 콘솔 → **Services → Maps → 이용신청**
3. **Maps → Geocoding/Reverse Geocoding** 서비스 신청
4. **마이페이지 → 인증키 관리 → 신규 API 인증키 생성**

```env
# → app/.env.local
NCP_API_KEY_ID=발급받은ID
NCP_API_KEY=발급받은Key
```

---

## 11. 📋 카카오톡 알림톡 (선택, 사업자만)

개인은 불가. 텔레그램 봇으로 대체 가능.

**중개사**: SOLAPI (https://solapi.com), Aligo (https://www.aligo.in), BizGo, NHN커머스
- 솔라피 가입 → **카카오 채널 연결** → **알림톡 템플릿 등록·승인** (1~2일) → API 키 발급
- 단가: 월 1~9,999건 시 13원/건

(사업자등록 후 진행 권장)

---

## 12. 🔵 자체 환경변수 (선택)

```env
# Vercel Cron 보안 (선택, Vercel cron은 헤더로 자동 인증)
CRON_SECRET=긴_랜덤_문자열_32자_이상

# 운영 도메인 배포 시 (Vercel)
# Vercel 환경변수에 위 모든 키를 다시 입력
```

---

## ✅ 최소 시작 체크리스트 (1시간 이내)

핵심 5개만 발급해도 거의 모든 기능 동작:

- [ ] 1️⃣ Anthropic API (PDF 권리분석)
- [ ] 2️⃣ data.go.kr (실거래가·온비드·청약·LH·건축물대장)
- [ ] 4️⃣ V월드 (지도·지오코더)
- [ ] 5️⃣ 카카오 디벨로퍼스 (지도)
- [ ] 7️⃣ 텔레그램 봇 (알림)

발급 후 `app/.env.local`에 입력 → `cd app && PORT=3013 pnpm dev` 재시작 → http://localhost:3013

## 📊 키 적용 확인 방법

1. 브라우저에서 http://localhost:3013 접속
2. 사이드바 어느 페이지든 진입
3. 상단 **노란색 "API 키 미설정" 배너가 사라지면** 정상 적용
4. 또는 `curl http://localhost:3013/api/health` → 모든 키가 `true`인지 확인

---

## 💰 월 예상 비용 (개인 사용 기준)

| 항목 | 무료 한도 | 초과 시 |
|---|---|---|
| Anthropic Claude | 없음 | PDF 분석 50건 ≈ $5~15 |
| data.go.kr (전체) | 일 1,000~10,000건 | 무료 (한도 증액 신청 가능) |
| V월드 | 무료 (회원가입만) | 상업용 별도 약관 |
| 카카오맵 | 일 30만건 | 0.1원/건 (2026.2~ 80% 할인 프로모션) |
| 네이버 검색 | 일 25,000회 | - |
| 텔레그램 | 무제한 무료 | - |
| Supabase | 500MB / 2GB egress | 월 $25 (Pro) |
| 국가법령 | 무료 | - |

**개인 시작 비용 ≈ 월 $5~20** (Anthropic 사용량에 따라).
