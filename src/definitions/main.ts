import { TNote } from '../../electron/Database/Database.service';
export type TMain = {
  status: 'loading' | 'loaded';
  data: TNoteUI[];
};

export type TNoteUI = TNote & { changed?: boolean };
