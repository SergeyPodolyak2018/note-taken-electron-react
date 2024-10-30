import { TNote } from '../definitions/definitions';
import { IDBStore } from '../definitions/definitions';

export class DBService {
  dbInstance: IDBStore<TNote[]>;
  constructor(db: IDBStore<TNote[]>) {
    this.dbInstance = db;
  }
  insertNote(note: Omit<TNote, 'id' | 'created_time'>) {
    const time = new Date().getTime();
    const existingNotes = this.dbInstance.getDatabase();
    const newNote = {
      id: existingNotes.length + 1,
      title: note.title,
      content: note.content,
      created_time: time,
    };
    this.dbInstance.setDatabase([newNote, ...existingNotes]);
    return newNote;
  }
  updateNote(todo: TNote) {
    const { title, content, created_time, id } = todo;
    const existingNotes = [...this.dbInstance.getDatabase()];
    const newNote = {
      id: id,
      title: title,
      content: content,
      created_time: created_time,
    };
    const index = existingNotes.findIndex((el) => el.id === id);
    existingNotes[index] = newNote;
    this.dbInstance.setDatabase(existingNotes);
    return newNote;
  }
  deleteNote(id: number) {
    const existingNotes = [...this.dbInstance.getDatabase()];
    const index = existingNotes.findIndex((el) => el.id === id);
    existingNotes.splice(index, 1);
    this.dbInstance.setDatabase(existingNotes);
    return { status: 'ok' };
  }
  getAllNotes() {
    return this.dbInstance
      .getDatabase()
      .sort((x, y) => x.created_time - y.created_time);
  }
  getOneNote(id: number) {
    const existingNotes = [...this.dbInstance.getDatabase()];
    const index = existingNotes.findIndex((el) => el.id === id);
    return existingNotes.at(index);
  }
  saveAll() {
    this.dbInstance.saveAllData();
  }
}
