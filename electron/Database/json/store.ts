import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import fs from 'node:fs';

const { app } = require('electron');

import path from 'node:path';
import { TNote, IDBStore } from '../definitions/definitions';

const filename =
  process.env.NODE_ENV === 'development'
    ? './demo_table.json'
    : path.resolve(app.getPath('userData'), 'myDatabase.json');

class DB implements IDBStore<TNote[]> {
  db: TNote[];
  constructor(db: TNote[]) {
    this.db = db;
  }

  async saveAllData() {
    try {
      await fs.promises.writeFile(filename, JSON.stringify(this.db));
    } catch (err) {
      console.log(err);
    }
  }

  initData() {
    console.log('This is method not working here');
  }

  getDatabase() {
    return this.db;
  }
  setDatabase(data: TNote[]) {
    this.db = data;
  }

  static create() {
    console.log('JSON service started');
    let preparedData = [];
    try {
      const data = fs.readFileSync(filename, 'utf8');
      preparedData = JSON.parse(data);
    } catch (err) {
      console.error(err);
    }

    return new DB(preparedData);
  }
}

export default { db: DB };
