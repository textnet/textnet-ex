import { Storage } from "./storage"
import { Artifact, Account, defaultsArtifact } from "../universe/interfaces"
import { generateId, registerAccountId, getAccountId } from "./identity"
import { deepCopy } from "../universe/utils"

import { ArtifactRepository, AccountRepository, WorldRepository } from "./repo"

import { PersistenceObserver } from "./observe";

import { registerAccount } from "./startup"


export class Persistence {
    prefix: string;
    artifacts: ArtifactRepository;
    accounts:  AccountRepository;
    worlds:    WorldRepository;
    config: Storage;

    account:   Account;
    observers: Record<string,PersistenceObserver>;

    constructor(prefix?) {
        this.prefix    = prefix || "";
        this.artifacts = new ArtifactRepository(this);
        this.accounts  = new AccountRepository(this);
        this.worlds    = new WorldRepository(this);
        this.config    = new Storage(prefix+"storage");
    }

    async init() {
        await this.artifacts.init();
        await this.accounts.init();
        await this.worlds.init();
        await this.config.init();
        
        // get account or create one if there is none.
        let localId = await this.config.get("localId");
        if (!localId) {
            const account = await registerAccount(this);
            await this.config.set("localId", account.id);
            localId = account.id;
        }
        this.account = await this.accounts.load(localId);

        // get all available (local) artifacts and make observers for them
        this.observers = {};
        const localArtifacts = await this.artifacts.allLocal()
        for (let i in localArtifacts) {
            this.observers[(localArtifacts[i] as Artifact).id] = new PersistenceObserver(localArtifacts[i]);
        }
    }
}