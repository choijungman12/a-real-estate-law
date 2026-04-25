# 한국 부동산 플랫폼 — 데이터 소스 검증 보고서

**작성일**: 2026-04-25
**검증 방식**: WebSearch로 공식 출처 확인 (서브에이전트 권한 차단으로 메인 스레드에서 직접 수집)
**원칙**: 추측 금지, 출처 URL 명시, 미확인 항목은 명시적으로 표기

---

## 0. TL;DR — 신호등 요약

| 카테고리 | 공식 OPEN API | 즉시 사용 가능 | MVP 권장 |
|---|---|---|---|
| 실거래가 (국토부) | ✅ | data.go.kr 가입 후 즉시 | ⭐ |
| 공매 (온비드) | ✅ | data.go.kr 가입 후 즉시 | ⭐ |
| 법령정보 | ✅ | 1~2일 승인 | ⭐ |
| V월드 (지도/지적/3D) | ✅ | 회원가입+인증키 | ⭐ |
| 부동산통계 (R-ONE) | ✅ | 회원가입+인증키 | ⭐ |
| 청약홈 (분양·경쟁률) | ✅ | data.go.kr 가입 후 즉시 | ⭐ |
| LH 분양/임대 | ✅ | data.go.kr 가입 후 즉시 | ⭐ |
| 건축물대장 (세움터) | ✅ | open.eais.go.kr / data.go.kr | ⭐ |
| 토지이음 (토지이용계획) | ⚠️ 부분 | 일부 항목만 OpenAPI | △ |
| 법원경매 | ❌ 공식 API 없음 | CODEF 등 유료 중개사 필요 | ✕ |
| 카카오맵 | ✅ | 즉시 | ⭐ |
| 네이버 지도 | ✅ | NCP 가입 | ⭐ |
| 카카오톡 알림톡 | ⚠️ | 사업자등록 필수 | △ |
| 텔레그램 봇 | ✅ | 즉시, 무료 | ⭐ |
| 네이버 뉴스 검색 | ✅ | 즉시 | ⭐ |
| Claude / OpenAI / Gemini | ✅ | API 키 발급 | ⭐ |

⭐ = MVP 1차 후보 / △ = 조건부 / ✕ = 사업적 결정 필요

---

## 1. 공공 OPEN API (부동산 핵심 데이터)

### 1-1. 국토교통부 실거래가
- **공식**: [국토교통부 실거래가 정보(API)](https://www.data.go.kr/dataset/3050988/openapi.do)
- **데이터셋 (각각 별도 API)**:
  - [아파트 매매](https://www.data.go.kr/data/15126469/openapi.do)
  - [아파트 전월세](https://www.data.go.kr/data/15126474/openapi.do)
  - [아파트 분양권 전매](https://www.data.go.kr/data/15126471/openapi.do)
  - [상업업무용 매매](https://www.data.go.kr/data/15126463/openapi.do)
  - [연립다세대 전월세](https://www.data.go.kr/data/15126473/openapi.do)
- **인증**: data.go.kr 인증키 (자동 승인)
- **호출 파라미터**: 법정동코드 5자리 + 계약 연월 6자리 (예: 종로구 11110, 201801)
- **포맷**: XML/JSON
- **공식 시스템**: [rt.molit.go.kr](https://rt.molit.go.kr/)

### 1-2. 온비드 공매 (한국자산관리공사)
- **공식**: [한국자산관리공사_온비드 캠코공매물건 조회](https://www.data.go.kr/data/15000851/openapi.do)
- **부가 API**: [온비드코드조회](https://www.data.go.kr/data/15000920/openapi.do?recommendDataYn=Y), [정부재산정보공개조회](https://www.data.go.kr/data/15000907/openapi.do?recommendDataYn=Y)
- **트래픽**: 개발계정 1,000건, 운영계정은 활용사례 등록 시 증액 가능
- **승인**: 자동

### 1-3. 국가법령정보 (법률·시행령·판례)
- **공식**: [open.law.go.kr](https://open.law.go.kr/LSO/main.do)
- **활용 가이드**: [API 가이드 목록](https://open.law.go.kr/LSO/openApi/guideList.do)
- **승인**: 신청 후 1~2일 내
- **부가**: 법령서비스 신청 시 시스템도 등 부가서비스 자동 활성화

### 1-4. V월드 (공간정보 종합)
- **공식**: [vworld.kr](https://www.vworld.kr/dev/v4dv_2ddataguide2_s001.do)
- **API 종류**:
  - [배경지도 1.0](https://www.vworld.kr/dev/v4dv_baseguide_s001.do)
  - [3D 데스크톱 API](https://www.vworld.kr/dev/v4dv_dhapiguide_s001.do)
  - [검색 2.0](https://vworld.kr/dev/v4dv_search2_s001.do)
  - [WMS/WFS 2.0](https://www.vworld.kr/dev/v4dv_wmsguide2_s001.do) — 지적도 폴리곤 GIS
  - [StaticMap](https://vworld.kr/dev/v4dv_static_s001.do)
- **인증**: 회원가입 후 [오픈API → 인증키 발급]
- **상업용 라이선스**: 검색결과로 확정 불가 — **발급 페이지 약관 직접 확인 필요**
- **샘플 코드**: [V-world GitHub](https://github.com/V-world/V-world_API_sample)

### 1-5. 한국부동산원 R-ONE (시세·통계)
- **공식**: [Open API 소개](https://www.reb.or.kr/r-one/portal/openapi/openApiIntroPage.do), [개발가이드](https://www.reb.or.kr/r-one/portal/openapi/openApiDevPage.do)
- **엔드포인트**: `https://www.reb.or.kr/r-one/openapi/`
- **방식**: REST (GET/POST), HTTP/JSON·XML
- **인증키**: 미입력 시 sample 처리 (10건만 응답)

### 1-6. 청약홈 (분양·청약 경쟁률)
- **공식**: [청약홈 분양정보 조회](https://www.data.go.kr/data/15098547/openapi.do)
- **부가 API**:
  - [청약접수 경쟁률 및 특별공급](https://www.data.go.kr/data/15098905/openapi.do)
  - [청약 신청·당첨자 정보](https://www.data.go.kr/data/15110812/openapi.do)
- **데이터 범위**: APT(민간사전청약·신혼희망타운 포함), 오피스텔, 도시형, 민간임대, 생활숙박시설, 무순위, 잔여세대
- **명세**: Swagger UI (Edge/Chrome/Safari/Whale)

### 1-7. LH 분양·임대 공고
- **공식 카탈로그**: [LH 공공데이터 개방목록](https://www.lh.or.kr/menu.es?mid=a10110020000)
- **주요 API**:
  - [공공임대주택 단지정보](https://www.data.go.kr/data/15058476/openapi.do)
  - [임대주택단지](https://www.data.go.kr/data/15059475/openapi.do)
  - [분양임대공고별 공급정보](https://www.data.go.kr/data/15056765/openapi.do)
  - [분양임대공고별 상세정보](https://www.data.go.kr/data/15057999/openapi.do)
  - [분양임대공고문](https://www.data.go.kr/data/15058530/openapi.do)
  - [청약센터 공지사항](https://www.data.go.kr/data/15058222/openapi.do?recommendDataYn=Y)
  - [입찰공고정보](https://www.data.go.kr/data/15021183/openapi.do)
- **청약 사이트**: [LH청약플러스](https://apply.lh.or.kr/)

### 1-8. 건축물대장 (세움터/EAIS)
- **공식 개방 시스템**: [건축데이터 민간개방 (open.eais.go.kr)](https://open.eais.go.kr/)
- **신규 API**: [건축HUB 건축물대장정보 서비스](https://www.data.go.kr/data/15134735/openapi.do)
- **건축HUB OPEN API**: [hub.go.kr](https://www.hub.go.kr/portal/psg/idx-intro-openApi.do)
- **데이터 항목**: 표제부, 총괄/층별 개요, 부속지번, 전유공용면적, 오수처리, 주택가격, 지역지구

### 1-9. 토지이음 (토지이용계획확인서)
- **공식**: [eum.go.kr](https://eum.go.kr/), [데이터개방 목록](https://www.eum.go.kr/web/op/sv/svItemList.jsp)
- **주의**: 검색결과상 "토지정보 API는 vworld.kr로 이관" 언급 — V월드 내 토지 API 우선 확인
- **고시목록 데이터**: [토지이음 고시목록](https://www.data.go.kr/data/15083101/fileData.do?recommendDataYn=Y) (파일)
- **택지정보 OpenAPI**: [openapi.jigu.go.kr](https://openapi.jigu.go.kr/)

### 1-10. 농지·산지 (개발행위 / 농지·산지전용)
- **농림축산식품 공공데이터 포털**: [data.mafra.go.kr](https://data.mafra.go.kr/) — [오픈API 안내](https://data.mafra.go.kr/apply/indexApiPrcuseReqst.do)
- **농지정보도(WMS/WFS)**: [국토부 농지정보도](https://www.data.go.kr/data/15058006/openapi.do)
- **농촌진흥청 / 농사로**: [농사로 OpenAPI](https://www.nongsaro.go.kr/portal/ps/psz/psza/contentMain.ps?menuId=PS00191)
- **산림청**: [산림청 공공데이터 개방목록](https://forest.go.kr/kfsweb/opda/dataMng/selectPblicDataList.do?mn=NKFS_06_08_02)
- **AgriX**: [농림사업정보시스템 OpenAPI](https://uni.agrix.go.kr/webportal/openapi/portalAgrixOpenApi.do)

### 1-11. 법원경매 — ✅ 사용자 보유 자료 활용 전략 (확정)
- **공식 사이트**: [courtauction.go.kr](https://www.courtauction.go.kr/) — OPEN API 미제공
- **확정 전략**: 사용자가 **지지옥션 유료회원**으로 보유한 매물 PDF/텍스트를 업로드 → 자체 파이프라인으로 권리분석·시장가치 재분석
- **상세 설계**: [auction-analysis-pipeline.md](./auction-analysis-pipeline.md) 참조
- **법적 제약**: 지지옥션 자료는 **사용자 본인 분석용으로만 사용**, 제3자 재배포·공유 기능 미제공 (유료회원 약관 준수)
- **부가 데이터**: [법원 등기정보광장 OPEN API](https://data.iros.go.kr/rp/oa/openOapiIntro.do) — 등기 보강용으로 활용
- **참고 (선택)**: [CODEF 법원경매 API](https://developer.codef.io/products/public/each/ck/auction-events) — 사용 안 함 (지지옥션으로 충당)

### 1-12. 등기부등본
- **공식**: [법원 등기정보광장 OPEN API](https://data.iros.go.kr/rp/oa/openOapiIntro.do)
- **민간 중개**: [CODEF — 부동산 등기부등본](https://codef.io/service)

---

## 2. 지도 API

### 2-1. 카카오맵
- **공식 문서**: [Kakao Developers — 시작하기](https://developers.kakao.com/docs/latest/ko/kakaomap/common), [쿼터 안내](https://developers.kakao.com/docs/latest/ko/getting-started/quota)
- **무료 한도**:
  - 전체 API 합산: 일 300만건
  - 카카오맵(지도 SDK): 일 30만건
  - 좌표→주소 변환: 일 10만건
- **초과 요금**: 지도 0.1원/건, 좌표→주소 0.5원/건
- **2026년 한정 프로모션**: 검색결과에 "2026.2.2~12.31 80% 할인" 언급(수치 모순 있어 [공식 공지](https://developers.kakao.com/docs/latest/ko/getting-started/quota) 직접 확인 필요)
- **관련 공지**: [API 활성화·추가쿼터 기능](https://devtalk.kakao.com/t/topic/149092)

### 2-2. 네이버 지도 (NCP Maps)
- **공식**: [NCP Maps 상품](https://www.ncloud.com/product/applicationService/maps), [API 가이드](https://api.ncloud-docs.com/docs/application-maps-overview)
- **무료**: **대표계정 1개**에 한해 API별 월 3,000~1억 건
- **Geocoding**: 월 300만건 무료
- **JS SDK**: [navermaps.github.io](https://navermaps.github.io/maps.js.ncp/docs/module-geocoder.html)
- **요금 변경 이력**: [2023.1~ 사전 안내](https://www.ncloud-forums.com/topic/99/) — 가격 자주 바뀌므로 결제 전 [요금표](https://www.ncloud.com/charge/region) 직접 확인

### 2-3. V월드 (3D + 지적)
- 위 1-4 참조. 카카오/네이버에 없는 **3D 빌딩, 지적도 폴리곤**이 핵심 차별점.

### 2-4. 매물 클러스터링·3D 추천 조합
- 매물 핀(수만~수십만개) 클러스터링: **카카오맵 marker.clusterer** 또는 **네이버 MarkerClustering** 라이브러리 (무료 한도 가장 넉넉한 게 카카오)
- 3D 빌딩 표시: **V월드 3D 데스크톱 API**가 사실상 유일한 무료 옵션 (Cesium·Mapbox는 별도 라이선스)

---

## 3. 메시징 / 알림

### 3-1. 카카오톡 알림톡 (비즈메시지)
- **사업자등록 필수**: 법인 또는 개인사업자만 사용 가능
- **딜러사를 통한 발송** (직접 접근 불가):
  - [SOLAPI](https://solapi.com/pricing) — 알림톡 가이드: [solapi.com/guides/kakao-ata-guide](https://solapi.com/guides/kakao-ata-guide)
  - [BIZTALK](https://www.biztalk.co.kr/newhome/0301_alrim.html), [BIZGO](https://blog.bizgo.io/howto/how-to-send-alimtalk/), [NHN커머스](https://www.nhn-commerce.com/echost/power/add/member/kakao-intro.gd), [엠앤와이즈](https://mnwise.com/sub/sub03_02_01_01.php)
- **단가**: SOLAPI 기준 **월 1~9,999건 → 13원/건**, 월 발송량 클수록 최대 57.69% 할인
- **공식 가이드**: [kakaobusiness — 알림톡](https://kakaobusiness.gitbook.io/main/ad/infotalk)

### 3-2. 텔레그램 봇 — 개인 개발자 시작 최적
- **공식 문서**: [core.telegram.org/bots/api](https://core.telegram.org/bots/api)
- **가격**: **무료, 사업자등록 불필요**
- **제약**: 초당 발송 제한 (단일 채팅 1msg/sec, 그룹 20msg/min, 전체 30msg/sec) — 검색결과 표기 모호하여 공식 문서 직접 확인 권장

### 3-3. 네이버 뉴스 검색 API
- **공식**: [developers.naver.com](https://developers.naver.com/main/)
- **일일 한도**: **25,000회/일** (호출당 최대 100건 → 일 약 2,500,000건 수집 가능)
- **초당**: 10~100회 (API별 상이)

### 3-4. 사용자가 언급한 "디스패치"
- 별도 상용 메시징 서비스 아님 (연예매체 디스패치와 무관)
- 일반 명사 **"발송/배포"** 의미로 해석 → 실제 채널은 **카카오톡 알림톡 + 텔레그램 봇 + 이메일** 조합

---

## 4. 음성 / AI

### 4-1. STT (음성 → 텍스트)
| 서비스 | 가격 | 한국어 | 비고 |
|---|---|---|---|
| OpenAI Whisper API | $0.006/분 ($0.36/시간) | 지원, 영어보다 정확도 낮음 | [OpenAI Pricing](https://openai.com/api/pricing/) |
| GPT-4o Mini Transcribe | $0.003/분 | 지원 | [OpenAI](https://developers.openai.com/api/docs/pricing) |
| Google Cloud STT | 페이지 truncated | ko-KR 지원 | [공식](https://cloud.google.com/speech-to-text/pricing) |
| Web Speech API | 무료 (브라우저 내장) | Chrome/Edge 한국어 OK | 한계: 브라우저 종속, 정확도 ↓ |
| 클로바 Speech (CSR) | NCP 요금표 | 한국어 최적화 | [NCP](https://www.ncloud.com/) |

**한국어 SaaS 추천**: 정확도 우선 → 클로바 / 비용 우선 → GPT-4o Mini Transcribe

### 4-2. LLM (권리분석·수지분석·자연어 검색)
| 모델 | 입력/1M | 출력/1M | 강점 |
|---|---|---|---|
| Claude Haiku 4.5 | $1 | $5 | 비용효율 |
| Claude Sonnet 4.6 | $3 | $15 | 균형 (RAG·법률문서 추천) |
| Claude Opus 4.7 | $5 | $25 | 복잡 권리분석 (단, 신규 토크나이저로 토큰 35%↑ 가능) |
| Gemini 2.5 Pro | $1.25 (≤200k) | $10 | 긴 컨텍스트 |
| Gemini 2.5 Flash | $0.30 | $2.50 | 일반용 |
| Gemini 2.5 Flash-Lite | $0.10 | $0.40 | 최저가 |
| HCX-DASH (네이버) | NCP 요금표 | NCP 요금표 | 한국어 토큰화 효율 |

**출처**:
- [Anthropic 공식 가격](https://platform.claude.com/docs/en/about-claude/pricing)
- [Gemini 가격](https://ai.google.dev/gemini-api/docs/pricing)
- [클로바 스튜디오](https://www.ncloud.com/v2/product/aiService/clovaStudio)

**부동산 도메인 권장 라우팅**:
- 등기부등본 권리분석(고난도) → **Claude Sonnet 4.6** (Opus 4.7은 토큰 비용 폭발 위험)
- 매물 자연어 검색(STT → 쿼리 변환) → **Gemini Flash-Lite** 또는 **Haiku 4.5**
- 뉴스 요약 (대량 배치) → **Gemini Flash-Lite + Batch 50% 할인**

---

## 5. 검증 안 된 / 추가 조사 필요

| 항목 | 사유 |
|---|---|
| V월드 상업용 라이선스 정확 조건 | 검색결과로 확정 불가 — 발급 후 약관 직접 확인 |
| 카카오맵 2026 프로모션 단가 | 검색 결과 수치 모순 ("0.1원의 80% 할인" vs "10원에 80% 할인") |
| NCP Maps 정확한 초과 단가 | 자주 변경되는 요금 — [요금표](https://www.ncloud.com/charge/region) 결제 전 재확인 |
| 텔레그램 봇 정확한 rate limit | 공식 문서 직접 |
| 클로바 스튜디오 모델별 단가 | NCP 로그인 후 요금 페이지 확인 필요 |
| Google Cloud STT 한국어 단가 | 페이지 응답 truncated |
| KDI / 한국은행 / 산업연구원 API·RSS | 별도 조사 필요 — 대부분 RSS만 제공 추정 |

---

## 6. MVP 1차 권장 데이터 조합

**핵심 가설**: 합법적 공식 API만으로 **"공매 + 실거래가 + 지도 + 권리분석 LLM"** 콤보가 최단경로.

| 기능 | 사용 API |
|---|---|
| 매물 데이터 | **지지옥션 PDF 업로드 (경매)** + 온비드 (공매) + LH 분양임대 |
| 시세 비교 | 국토부 실거래가 + R-ONE |
| 지도 표시 | 카카오맵 (클러스터) + V월드 (지적·3D) |
| 권리·법률 분석 | 국가법령정보 + Claude Sonnet 4.6 |
| 건물 정보 | 세움터 건축물대장 |
| 알림 | 텔레그램 봇 (개발자 단계) → 사업자 등록 후 카카오 알림톡 |
| 뉴스 자동수집 | 네이버 뉴스 검색 API + Gemini Flash-Lite 요약 |

**경매·청약홈 직접 데이터·KDI 리서치는 2차 단계로 분리**.

---

## 7. 다음 단계

1. **사용자 결정 필요**:
   - MVP 1차 범위 위 표 그대로 갈지?
   - 사업자등록 가능 여부 (알림톡·CODEF 결제 영향)
   - 예산 (CODEF, NCP, Anthropic API 월 한도)
2. **기술 스펙 확정**: 백엔드/DB/프론트 스택 (제안: NestJS + PostgreSQL + Next.js + 카카오맵)
3. **API 키 발급 작업** (수동, 1~2일 소요):
   - data.go.kr 가입 → 위 API 6~7개 일괄 신청
   - V월드 인증키
   - 카카오 디벨로퍼스 앱 등록
   - Anthropic API 키
   - 텔레그램 봇 토큰
4. **`pnpm` 모노레포 초기화 후 첫 데이터 파이프라인 (실거래가 수집) 작성**
