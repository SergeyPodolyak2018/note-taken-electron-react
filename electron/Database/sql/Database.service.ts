import { TNote } from '../definitions/definitions';
import { IDBStore } from '../definitions/definitions';

export class DBService {
  dbInstance: IDBStore<any>;
  constructor(db: IDBStore<any>) {
    db.initData();
    this.dbInstance = db;
  }
  insertNote(note: Omit<TNote, 'id' | 'created_time'>) {
    const time = new Date().getTime();
    const stm = this.dbInstance
      .getDatabase()
      .prepare(
        'INSERT INTO Notes (title, content, created_time) VALUES (@title, @content, @created_time) RETURNING *'
      );
    const result = stm.run({ ...note, ...{ created_time: time } });

    const stmnew = this.dbInstance
      .getDatabase()
      .prepare('SELECT * FROM Notes where id = @id');
    const created = stmnew.get({
      id: result.lastInsertRowid,
    }) as unknown as TNote;
    return created;
  }
  updateNote(todo: TNote) {
    const { title, content, created_time, id } = todo;

    const stm = this.dbInstance
      .getDatabase()
      .prepare(
        'UPDATE Notes SET title = @title, content = @content, created_time=@created_time WHERE id = @id RETURNING *'
      );
    stm.run({ title, content, created_time, id });
    const stmnew = this.dbInstance
      .getDatabase()
      .prepare('SELECT * FROM Notes where id = @id');
    const created = stmnew.get({
      id,
    }) as unknown as TNote;
    return created;
  }
  deleteNote(id: number) {
    const stm = this.dbInstance
      .getDatabase()
      .prepare('DELETE FROM Notes WHERE id = @id');

    return stm.run({ id });
  }
  getAllNotes() {
    const stm = this.dbInstance.getDatabase().prepare(
      `SELECT id, title, content, created_time 
    FROM Notes 
    ORDER BY created_time DESC;`
    );
    return stm.all() as unknown as TNote[];
  }
  getOneNote(id: number) {
    const stm = this.dbInstance
      .getDatabase()
      .prepare('SELECT * FROM Notes where id = @id');

    return stm.get({ id }) as unknown as TNote;
  }
  saveAll() {
    this.dbInstance.saveAllData();
  }
}
