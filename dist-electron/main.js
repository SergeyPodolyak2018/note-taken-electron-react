var w = Object.defineProperty;
var b = (t, e, o) => e in t ? w(t, e, { enumerable: !0, configurable: !0, writable: !0, value: o }) : t[e] = o;
var R = (t, e, o) => b(t, typeof e != "symbol" ? e + "" : e, o);
import { app as a, BrowserWindow as m, ipcMain as r } from "electron";
import { createRequire as O } from "module";
import s from "node:path";
import { fileURLToPath as g } from "node:url";
const N = O(import.meta.url), I = N("better-sqlite3"), { app: L } = N("electron"), f = process.env.NODE_ENV === "development" ? "./demo_table.db" : s.resolve(L.getPath("userData"), "myDatabase.db"), T = new I(f);
T.pragma("journal_mode = WAL");
function D(t) {
  t.exec(`
				CREATE TABLE IF NOT EXISTS Notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_time INTEGER DEFAULT 0
    );
    `);
}
D(T);
const A = { db: T };
class S {
  constructor(e) {
    R(this, "db");
    this.db = e;
  }
  insertNote(e) {
    const o = (/* @__PURE__ */ new Date()).getTime(), c = this.db.prepare(
      "INSERT INTO Notes (title, content, created_time) VALUES (@title, @content, @created_time) RETURNING *"
    ).run({ ...e, created_time: o }), l = this.db.prepare("SELECT * FROM Notes where id = @id").get({
      id: c.lastInsertRowid
    });
    return console.log(l), l;
  }
  updateNote(e) {
    const { title: o, content: h, created_time: c, id: d } = e;
    return this.db.prepare(
      "UPDATE Notes SET title = @title, content = @content, created_time=@created_time WHERE id = @id RETURNING *"
    ).run({ title: o, content: h, created_time: c, id: d }), this.db.prepare("SELECT * FROM Notes where id = @id").get({
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
const u = s.dirname(g(import.meta.url)), i = new S(A.db);
process.env.APP_ROOT = s.join(u, "..");
const E = process.env.VITE_DEV_SERVER_URL, M = s.join(process.env.APP_ROOT, "dist-electron"), p = s.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = E ? s.join(process.env.APP_ROOT, "public") : p;
let n;
function _() {
  n = new m({
    icon: s.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: s.join(u, "preload.mjs")
    },
    width: 500,
    height: 600,
    minHeight: 400,
    maxHeight: 600,
    minWidth: 400,
    maxWidth: 1500,
    show: !1
  });
  const t = new m({
    width: 500,
    height: 300,
    transparent: !0,
    frame: !1,
    alwaysOnTop: !0
  });
  t.loadFile(s.join(p, "loader.html")), t.center(), n.webContents.on("did-finish-load", () => {
    n == null || n.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), E ? n.loadURL(E) : n.loadFile(s.join(p, "index.html")), setTimeout(function() {
    t.close(), n == null || n.show();
  }, 5e3);
}
a.on("window-all-closed", () => {
  process.platform !== "darwin" && (a.quit(), n = null);
});
a.on("activate", () => {
  m.getAllWindows().length === 0 && _();
});
a.whenReady().then(() => {
  r.handle("note:insert", async (t, e) => i.insertNote(e)), r.handle("note:update", async (t, e) => i.updateNote(e)), r.handle("note:delete", async (t, e) => {
    i.deleteNote(e);
  }), r.handle("note:getOne", async (t, e) => i.getOneNote(e)), r.handle("note:getAll", async () => i.getAllNotes()), _();
});
export {
  M as MAIN_DIST,
  p as RENDERER_DIST,
  E as VITE_DEV_SERVER_URL
};
