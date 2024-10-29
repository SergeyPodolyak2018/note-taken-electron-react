var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { app, BrowserWindow, ipcMain } from "electron";
import { createRequire } from "module";
import path from "node:path";
import { fileURLToPath } from "url";
import { fileURLToPath as fileURLToPath$1 } from "node:url";
const require2 = createRequire(import.meta.url);
const Database = require2("better-sqlite3");
const __filename = fileURLToPath(import.meta.url);
const filename = process.env.NODE_ENV === "development" ? "./demo_table.db" : path.join(__filename, "./demo_table.db");
const db = new Database(filename);
db.pragma("journal_mode = WAL");
function createTables(newdb) {
  let sql1 = `
				CREATE TABLE IF NOT EXISTS Notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_time INTEGER DEFAULT 0
    );
    `;
  newdb.exec(sql1);
}
createTables(db);
const Database$1 = { db };
class DBService {
  constructor(db2) {
    __publicField(this, "db");
    this.db = db2;
  }
  insertNote(note) {
    const time = (/* @__PURE__ */ new Date()).getTime();
    const stm = this.db.prepare(
      "INSERT INTO Notes (title, content, created_time) VALUES (@title, @content, @created_time) RETURNING *"
    );
    const result = stm.run({ ...note, ...{ created_time: time } });
    const stmnew = this.db.prepare("SELECT * FROM Notes where id = @id");
    const created = stmnew.get({
      id: result.lastInsertRowid
    });
    console.log(created);
    return created;
  }
  updateNote(todo) {
    const { title, content, created_time, id } = todo;
    const stm = this.db.prepare(
      "UPDATE Notes SET title = @title, content = @content, created_time=@created_time WHERE id = @id RETURNING *"
    );
    stm.run({ title, content, created_time, id });
    const stmnew = this.db.prepare("SELECT * FROM Notes where id = @id");
    const created = stmnew.get({
      id
    });
    return created;
  }
  deleteNote(id) {
    const stm = this.db.prepare("DELETE FROM Notes WHERE id = @id");
    return stm.run({ id });
  }
  getAllNotes() {
    const stm = this.db.prepare(
      `SELECT id, title, content, created_time 
    FROM Notes 
    ORDER BY created_time DESC;`
    );
    return stm.all();
  }
  getOneNote(id) {
    const stm = this.db.prepare("SELECT * FROM Notes where id = @id");
    return stm.get({ id });
  }
}
const __dirname = path.dirname(fileURLToPath$1(import.meta.url));
const dbService = new DBService(Database$1.db);
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs")
    },
    width: 500,
    height: 600,
    minHeight: 400,
    maxHeight: 600,
    minWidth: 400,
    maxWidth: 1500
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(() => {
  ipcMain.handle("note:insert", async (_, todo) => {
    return dbService.insertNote(todo);
  });
  ipcMain.handle("note:update", async (_, todo) => {
    return dbService.updateNote(todo);
  });
  ipcMain.handle("note:delete", async (_, id) => {
    dbService.deleteNote(id);
  });
  ipcMain.handle("note:getOne", async (_, id) => {
    return dbService.getOneNote(id);
  });
  ipcMain.handle("note:getAll", async () => {
    return dbService.getAllNotes();
  });
  createWindow();
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
