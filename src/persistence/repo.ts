/**
 * Generalised object storage based on an abstracted key-value storage
 */
import { Storage     } from "./storage"
import { Persistence } from "./persist";

/**
 * Repository of objects with interface <T>.
 * Each object has the "id" field which is used internally as `key`.
 */
export class Repository<T> {
    persistence: Persistence;
    storage: Storage;
    cache: Record<string, T>;
    prefix: string;

    /**
     * Link to Persistence, differentiate with additional prefix.
     * Call `init()` before using any other method 
     * @param {Persistence} persistence
     * @param {string}      prefix
     */
    constructor(persistence: Persistence, prefix: string) {
        this.persistence = persistence;
        this.prefix = prefix;
    }
    init() {
        this.storage = new Storage(this.persistence.prefix+this.prefix)
        this.storage.init();
    }
    free() { this.storage.free() }

    async load(id: string)   { return this.storage.get(id) as T }
    async save(value: T)     { this.storage.set(value["id"], value) }
    async remove(id: string) { this.storage.remove(id) }
    async all()              { return this.storage.all() as Record<string, T>[] }
}

