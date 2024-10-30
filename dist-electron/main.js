var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { app as app$2, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createRequire } from "module";
import fs from "node:fs";
let DBService$1 = class DBService {
  constructor(db) {
    __publicField(this, "dbInstance");
    db.initData();
    this.dbInstance = db;
  }
  insertNote(note) {
    const time = (/* @__PURE__ */ new Date()).getTime();
    const stm = this.dbInstance.getDatabase().prepare(
      "INSERT INTO Notes (title, content, created_time) VALUES (@title, @content, @created_time) RETURNING *"
    );
    const result = stm.run({ ...note, ...{ created_time: time } });
    const stmnew = this.dbInstance.getDatabase().prepare("SELECT * FROM Notes where id = @id");
    const created = stmnew.get({
      id: result.lastInsertRowid
    });
    console.log(created);
    return created;
  }
  updateNote(todo) {
    const { title, content, created_time, id } = todo;
    const stm = this.dbInstance.getDatabase().prepare(
      "UPDATE Notes SET title = @title, content = @content, created_time=@created_time WHERE id = @id RETURNING *"
    );
    stm.run({ title, content, created_time, id });
    const stmnew = this.dbInstance.getDatabase().prepare("SELECT * FROM Notes where id = @id");
    const created = stmnew.get({
      id
    });
    return created;
  }
  deleteNote(id) {
    const stm = this.dbInstance.getDatabase().prepare("DELETE FROM Notes WHERE id = @id");
    return stm.run({ id });
  }
  getAllNotes() {
    const stm = this.dbInstance.getDatabase().prepare(
      `SELECT id, title, content, created_time 
    FROM Notes 
    ORDER BY created_time DESC;`
    );
    return stm.all();
  }
  getOneNote(id) {
    const stm = this.dbInstance.getDatabase().prepare("SELECT * FROM Notes where id = @id");
    return stm.get({ id });
  }
  saveAll() {
    this.dbInstance.saveAllData();
  }
};
const require$1 = createRequire(import.meta.url);
const Database = require$1("better-sqlite3");
const { app: app$1 } = require$1("electron");
let DB$1 = class DB {
  constructor(db) {
    __publicField(this, "db");
    this.db = db;
  }
  saveAllData() {
  }
  initData() {
    const sql1 = `
				CREATE TABLE IF NOT EXISTS Notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_time INTEGER DEFAULT 0
    );
    `;
    this.db.exec(sql1);
  }
  getDatabase() {
    return this.db;
  }
  setDatabase(data) {
    this.db = data;
  }
  static create() {
    console.log("SQL service started");
    const filename2 = process.env.NODE_ENV === "development" ? "./demo_table.db" : path.resolve(app$1.getPath("userData"), "myDatabase.db");
    const db = new Database(filename2);
    db.pragma("journal_mode = WAL");
    return new DB(db);
  }
};
const sqlDB = { db: DB$1 };
class DBService2 {
  constructor(db) {
    __publicField(this, "dbInstance");
    this.dbInstance = db;
  }
  insertNote(note) {
    const time = (/* @__PURE__ */ new Date()).getTime();
    const existingNotes = this.dbInstance.getDatabase();
    const newNote = {
      id: existingNotes.length + 1,
      title: note.title,
      content: note.content,
      created_time: time
    };
    this.dbInstance.setDatabase([newNote, ...existingNotes]);
    return newNote;
  }
  updateNote(todo) {
    const { title, content, created_time, id } = todo;
    const existingNotes = [...this.dbInstance.getDatabase()];
    const newNote = {
      id,
      title,
      content,
      created_time
    };
    const index = existingNotes.findIndex((el) => el.id === id);
    existingNotes[index] = newNote;
    this.dbInstance.setDatabase(existingNotes);
    return newNote;
  }
  deleteNote(id) {
    const existingNotes = [...this.dbInstance.getDatabase()];
    const index = existingNotes.findIndex((el) => el.id === id);
    existingNotes.splice(index, 1);
    this.dbInstance.setDatabase(existingNotes);
    return { status: "ok" };
  }
  getAllNotes() {
    return this.dbInstance.getDatabase().sort((x, y) => x.created_time - y.created_time);
  }
  getOneNote(id) {
    const existingNotes = [...this.dbInstance.getDatabase()];
    const index = existingNotes.findIndex((el) => el.id === id);
    return existingNotes.at(index);
  }
  saveAll() {
    this.dbInstance.saveAllData();
  }
}
const require2 = createRequire(import.meta.url);
const { app } = require2("electron");
const filename = process.env.NODE_ENV === "development" ? "./demo_table.json" : path.resolve(app.getPath("userData"), "myDatabase.json");
class DB2 {
  constructor(db) {
    __publicField(this, "db");
    this.db = db;
  }
  async saveAllData() {
    try {
      await fs.promises.writeFile(filename, JSON.stringify(this.db));
    } catch (err) {
      console.log(err);
    }
  }
  initData() {
    console.log("This is method not working here");
  }
  getDatabase() {
    return this.db;
  }
  setDatabase(data) {
    this.db = data;
  }
  static create() {
    console.log("JSON service started");
    let preparedData = [];
    try {
      const data = fs.readFileSync(filename, "utf8");
      preparedData = JSON.parse(data);
    } catch (err) {
      console.error(err);
    }
    return new DB2(preparedData);
  }
}
const jsonDB = { db: DB2 };
const service = process.env.VITE_DB_TYPE === "json" ? new DBService2(jsonDB.db.create()) : new DBService$1(sqlDB.db.create());
const __dirname = path.dirname(fileURLToPath(import.meta.url));
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
    maxWidth: 1500,
    show: false
  });
  const splash = new BrowserWindow({
    width: 500,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true
  });
  splash.loadFile(path.join(RENDERER_DIST, "loader.html"));
  splash.center();
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
  setTimeout(function() {
    splash.close();
    win == null ? void 0 : win.show();
  }, 5e3);
}
app$2.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    service.saveAll();
    app$2.quit();
    win = null;
  }
});
app$2.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app$2.whenReady().then(() => {
  ipcMain.handle("note:insert", async (_, todo) => {
    return service.insertNote(todo);
  });
  ipcMain.handle("note:update", async (_, todo) => {
    return service.updateNote(todo);
  });
  ipcMain.handle("note:delete", async (_, id) => {
    service.deleteNote(id);
  });
  ipcMain.handle("note:getOne", async (_, id) => {
    return service.getOneNote(id);
  });
  ipcMain.handle("note:getAll", async () => {
    return service.getAllNotes();
  });
  createWindow();
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
