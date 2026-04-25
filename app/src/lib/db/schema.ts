/**
 * Drizzle 스키마 — 매물 스냅샷·뉴스 아카이브·분석 결과 캐시
 * DB: PostgreSQL (Supabase 권장)
 */
import {
  pgTable,
  serial,
  text,
  bigint,
  timestamp,
  date,
  integer,
  jsonb,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const onbidSnapshots = pgTable(
  'onbid_snapshots',
  {
    id: serial('id').primaryKey(),
    snapshotDate: date('snapshot_date').notNull(),
    cltrNo: text('cltr_no').notNull(),
    pbctNo: text('pbct_no').notNull(),
    cltrNm: text('cltr_nm').notNull(),
    cltrAddr: text('cltr_addr').notNull(),
    sido: text('sido'),
    sigunguName: text('sigungu_name'),
    sigunguCode: text('sigungu_code'),
    apprAmt: bigint('appr_amt', { mode: 'number' }).notNull(),
    minBidPrc: bigint('min_bid_prc', { mode: 'number' }).notNull(),
    cltrSttsCd: text('cltr_stts_cd'),
    pbctBgngDtm: text('pbct_bgng_dtm'),
    pbctEndDtm: text('pbct_end_dtm'),
    useLclsfNm: text('use_lclsf_nm'),
    useMclsfNm: text('use_mclsf_nm'),
    capturedAt: timestamp('captured_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    uniqByDate: uniqueIndex('onbid_snap_uniq')
      .on(t.snapshotDate, t.cltrNo, t.pbctNo),
    bySido: index('onbid_snap_sido_idx').on(t.sido, t.snapshotDate),
    byDate: index('onbid_snap_date_idx').on(t.snapshotDate),
  })
);

export const newsArchive = pgTable(
  'news_archive',
  {
    id: serial('id').primaryKey(),
    keyword: text('keyword').notNull(),
    title: text('title').notNull(),
    link: text('link').notNull(),
    description: text('description'),
    pubDate: text('pub_date'),
    capturedAt: timestamp('captured_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    uniqLink: uniqueIndex('news_uniq_link').on(t.link),
    byKeyword: index('news_keyword_idx').on(t.keyword, t.capturedAt),
  })
);

export const analysisCache = pgTable(
  'analysis_cache',
  {
    id: serial('id').primaryKey(),
    fileHash: text('file_hash').notNull(),
    model: text('model').notNull(),
    fileName: text('file_name'),
    sizeBytes: integer('size_bytes'),
    analysisJson: jsonb('analysis_json').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    uniqHashModel: uniqueIndex('analysis_uniq').on(t.fileHash, t.model),
  })
);

export type OnbidSnapshotRow = typeof onbidSnapshots.$inferSelect;
export type NewsArchiveRow = typeof newsArchive.$inferSelect;
