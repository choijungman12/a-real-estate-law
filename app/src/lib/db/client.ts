/**
 * Drizzle 클라이언트 (Supabase Postgres 권장)
 * DATABASE_URL 미설정 시 null 반환 → 호출처에서 graceful fallback
 */
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let cachedDb: PostgresJsDatabase<typeof schema> | null = null;
let cachedSql: ReturnType<typeof postgres> | null = null;

export function getDb(): PostgresJsDatabase<typeof schema> | null {
  if (cachedDb) return cachedDb;
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  cachedSql = postgres(url, {
    max: 5,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false, // Supabase pooler 호환
  });
  cachedDb = drizzle(cachedSql, { schema });
  return cachedDb;
}

export { schema };
