export type TNote = {
  id: number;
  title: string;
  content: string;
  created_time: number;
};

export interface IDBStore<T> {
  db: T;
  saveAllData: () => void;
  initData: () => void;
  getDatabase: () => T;
  setDatabase: (data: T) => void;
}
