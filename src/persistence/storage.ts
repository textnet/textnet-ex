import * as storage from "node-persist"

export class Storage {
    private s;
    private kind: string;
    constructor(kind: string) {
        this.kind = kind;
        this.s = storage.create({ 
            dir: "./.persistence/"+kind,
            stringify: (value, replacer, space) => 
                       { return JSON.stringify(value, replacer, "  ") },
        });
    }
    async init() {
        await this.s.init();
    }
    async set( key: string, value: any) {
        console.log(`Writing to storage   ${this.kind} [${key}].`);
        const result = await this.s.setItem(key, value);
        return result;
    }
    async get( key: string ) {
        console.log(`Loading from storage ${this.kind} [${key}].`);
        const result = await this.s.getItem(key);
        return result;
    }
    async remove( key: string ) {
        return await this.s.removeItem(key);
    }
    async clear() {
        return await this.s.clear();
    }
    async all() {
        return await this.s.values();
    }
}
