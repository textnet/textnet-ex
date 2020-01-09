
import { Artifact, Account, World, defaultsArtifact } from "../universe/interfaces"
import { deepCopy } from "../universe/utils"

import { PersistenceObserver } from "../persistence/observe/observer"

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
}

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