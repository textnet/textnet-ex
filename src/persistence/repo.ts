import { Storage } from "./storage"
import { Persistence } from "./persist";
import { Account, Artifact, World } from "../universe/interfaces"
import { deepCopy } from "../universe/utils"


export class Repository {
    persistence: Persistence;
    storage: Storage;
    cache: Record<string, any>;
    name: string;
    skip: string[];

    constructor(persistence: Persistence) {
        this.name = "default";
        this.persistence = persistence;
        this.cache = {};
        this.skip = [];
    }
    _copy(source: any, updateCache?: boolean) {
        const result = {}
        for (let k in source) {
            if (this.skip.indexOf(k) < 0) {
                // console.log(`-> deepcopy ${k}`)
                result[k] = deepCopy(source[k]);
            }
        }
        if (updateCache) { this.cache["id"] = result; }
        return result;
    }
    async init() {
        this.storage = new Storage(this.persistence.prefix+this.name)
        await this.storage.init();
    }
    async load(id) {
        if (!this.cache["id"]) {
            const data = await this.storage.get(id); // should we always do that? check.
            const result = await this.fromData(data);
            this.cache["id"] = result;
        }
        return this.cache["id"];
    }
    async save(value) {
        this.cache[value["id"]] = value;
        const data = this.toData(value);
        await this.storage.set(value["id"], data);
    }
    async remove(id) {
        delete this.cache["id"];
        await this.storage.remove(id);
    }
    async fromData(data) { return {} }
    toData(obj) { return {} }

    async allLocal() {
        const everything = await this.storage.all();
        const result = {}
        for (let i in everything) {
            if (everything[i]["local"]) {
                result[everything[i]["id"]] = await this.load(everything[i]["id"]);
            }
        }
        return result;
    }
}



export class ArtifactRepository extends Repository {
    constructor(persistence: Persistence) {
        super(persistence);
        this.name = "artifacts";
        this.skip = [ "dispatcher", "actor", "worlds", "_env", "_emitter",
                      "inventory", "player", "updateTimeout",
                      "coords" ];
    }
    async load(id) {
        return await super.load(id) as Artifact;
    }

    async fromData(data) {
        const result = this._copy(data, true);
        // get worlds
        result["worlds"] = {};
        for (let i in data["worlds"]) {
            result["worlds"][i] = await this.persistence.worlds.load(data["worlds"][i])
        }
        // get inventory
        result["inventory"] = [];
        for (let i in data["inventory"]) {
            result["inventory"].push( await this.load(data["inventory"][i]) );
        }
        // get player
        if (data["player"]) {
            result["player"] = await this.persistence.accounts.load(data["player"])
        }
        // get coords
        if (data["coords"]) {
            result["coords"] = {
                world: await this.persistence.worlds.load(result["coords"]["world"]),
                position: deepCopy(result["coords"]["position"])
            }
        }
        return result;
    }

    toData(obj: Artifact) {
        const result = this._copy(obj);
        // console.log("=> _copy result:", result)
        // worlds
        result["worlds"] = [];
        for (let i in obj.worlds) {
            result["worlds"].push( obj.worlds[i].id );
        }
        // inventory
        result["inventory"] = [];
        for (let i in obj.inventory) {
            result["inventory"].push( obj.inventory[i].id )
        }
        // player
        if (obj.player) {
            result["player"] = obj.player.id;
        }
        // coords
        if (obj.coords) {
            result["coords"] = {
                world: obj.coords.world.id,
                position: deepCopy(obj.coords.position)
            }
        }
        return result;
    }
}

export class WorldRepository extends Repository {
    constructor(persistence: Persistence) {
        super(persistence);
        this.name = "worlds";
        this.skip = [ "artifacts", "owner" ];
    }
    async load(id) {
        return await super.load(id) as World;
    }
    async fromData(data) {
        const result = this._copy(data, true);
        result["owner"] = await this.persistence.artifacts.load(data["owner"])
        result["artifacts"] = {}
        for (let k in data["artifacts"])
            result["artifacts"][k] = await this.persistence.artifacts.load(k);
        return result;
    }
    toData(obj) {
        const result = this._copy(obj);
        result["owner"] = obj.owner.id;
        result["artifacts"] = {}
        for (let k in obj["artifacts"])
            result["artifacts"][k] = k;
        return result;
    }

}

export class AccountRepository extends Repository {
    constructor(persistence: Persistence) {
        super(persistence);
        this.name = "accounts";
        this.skip = [ "body" ];
    }
    async load(id) {
        return await super.load(id) as Account;
    }

    async fromData(data) {
        const result = this._copy(data, true);
        result["body"] = await this.persistence.artifacts.load(data["body"])//
        return result;
    }

    toData(obj) {
        const result = this._copy(obj);
        result["body"] = obj.body.id;
        return result;
    }
}

