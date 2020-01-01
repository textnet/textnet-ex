import { Storage } from "./storage"
import { Persistence } from "./persist";

/* NB: Caching is currently disabled because why not */


export class Repository<T> {
    persistence: Persistence;
    storage: Storage;
    cache: Record<string, T>;
    prefix: string;

    constructor(persistence: Persistence, prefix) {
        this.persistence = persistence;
        this.cache = {};
        this.prefix = prefix;
    }
    async init() {
        this.storage = new Storage(this.persistence.prefix+this.prefix)
        await this.storage.init();
    }
    async load(id) {
        if (true || !this.cache["id"]) {
            const data = await this.storage.get(id) as T;
            this.cache["id"] = data;
        }
        return this.cache["id"];
    }
    async save(value: T) {
        this.cache[value["id"]] = value;
        await this.storage.set(value["id"], value);
    }
    async remove(id) {
        delete this.cache["id"];
        await this.storage.remove(id);
    }   
    async all() {
        const everything = await this.storage.all();
        const result = {}
        for (let i in everything) {
            result[everything[i]["id"]] = await this.load(everything[i]["id"]);
        }
        return result;
    }
}

