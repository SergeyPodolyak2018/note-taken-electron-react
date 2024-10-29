import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Database = require('better-sqlite3');

import path from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const filename =
  process.env.NODE_ENV === 'development'
    ? './demo_table.db'
    : path.join(__filename, './demo_table.db');

const db = new Database(filename);

db.pragma('journal_mode = WAL');
//@ts-ignore
function createTables(newdb) {
  let sql1 = `
				CREATE TABLE IF NOT EXISTS Notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_time INTEGER DEFAULT 0
    );
    `;

  //@ts-ignore
  newdb.exec(sql1);
}
createTables(db);
export default { db };
