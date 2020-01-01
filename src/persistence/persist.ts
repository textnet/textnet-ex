import { BrowserWindow } from "electron"

import { Storage } from "./storage"
import { Artifact, Account, World, defaultsArtifact } from "../universe/interfaces"
import { generateId, registerAccountId, getAccountId } from "./identity"
import { deepCopy } from "../universe/utils"

/* TODO: convert to ID-based entities */

import { Repository } from "./repo"

import { PersistenceObserver } from "./observe";
import { interopSetup } from "./interop/setup"

import * as mutateEnter from "./mutate/enter"


import { registerAccount } from "./startup"


export class Persistence {
    prefix: string;
    artifacts: Repository<Artifact>;
    accounts:  Repository<Account>;
    worlds:    Repository<World>;
    config: Storage;

    window?: BrowserWindow;

    account: Account;
    observers: Record<string,PersistenceObserver>;

    constructor(prefix?) {
        this.prefix    = prefix || "";
        this.artifacts = new Repository<Artifact>(this, "artifacts");
        this.accounts  = new Repository<Account>(this, "account");
        this.worlds    = new Repository<World>(this, "world");
        this.config    = new Storage(this.prefix+"storage");
    }

    attachWindow(window: BrowserWindow) {
        this.window = window;
    }

    async init() {
        await this.artifacts.init();
        await this.accounts.init();
        await this.worlds.init();
        await this.config.init();

        interopSetup(this);
        
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
        const artifacts = await this.artifacts.all()
        for (let id in artifacts) {
            this.observers[id] = new PersistenceObserver(this, id);
            await this.observers[id].attempt();
        }
    }

    async free() {
        // account
        const accountBody = await this.artifacts.load(this.account.bodyId);
        const worldId = accountBody.hostId;
        const world: World = await this.worlds.load(worldId);
        await mutateEnter.leaveWorld(this, accountBody, world, false);
        // observers
        for (let id in this.observers) {
            this.observers[id].free();
        }
    }
}