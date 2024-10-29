//import Database from './sqlite';

export type TNote = {
  id: number;
  title: string;
  content: string;
  created_time: number;
};

export class DBService {
  db: any;
  constructor(db: any) {
    this.db = db;
  }
  insertNote(note: Omit<TNote, 'id' | 'created_time'>) {
    const time = new Date().getTime();
    const stm = this.db.prepare(
      'INSERT INTO Notes (title, content, created_time) VALUES (@title, @content, @created_time) RETURNING *'
    );
    const result = stm.run({ ...note, ...{ created_time: time } });

    const stmnew = this.db.prepare('SELECT * FROM Notes where id = @id');
    const created = stmnew.get({
      id: result.lastInsertRowid,
    }) as unknown as TNote;
    console.log(created);
    return created;
  }
  updateNote(todo: TNote) {
    const { title, content, created_time, id } = todo;

    const stm = this.db.prepare(
      'UPDATE Notes SET title = @title, content = @content, created_time=@created_time WHERE id = @id RETURNING *'
    );
    stm.run({ title, content, created_time, id });
    const stmnew = this.db.prepare('SELECT * FROM Notes where id = @id');
    const created = stmnew.get({
      id,
    }) as unknown as TNote;
    return created;
  }
  deleteNote(id: number) {
    const stm = this.db.prepare('DELETE FROM Notes WHERE id = @id');

    return stm.run({ id });
  }
  getAllNotes() {
    const stm = this.db.prepare(
      `SELECT id, title, content, created_time 
    FROM Notes 
    ORDER BY created_time DESC;`
    );
    return stm.all() as unknown as TNote[];
  }
  getOneNote(id: number) {
    const stm = this.db.prepare('SELECT * FROM Notes where id = @id');

    return stm.get({ id }) as unknown as TNote;
  }
}

// export function insertNote(note: Omit<TNote, 'id' | 'created_time'>) {
//   const time = new Date().getTime();
//   const stm = Database.db.prepare(
//     'INSERT INTO Notes (title, content, created_time) VALUES (@title, @content, @created_time) RETURNING *'
//   );
//   const result = stm.run({ ...note, ...{ created_time: time } });

//   const stmnew = Database.db.prepare('SELECT * FROM Notes where id = @id');
//   const created = stmnew.get({
//     id: result.lastInsertRowid,
//   }) as unknown as TNote;
//   console.log(created);
//   return created;
// }

// export function updateNote(todo: TNote) {
//   const { title, content, created_time, id } = todo;

//   const stm = Database.db.prepare(
//     'UPDATE Notes SET title = @title, content = @content, created_time=@created_time WHERE id = @id RETURNING *'
//   );
//   stm.run({ title, content, created_time, id });
//   const stmnew = Database.db.prepare('SELECT * FROM Notes where id = @id');
//   const created = stmnew.get({
//     id,
//   }) as unknown as TNote;
//   return created;
// }

// export function deleteNote(id: number) {
//   const stm = Database.db.prepare('DELETE FROM Notes WHERE id = @id');

//   return stm.run({ id });
// }

// export function getAllNotes() {
//   const stm = Database.db.prepare(
//     `SELECT id, title, content, created_time
//     FROM Notes
//     ORDER BY created_time DESC;`
//   );
//   return stm.all() as unknown as TNote[];
// }

// export function getOneNote(id: number) {
//   const stm = Database.db.prepare('SELECT * FROM Notes where id = @id');

//   return stm.get({ id }) as unknown as TNote;
// }
