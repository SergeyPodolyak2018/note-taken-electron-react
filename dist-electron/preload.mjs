"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(
      channel,
      (event, ...args2) => listener(event, ...args2)
    );
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  },
  // You can expose other APTs you need here.
  // ...
  insertNote: (todo) => electron.ipcRenderer.invoke("note:insert", todo),
  deleteNote: (id) => electron.ipcRenderer.invoke("note:delete", id),
  getAllNotes: () => electron.ipcRenderer.invoke("note:getAll"),
  getOneNote: (id) => electron.ipcRenderer.invoke("note:getOne", id),
  updateNote: (todo) => electron.ipcRenderer.invoke("note:update", todo)
});
