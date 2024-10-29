var b = Object.defineProperty;
var w = (t, e, n) => e in t ? b(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var T = (t, e, n) => w(t, typeof e != "symbol" ? e + "" : e, n);
import { app as a, BrowserWindow as R, ipcMain as r } from "electron";
import { createRequire as O } from "module";
import o from "node:path";
import { fileURLToPath as g } from "node:url";
const N = O(import.meta.url), I = N("better-sqlite3"), { app: L } = N("electron"), D = process.env.NODE_ENV === "development" ? "./demo_table.db" : o.resolve(L.getPath("userData"), "myDatabase.db"), E = new I(D);
E.pragma("journal_mode = WAL");
function A(t) {
  t.exec(`
				CREATE TABLE IF NOT EXISTS Notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_time INTEGER DEFAULT 0
    );
    `);
}
A(E);
const S = { db: E };
class v {
  constructor(e) {
    T(this, "db");
    this.db = e;
  }
  insertNote(e) {
    const n = (/* @__PURE__ */ new Date()).getTime(), c = this.db.prepare(
      "INSERT INTO Notes (title, content, created_time) VALUES (@title, @content, @created_time) RETURNING *"
    ).run({ ...e, created_time: n }), l = this.db.prepare("SELECT * FROM Notes where id = @id").get({
      id: c.lastInsertRowid
    });
    return console.log(l), l;
  }
  updateNote(e) {
    const { title: n, content: p, created_time: c, id: d } = e;
    return this.db.prepare(
      "UPDATE Notes SET title = @title, content = @content, created_time=@created_time WHERE id = @id RETURNING *"
    ).run({ title: n, content: p, created_time: c, id: d }), this.db.prepare("SELECT * FROM Notes where id = @id").get({
      id: d
    });
  }
  deleteNote(e) {
    return this.db.prepare("DELETE FROM Notes WHERE id = @id").run({ id: e });
  }
  getAllNotes() {
    return this.db.prepare(
      `SELECT id, title, content, created_time 
    FROM Notes 
    ORDER BY created_time DESC;`
    ).all();
  }
  getOneNote(e) {
    return this.db.prepare("SELECT * FROM Notes where id = @id").get({ id: e });
  }
}
const _ = o.dirname(g(import.meta.url)), i = new v(S.db);
process.env.APP_ROOT = o.join(_, "..");
const m = process.env.VITE_DEV_SERVER_URL, F = o.join(process.env.APP_ROOT, "dist-electron"), h = o.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = m ? o.join(process.env.APP_ROOT, "public") : h;
let s;
function u() {
  s = new R({
    icon: o.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: o.join(_, "preload.mjs")
    },
    width: 500,
    height: 600,
    minHeight: 400,
    maxHeight: 600,
    minWidth: 400,
    maxWidth: 1500
  }), s.webContents.on("did-finish-load", () => {
    s == null || s.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), m ? s.loadURL(m) : s.loadFile(o.join(h, "index.html"));
}
a.on("window-all-closed", () => {
  process.platform !== "darwin" && (a.quit(), s = null);
});
a.on("activate", () => {
  R.getAllWindows().length === 0 && u();
});
a.whenReady().then(() => {
  r.handle("note:insert", async (t, e) => i.insertNote(e)), r.handle("note:update", async (t, e) => i.updateNote(e)), r.handle("note:delete", async (t, e) => {
    i.deleteNote(e);
  }), r.handle("note:getOne", async (t, e) => i.getOneNote(e)), r.handle("note:getAll", async () => i.getAllNotes()), u();
});
export {
  F as MAIN_DIST,
  h as RENDERER_DIST,
  m as VITE_DEV_SERVER_URL
};
