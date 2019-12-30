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
            const data = await this.storage.get(id);
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
            if (everything[i]["value"]["local"]) {
                result[everything[i]["key"]] = this.load(everything[i]["value"]["id"]);
            }
        }
        return result;
    }
}



export class ArtifactRepository extends Repository {
    constructor(persistence: Persistence) {
        super(persistence);
        this.name = "artifacts";
        this.skip = [ "dispatcher", "actor", "worlds", "_env", "_eventTarget",
                      "inventory", "player", ];
    }
    async load(id) {
        return await super.load(id) as Artifact;
    }

    async fromData(data) {
        const result = this._copy(data, true);
        // get worlds
        result["worlds"] = {};
        for (let i in data["worlds"]) {
            const world: World = {
                id: data["worlds"][i].id,
                text: data["worlds"][i].text,
                owner: data["worlds"][i].owner,
                artifacts: {},
            }
            for (let k in data["worlds"][i].artifacts) {
                world.artifacts[k] = await this.load(data["worlds"][i].artifacts[k]);
            }
            result["worlds"][i] = world;
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
        return result;
    }

    toData(obj) {
        const result = this._copy(obj);
        // console.log("=> _copy result:", result)
        result["worlds"] = [];
        for (let i in obj["worlds"]) {
            let worldData = {
                owner: obj.id,
                id: obj["worlds"][i].id,
                text: obj["worlds"][i].text,
                artifacts: {}
            }
            for (let k in obj["worlds"][i].artifacts) {
                result["artifacts"][k] = obj["worlds"][i].artifacts[k].id
            }
            result["worlds"].push(worldData);
        }
        result["inventory"] = [];
        for (let i in obj["inventory"]) {
            result["inventory"].push( obj.inventory[i].id )
        }
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

