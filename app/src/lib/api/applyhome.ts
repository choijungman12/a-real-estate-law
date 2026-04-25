/**
 * 청약홈 OPEN API (한국부동산원, odcloud.kr)
 * https://www.data.go.kr/data/15098547/openapi.do
 *
 * - 분양정보 (getAPTLttotPblancDetail)
 * - 청약 경쟁률 (getAPTLttotPblancCmpet)
 * - 당첨 가점 (getAptLttotPblancScore)
 * - 특별공급 상세 (getAPTLttotPblancMdl)
 *
 * 출처 패턴: ref-sem2em/src/real-estate-subscription/service/real-estate-subscription-apt.service.ts
 */

const APT_LIST_URL =
  'https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getAPTLttotPblancDetail';
const APT_CMPET_URL =
  'https://api.odcloud.kr/api/ApplyhomeInfoCmpetRtSvc/v1/getAPTLttotPblancCmpet';
const APT_SCORE_URL =
  'https://api.odcloud.kr/api/ApplyhomeInfoCmpetRtSvc/v1/getAptLttotPblancScore';
const APT_MDL_URL =
  'https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getAPTLttotPblancMdl';

function key(): string {
  const k = process.env.DATA_GO_KR_KEY_ENCODED || process.env.DATA_GO_KR_KEY_DECODED;
  if (!k) throw new Error('DATA_GO_KR_KEY 가 필요합니다.');
  return k;
}

export type ApplyAptItem = {
  pblancNo: string;
  houseNm: string;
  rceptBgnde: string;
  rceptEndde: string;
  bsnsMbyNm: string;
  hssplyAdres: string;
  totSuplyHshldco: number;
  rcritPblancDe: string;
  przwnerPresnatnDe: string;
  cnstrctEnttNm: string;
};

export async function fetchAptApplications(params: {
  page?: number;
  perPage?: number;
}): Promise<{ items: ApplyAptItem[]; totalCount: number }> {
  const url = new URL(APT_LIST_URL);
  url.searchParams.set('page', String(params.page ?? 1));
  url.searchParams.set('perPage', String(params.perPage ?? 30));
  url.searchParams.set('serviceKey', key());

  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) throw new Error(`Applyhome HTTP ${res.status}`);
  const data = await res.json();
  const items = (data.data ?? []).map((d: Record<string, unknown>) => ({
    pblancNo: String(d.PBLANC_NO ?? ''),
    houseNm: String(d.HOUSE_NM ?? ''),
    rceptBgnde: String(d.RCEPT_BGNDE ?? ''),
    rceptEndde: String(d.RCEPT_ENDDE ?? ''),
    bsnsMbyNm: String(d.BSNS_MBY_NM ?? ''),
    hssplyAdres: String(d.HSSPLY_ADRES ?? ''),
    totSuplyHshldco: Number(d.TOT_SUPLY_HSHLDCO ?? 0),
    rcritPblancDe: String(d.RCRIT_PBLANC_DE ?? ''),
    przwnerPresnatnDe: String(d.PRZWNER_PRESNATN_DE ?? ''),
    cnstrctEnttNm: String(d.CNSTRCT_ENTT_NM ?? ''),
  }));
  return { items, totalCount: Number(data.totalCount ?? items.length) };
}

// ─── 경쟁률 + 당첨가점 (병합 결과) ────────────────────────

export type CompetitionEntry = {
  rank: string;       // 1순위/2순위
  resideName: string; // 거주지역
  reqCnt: number;     // 접수건수
  rate: string;       // 경쟁률
};

export type ScoreEntry = {
  resideName: string;
  lowestScore: number;
  topScore: number;
  averageScore: number;
};

export type CompetitionMerged = {
  houseManageNo: string;
  pblancNo: string;
  modelNo: string;
  houseType: string;
  competitionList: CompetitionEntry[];
  winnerScoreList: ScoreEntry[];
};

async function fetchOdcloud(url: string, params: Record<string, string>) {
  const u = new URL(url);
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  u.searchParams.set('serviceKey', key());
  const res = await fetch(u.toString(), { cache: 'no-store' });
  if (!res.ok) throw new Error(`odcloud HTTP ${res.status}`);
  return res.json();
}

export async function fetchAptCompetition(params: {
  pblancNo?: string;
  houseManageNo?: string;
  perPage?: number;
}): Promise<CompetitionMerged[]> {
  const baseParams: Record<string, string> = {
    page: '1',
    perPage: String(params.perPage ?? 50),
  };
  if (params.houseManageNo) baseParams['cond[HOUSE_MANAGE_NO::EQ]'] = params.houseManageNo;
  if (params.pblancNo) baseParams['cond[PBLANC_NO::EQ]'] = params.pblancNo;

  const [cmpetData, scoreData] = await Promise.all([
    fetchOdcloud(APT_CMPET_URL, baseParams),
    fetchOdcloud(APT_SCORE_URL, baseParams),
  ]);

  const merged = new Map<string, CompetitionMerged>();

  for (const it of cmpetData.data ?? []) {
    const r = it as Record<string, unknown>;
    const houseTypeRaw = String(r.HOUSE_TY ?? '').trim();
    const k = `${r.HOUSE_MANAGE_NO}_${r.PBLANC_NO}_${r.MODEL_NO}_${houseTypeRaw}`;
    if (!merged.has(k)) {
      merged.set(k, {
        houseManageNo: String(r.HOUSE_MANAGE_NO ?? ''),
        pblancNo: String(r.PBLANC_NO ?? ''),
        modelNo: String(r.MODEL_NO ?? ''),
        houseType: houseTypeRaw,
        competitionList: [],
        winnerScoreList: [],
      });
    }
    merged.get(k)!.competitionList.push({
      rank: String(r.SUBSCRPT_RANK_CODE ?? ''),
      resideName: String(r.RESIDE_SENM ?? ''),
      reqCnt: Number(r.REQ_CNT ?? 0),
      rate: String(r.CMPET_RATE ?? ''),
    });
  }

  for (const it of scoreData.data ?? []) {
    const r = it as Record<string, unknown>;
    const houseTypeRaw = String(r.HOUSE_TY ?? '').trim();
    const k = `${r.HOUSE_MANAGE_NO}_${r.PBLANC_NO}_${r.MODEL_NO}_${houseTypeRaw}`;
    const target = merged.get(k);
    if (!target) continue;
    const exists = target.winnerScoreList.find(
      (s) => s.resideName === String(r.RESIDE_SENM ?? '')
    );
    if (!exists) {
      target.winnerScoreList.push({
        resideName: String(r.RESIDE_SENM ?? ''),
        lowestScore: Number(r.LWET_SCORE ?? 0),
        topScore: Number(r.TOP_SCORE ?? 0),
        averageScore: Number(r.AVRG_SCORE ?? 0),
      });
    }
  }

  return Array.from(merged.values());
}

// ─── 특별공급 상세 ──────────────────────────────────

export type AptModelDetail = {
  houseManageNo: string;
  pblancNo: string;
  modelNo: string;
  houseType: string;
  supplyArea: number;
  supplyHshldco: number;       // 일반 공급세대수
  spsplyHshldco: number;       // 특별공급 합계
  mnychHshldco: number;        // 다자녀
  nwwdsHshldco: number;        // 신혼부부
  lfeFrstHshldco: number;      // 생애최초
  oldParntsSuportHshldco: number; // 노부모부양
  insttRecomendHshldco: number;   // 기관추천
  topAmount: number;            // 분양가 상한 (만원)
};

export async function fetchAptModelDetail(params: {
  pblancNo?: string;
  houseManageNo?: string;
  perPage?: number;
}): Promise<AptModelDetail[]> {
  const baseParams: Record<string, string> = {
    page: '1',
    perPage: String(params.perPage ?? 50),
  };
  if (params.houseManageNo) baseParams['cond[HOUSE_MANAGE_NO::EQ]'] = params.houseManageNo;
  if (params.pblancNo) baseParams['cond[PBLANC_NO::EQ]'] = params.pblancNo;
  const data = await fetchOdcloud(APT_MDL_URL, baseParams);
  return (data.data ?? []).map((r: Record<string, unknown>) => ({
    houseManageNo: String(r.HOUSE_MANAGE_NO ?? ''),
    pblancNo: String(r.PBLANC_NO ?? ''),
    modelNo: String(r.MODEL_NO ?? ''),
    houseType: String(r.HOUSE_TY ?? ''),
    supplyArea: Number(r.SUPLY_AR ?? 0),
    supplyHshldco: Number(r.SUPLY_HSHLDCO ?? 0),
    spsplyHshldco: Number(r.SPSPLY_HSHLDCO ?? 0),
    mnychHshldco: Number(r.MNYCH_HSHLDCO ?? 0),
    nwwdsHshldco: Number(r.NWWDS_HSHLDCO ?? 0),
    lfeFrstHshldco: Number(r.LFE_FRST_HSHLDCO ?? 0),
    oldParntsSuportHshldco: Number(r.OLD_PARNTS_SUPORT_HSHLDCO ?? 0),
    insttRecomendHshldco: Number(r.INSTT_RECOMEND_HSHLDCO ?? 0),
    topAmount: Number(r.LTTOT_TOP_AMOUNT ?? 0),
  }));
}
