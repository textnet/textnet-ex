import { Storage } from "./storage"
import { Persistence } from "./persist";

export class Repository<T> {
    persistence: Persistence;
    storage: Storage;
    cache: Record<string, T>;
    prefix: string;

    constructor(persistence: Persistence, prefix) {
        this.persistence = persistence;
        this.prefix = prefix;
    }
    init() {
        this.storage = new Storage(this.persistence.prefix+this.prefix)
        this.storage.init();
    }
    async load(id) {
        return this.storage.get(id) as T;
    }
    async save(value: T) {
        this.storage.set(value["id"], value);
    }
    async remove(id) {
        this.storage.remove(id);
    }   
    async all() {
        return this.storage.all() as Record<string, T>[];
    }
    free() {
        this.storage.free()
    }
}

