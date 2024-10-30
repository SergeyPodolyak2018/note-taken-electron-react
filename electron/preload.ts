import { ipcRenderer, contextBridge } from 'electron';
import { TNote } from './Database/definitions/definitions.ts';

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) =>
      listener(event, ...args)
    );
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },

  // You can expose other APTs you need here.
  // ...
  insertNote: (todo: TNote) => ipcRenderer.invoke('note:insert', todo),
  deleteNote: (id: number) => ipcRenderer.invoke('note:delete', id),
  getAllNotes: () => ipcRenderer.invoke('note:getAll'),
  getOneNote: (id: number) => ipcRenderer.invoke('note:getOne', id),
  updateNote: (todo: TNote) => ipcRenderer.invoke('note:update', todo),
});
