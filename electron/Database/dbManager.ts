import { DBService as sqlDBService } from './sql/Database.service.ts';
import sqlDB from './sql/store.ts';

import { DBService as jsonDBService } from './json/Database.service.ts';
import jsonDB from './json/store.ts';

const service =
  process.env.VITE_DB_TYPE === 'json'
    ? new jsonDBService(jsonDB.db.create())
    : new sqlDBService(sqlDB.db.create());

//export default new sqlDBService(sqlDB.db);
export default service;
