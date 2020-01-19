/**
 * Local persistence module.
 */
import { BrowserWindow } from "electron"

import { deepCopy                                   } from "../utils"
import { Artifact, Account, World, defaultsArtifact } from "../interfaces"
import { Storage                                    } from "./storage"
import { generateId, registerAccountId              } from "./identity"
import { Repository                                 } from "./repo"
import { registerAccount                            } from "./startup"
import { PersistenceObserver                        } from "./observe/observer";

import * as mutateEnter from "./mutate/enter"
import { interopSetup } from "./interop/setup"

import * as remote from "./remote/persistence"

/**
 * Asynchronous Local Persistence. 
 * Provides local persistent storage for artifacts, worlds, and accounts.
 */
export class Persistence {
    prefix: string;
    artifacts: Repository<Artifact>;
    accounts:  Repository<Account>;
    worlds:    Repository<World>;
    config: Storage;
    isSilent: boolean;

    window?: BrowserWindow;

    account: Account;
    observers: Record<string,PersistenceObserver>;

    constructor(prefix?) {
        this.prefix    = prefix || "";
        this.artifacts = new Repository<Artifact>(this, "artifacts");
        this.accounts  = new Repository<Account>(this, "accounts");
        this.worlds    = new Repository<World>(this, "worlds");
        this.config    = new Storage(this.prefix+"storage");
        this.isSilent  = false;
    }

    /**
     * Make a connection between persistence and window.
     * If there is a connection, then persistence shoots
     * events to update renderer in that window.
     * @param {BrowserWindow} window
     */
    attachWindow(window: BrowserWindow) {
        this.window = window;
    }

    async init() {
        this.artifacts.init();
        this.accounts.init();
        this.worlds.init();
        this.config.init();
        // 
        interopSetup(this);
        // get account or create one if there is none.
        let localId = await this.config.get("localId");
        if (localId == undefined) {
            const account = await registerAccount(this);
            await this.config.set("localId", account.id);
            localId = account.id;
        }
        this.account = await this.accounts.load(localId);
        // get all available (local) artifacts and make observers for them
        this.observers = {};
        const artifacts = await this.artifacts.local()
        for (let id in artifacts) {
            this.observers[id] = new PersistenceObserver();
            this.observers[id].init(this, id)
            await this.observers[id].attempt();
        }
        //
        remote.register(this);
    }

    async free() {
        // account
        this.window = null;
        const accountBody = await this.artifacts.load(this.account.bodyId);
        const worldId = accountBody.hostId;
        const world: World = await this.worlds.load(worldId);
        await mutateEnter.disconnect(this, accountBody, world);
        // observers
        for (let id in this.observers) {
            await this.observers[id].free();
        }
        // close db
        this.artifacts.free();
        this.accounts.free();
        this.worlds.free();
        this.config.free();
    }
}