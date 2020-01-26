/**
 * Synchronous dump of the Persistence to be used in Written Word.
 * Either Fengari Lua VM lacks in sophistication of yield/resume,
 * or TextNet authors did not get how to operate async/await with Lua.
 *
 * Thus, there is a simple read-only proxy layer to Persistence.
 * This proxy layer must be updated each time when the corresponding
 * async Persistence is changed.
 *
 * The simplest implementation is to preload everything everytime.
 */

import { Artifact, World } from "../interfaces"
import { PersistenceObserver } from "../persistence/observe/observer"

/**
 * Synchronous read-only version of the async Persistence Repository.
 * The simplest implementation is to preload everything everytime.
 */
export class SyncRepository<T> {
    P: SyncWrittenPersistence;
    contents: Record<string,T>;
    constructor(P : SyncWrittenPersistence) {
        this.P = P;
    }
    setup(contents: Record<string,T>) {
        this.contents = contents;
    }
    load(id: string) {
        return this.contents[id];
    }
    directory() {
        console.log("Directory>", this.P.observer.ownerId)
        for (let i in this.contents) {
            console.log("         >", i, this.contents[i]["name"]);
        }
    }
    update(o: any) {
        this.contents[o.id] = o;
    }
}

/**
 * Syncronous read-only version of the async Persistence.
 * The simplest implementation is to preload everything everytime.
 */
export class SyncWrittenPersistence {
    observer:  PersistenceObserver;
    artifacts: SyncRepository<Artifact>;
    worlds:    SyncRepository<World>;
    constructor(observer: PersistenceObserver) {
        this.observer = observer;
        this.artifacts = new SyncRepository<Artifact>(this);
        this.worlds    = new SyncRepository<World>(this);
    }
}