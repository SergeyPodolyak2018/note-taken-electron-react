import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Database = require('better-sqlite3');
const { app } = require('electron');

import path from 'node:path';
import { IDBStore } from '../definitions/definitions';

class DB implements IDBStore<any> {
  db: any;
  constructor(db: any) {
    this.db = db;
  }
  saveAllData() {}

  initData() {
    const sql1 = `
				CREATE TABLE IF NOT EXISTS Notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_time INTEGER DEFAULT 0
    );
    `;

    //@ts-ignore
    this.db.exec(sql1);
  }

  getDatabase() {
    return this.db;
  }
  setDatabase(data: any) {
    this.db = data;
  }

  static create() {
    console.log('SQL service started');
    const filename =
      process.env.NODE_ENV === 'development'
        ? './demo_table.db'
        : path.resolve(app.getPath('userData'), 'myDatabase.db');

    const db = new Database(filename);
    db.pragma('journal_mode = WAL');
    return new DB(db);
  }
}

export default { db: DB };
