import { TNote } from '../../electron/Database/definitions/definitions.ts';
export type TMain = {
  status: 'loading' | 'loaded';
  data: TNoteUI[];
};

export type TNoteUI = TNote & { changed?: boolean };
