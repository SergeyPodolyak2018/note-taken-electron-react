import { createRequire } from 'module';
import { expect, it, describe, beforeEach, afterEach } from 'vitest';
const require = createRequire(import.meta.url);
const Database = require('better-sqlite3');
import { DBService } from '../electron/Database/Database.service';

const db = new Database(':memory:');

async function createTables(newdb: any) {
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
async function dropeTables(newdb: any) {
  let sql1 = `
				DROP TABLE IF NOT EXISTS Notes;
    `;

  //@ts-ignore
  newdb.exec(sql1);
}

beforeEach(async () => {
  await createTables(db);
});
afterEach(async () => {
  dropeTables(db);
});

describe('check db service', () => {
  it('should render greatings', async () => {
    const service = new DBService(db);
    const result = service.getAllNotes();
    console.log(result);
    expect(result).equal([]);
  });
});
