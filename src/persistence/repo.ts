/**
 * Generalised object storage based on an abstracted key-value storage
 */
import { Storage     } from "./storage"
import { Persistence } from "./persist"

import { persistenceId } from "./identity"
import * as remote from "./remote/persistence"

/**
 * Repository of objects with interface <T>.
 * Each object has the "id" field which is used internally as `key`.
 */
export class Repository<T> {
    persistence: Persistence;
    storage: Storage;
    cache: Record<string, T>;
    prefix: string;
    freed: boolean;

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
    free() { 
        this.freed = true;
        this.storage.free() 
    }

    isLocal(id: string) {
        if (!this.persistence.account) {
            return true;
        } else {
            return persistenceId(id) == this.persistence.account.id;
        }
    }

    async load(id: string)   { 
        if (!this.isLocal(id)) {
            // console.log(`REMOTE LOAD(${this.persistence.account.id}.${this.prefix})->`, id)
            const data = await remote.load(this.persistence, this.prefix, id);
            await this.save(data);
        }
        return this.storage.get(id) as T 
    }
    async save(value: T) { 
        this.storage.set(value["id"], value) 
    }
    async remove(id: string) { 
        this.storage.remove(id) 
    }
    async all() { 
        return this.storage.all() as Record<string, T> 
    }
    async local() {
        const all = await this.all();
        const result = {};
        for (let id in all) {
            if (this.isLocal(id)) {
                result[id] = all[id];
            }
        }
        return result;
    }
}

