// import { Storage } from "./storage"
// import { Account, AvatarKind, defaultsArtifact } from "../universe/interfaces"
// import { generateId, registerAccountId, getAccountId } from "./identity"
// import { deepCopy } from "../universe/utils"

// import { AccountStructure } from "./structures"

// import { registerAccount } from "./startup"


// export class Repository {
//     storage: Storage;
//     name:    string;
//     cache: Record<string, any>;
//     skip: string[];

//     constructor(prefix) {
//         this.name = "default";
//         this.storage = new Storage(prefix+name)
//         this.cache = {};
//         this.skip = [];
//     }
//     async init() {
//         await this.storage.init();
//     }
//     async load(id) {
//         if (!this.cache["id"]) {
//             const data = await this.storage.get(id);
//             const result = await this.fromData(data);
//             this.cache["id"] = result;
//         }
//         return this.cache["id"];
//     }
//     async save(id, value) {
//         this.cache["id"] = this.toData(value);
//         await this.storage.set(id, value);
//     }
//     async remove(id) {
//         delete this.cache["id"];
//         await this.storage.remove(id);
//     }
//     async fromData(data) { return {} }
//     async toData(obj) { return {} }
// }

// export class ArtifactRepository extends Repository {
//     constructor(prefix) {
//         super(prefix);
//         this.name = "artifacts";
//     }
//     async fromData(data) {

//     }
// }

// export class Persistence {
//     artifacts: Storage;
//     accounts:  Storage;
//     worlds:    Storage;
//     avatars:   Storage;
//     account:   Account;

//     constructor(prefix?) {
//         if (!prefix) prefix = ""
//         this.artifacts = new Storage(prefix+"artifacts");
//         this.accounts  = new Storage(prefix+"accounts");
//     }

//     async init() {
//         await this.artifacts.init();
//         await this.accounts.init();
        
//        // 
//         let localAccountStructure = await this.accounts.get("");
//         if (!localAccountStructure) {
//             localAccountStructure = await registerAccount(this);
//             this.account = this.accountFrom(localAccountStructure)
//         }

//         // 
//         const artifactStructures = await this.artifacts.all();
//         for (let a in artifactStructures) {
//             const artifact = (new artifactStructures)
//             // attempt at avatar.
//         }
//     }

//     accountFrom(structure) {
//                 if (cacheAccounts[structure["id"]]) return cacheAccounts[structure["id"]];
//         let result = this._copy(structure);
//         result["avatar"] = loadAvatar(structure["avatar"]);
//         cacheAccounts[ result["id"] ] = result as Artifact;
//         return cacheAccounts[ result["id"] ];
//     }

 
// }