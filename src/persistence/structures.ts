// import { Account, Avatar, Artifact, World } from "../universe/interfaces"
// import { deepCopy } from "../universe/utils"
// import { Persistence } from "./persistence"

// const cacheArtifacts: Record<string, Artifact> = {}
// const cacheWorlds:    Record<string, World> = {}
// const cacheAvatars:   Record<string, Avatar> = {}
// const cacheAccounts:  Record<string, Account> = {}

// // TODO IF THAT MAKES ANY SENSE?
// function loadArtifact(id) {}
// function loadAvatar(id) {}
// function loadAccount(id) {}

// export class StorageStructure {
//     skip: string[];
//     constructor(persistence: Persistence) { this.skip = []; }
//     _copy(source: any) {
//         const result = {}
//         for (let k in source) {
//             if (this.skip.indexOf(k) < 0) {
//                 result[k] = deepCopy(source[k]);
//             }
//         }
//         return result;
//     }
// }

// export class AccountStructure extends StorageStructure {
//     constructor() {
//         super();
//         this.skip = [ "avatar" ];
//     }
//     get(a: Account) {
//         const result = this._copy(a);
//         result["avatar"] = a.avatar.id;
//         return result;
//     }
//     create(structure) {
//         if (cacheAccounts[structure["id"]]) return cacheAccounts[structure["id"]];
//         let result = this._copy(structure);
//         result["avatar"] = loadAvatar(structure["avatar"]);
//         cacheAccounts[ result["id"] ] = result as Artifact;
//         return cacheAccounts[ result["id"] ];
//     }
// }

// export class ArtifactStructure extends StorageStructure {
//     constructor() {
//         super();
//         this.skip = [ "dispatcher", "actor", "avatar", "worlds" ];
//     }
//     get(a: Artifact) {
//         const result = this._copy(a);
//         result["avatar"] = a.avatar.id;
//         result["worlds"] = [];
//         for (let i in a["worlds"]) {
//             result["worlds"].push( (new WorldStructure().get(a.worlds[i])) )
//         }
//         return result;
//     }
//     create(structure) {
//         if (cacheArtifacts[structure["id"]]) return cacheArtifacts[structure["id"]];
//         let result = this._copy(structure);
//         result["avatar"] = loadAvatar(structure["avatar"]);
//         result["worlds"] = [];
//         for (let i in structure["worlds"]) {
//             result["worlds"].push( (new WorldStructure().create(structure.worlds[i]))  )
//         }
//         cacheArtifacts[ result["id"] ] = result as Artifact;
//         return cacheArtifacts[ result["id"] ];
//     }
// }

// export class AvatarStructure extends StorageStructure {
//     constructor() {
//         super();
//         this.skip = [ "_env", "body", "inventory" ];
//     }
//     get(a: Avatar) {
//         const result = this._copy(a);
//         result["body"] = a.body.id;
//         result["inventory"] = [];
//         for (let i in a["inventory"]) {
//             result["inventory"].push( a.inventory[i].id )
//         }
//         return result;
//     }
//     create(structure) {
//         if (cacheAvatars[structure["id"]]) return cacheAvatars[structure["id"]];
//         let result = this._copy(structure);
//         result["body"] = loadArtifact(structure["body"]);
//         result["inventory"] = [];
//         for (let i in structure["inventory"]) {
//             result["inventory"].push( loadArtifact(structure["inventory"][i]) )
//         }
//         cacheAvatars[ result["id"] ] = result as Avatar;
//         return cacheAvatars[ result["id"] ];
//     }       
// }

// export class WorldStructure extends StorageStructure {
//     constructor() {
//         super();
//         this.skip = [ "owner", "artifacts" ];
//     }
//     get(w: World) {
//         const result = this._copy(w);
//         result["owner"] = w.owner.id;
//         result["artifacts"] = {};
//         for (let k in w.artifacts) {
//             result["artifacts"][k] = w.artifacts[k].id
//         }
//         return result;
//     }
//     create(structure) {
//         if (cacheWorlds[structure["id"]]) return cacheWorlds[structure["id"]];
//         let result = this._copy(structure);
//         result["owner"] = loadArtifact(structure["owner"]);
//         result["artifacts"] = {};
//         for (let k in structure["artifacts"]) {
//             result["artifacts"][k] = loadArtifact(structure["artifacts"][k]);
//         }
//         cacheWorlds[ result["id"] ] = result as World;
//         return cacheWorlds[ result["id"] ];
//     }       
// }

