import * as storage from "node-persist"
import * as Database from "better-sqlite3"

export class Storage {
    private db;
    private kind: string;
    private s;
    private statements: Record<string, Database.Statement>;
    constructor(kind: string) {
        this.kind = kind;
        this.db = new Database("./.persistence/"+kind+".db", {
            // verbose: console.log
        })
    }
    init() {
        this.statements = {};
        this.statements["create"] = this.db.prepare(`
            CREATE TABLE IF NOT EXISTS items (
                id TEXT NOT NULL UNIQUE,
                data TEXT DEFAULT ''
            )`)
        this.statements["create"].run();
        this.statements["get"] = this.db.prepare(`
            SELECT id, data FROM items WHERE id=?`);
        this.statements["set"] = this.db.prepare(`
            REPLACE INTO items (id, data) VALUES (?,?)`);
        this.statements["remove"] = this.db.prepare(`
            DELETE FROM items WHERE id=?`);
        this.statements["clear"] = this.db.prepare(`
            DELETE FROM items`);
        this.statements["all"] = this.db.prepare(`
            SELECT id, data FROM items`);
    }
    set( key: string, value: any) {
        // console.log(`Write => ${this.kind} [${key}].`);
        const data = JSON.stringify(value);
        const result = this.statements["set"].run(key, data)
        return result;
    }
    get( key: string ) {
        // console.log(`Load  <= ${this.kind} [${key}].`);
        const raw = this.statements["get"].get(key)
        if (raw == undefined) return raw;
        const result = JSON.parse(raw.data);
        return result;
    }
    remove( key: string ) {
        return this.statements["remove"].run(key);
    }
    clear() {
        return this.statements["clear"].run();
    }
    all() {
        const raw = this.statements["all"].all();
        let result = {};
        for (let o of raw) {
            result[o.id] = JSON.parse(o.data);
        }
        return result;
    }
    free() {
        this.db.close();
    }
}
