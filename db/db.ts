import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';

const sqlite = new Database('./db/local.sqlite');
export const db = drizzle(sqlite);
