var u = Object.defineProperty;
var b = (t, e, n) => e in t ? u(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var T = (t, e, n) => b(t, typeof e != "symbol" ? e + "" : e, n);
import { app as a, BrowserWindow as R, ipcMain as r } from "electron";
import { createRequire as w } from "module";
import o from "node:path";
import { fileURLToPath as O } from "url";
import { fileURLToPath as L } from "node:url";
const g = w(import.meta.url), I = g("better-sqlite3"), f = O(import.meta.url), A = process.env.NODE_ENV === "development" ? "./demo_table.db" : o.join(f, "./demo_table.db"), E = new I(A);
E.pragma("journal_mode = WAL");
function S(t) {
  t.exec(`
				CREATE TABLE IF NOT EXISTS Notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_time INTEGER DEFAULT 0
    );
    `);
}
S(E);
const D = { db: E };
class P {
  constructor(e) {
    T(this, "db");
    this.db = e;
  }
  insertNote(e) {
    const n = (/* @__PURE__ */ new Date()).getTime(), d = this.db.prepare(
      "INSERT INTO Notes (title, content, created_time) VALUES (@title, @content, @created_time) RETURNING *"
    ).run({ ...e, created_time: n }), l = this.db.prepare("SELECT * FROM Notes where id = @id").get({
      id: d.lastInsertRowid
    });
    return console.log(l), l;
  }
  updateNote(e) {
    const { title: n, content: p, created_time: d, id: c } = e;
    return this.db.prepare(
      "UPDATE Notes SET title = @title, content = @content, created_time=@created_time WHERE id = @id RETURNING *"
    ).run({ title: n, content: p, created_time: d, id: c }), this.db.prepare("SELECT * FROM Notes where id = @id").get({
      id: c
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
const N = o.dirname(L(import.meta.url)), i = new P(D.db);
process.env.APP_ROOT = o.join(N, "..");
const m = process.env.VITE_DEV_SERVER_URL, q = o.join(process.env.APP_ROOT, "dist-electron"), _ = o.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = m ? o.join(process.env.APP_ROOT, "public") : _;
let s;
function h() {
  s = new R({
    icon: o.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: o.join(N, "preload.mjs")
    },
    width: 500,
    height: 600,
    minHeight: 400,
    maxHeight: 600,
    minWidth: 400,
    maxWidth: 1500
  }), s.webContents.on("did-finish-load", () => {
    s == null || s.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), m ? s.loadURL(m) : s.loadFile(o.join(_, "index.html"));
}
a.on("window-all-closed", () => {
  process.platform !== "darwin" && (a.quit(), s = null);
});
a.on("activate", () => {
  R.getAllWindows().length === 0 && h();
});
a.whenReady().then(() => {
  r.handle("note:insert", async (t, e) => i.insertNote(e)), r.handle("note:update", async (t, e) => i.updateNote(e)), r.handle("note:delete", async (t, e) => {
    i.deleteNote(e);
  }), r.handle("note:getOne", async (t, e) => i.getOneNote(e)), r.handle("note:getAll", async () => i.getAllNotes()), h();
});
export {
  q as MAIN_DIST,
  _ as RENDERER_DIST,
  m as VITE_DEV_SERVER_URL
};
