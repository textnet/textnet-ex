// import { ipcRenderer } from "electron";

// import {
//     Position, Dir, Coordinates,
//     Artifact, World, 
//     Account
// } from "../interfaces"
// import { cpCoords, cpPosition } from "../utils"
// import { spawnPosition, DIR, DIRfrom, 
//          universeUpdateProbability, universeUpdateDelay } from "../const"
// import { isOverlap, artifactBox } from "../getters"

// /**
//  * Functions that manipulate the universe in a proper manner.
//  * One shouldn't alter any of the structures (e.g. Artifacts)
//  * in any way except calling those functions.
//  *
//  * The goal of such approach is to guarantee that all dependencies
//  * handled properly and all necessary messages are emitted.
//  */
    

// /**
//  * Artifact avatar enters the world that belongs to an Artifact.
//  * A convenience function, uses `enterWorld` internally.
//  * @param {Artifact} avatar
//  * @param {Artifact} artifact
//  */
// export function enterArtifact(avatar:Artifact, artifact:Artifact) {
//     return enterWorld(avatar, artifact.worlds[0]);
// }

// /**
//  * Artifact avatar enters a World.
//  * It artifact is removed from the world it currently inhabits,
//  * and placed into the new world.
//  * Visits stack is maintainted.
//  * @param {Artifact} avatar
//  * @param {World} world
//  */
// export function enterWorld(avatar:Artifact, world:World) {
//     ipcRenderer.send("enter", {
//         avatarId: avatar.id,
//         artifactId: world.owner.id,
//         worldId: world.id,
//     })

//     // EVENT: avatar:enter
//     if (avatar.coords) {
//         avatar.visits[avatar.coords.world.id] = cpCoords(avatar.coords);
//     }
//     removeArtifact(avatar);
//     if (!avatar.visits[world.id]) {
//         avatar.visits[world.id] = { position: cpPosition(spawnPosition), world: world };
//      }
//     avatar.visitsStack.push(world.id);
//     placeArtifact(avatar, avatar.visits[world.id]);
// }

// /**
//  * Artifact avatar leaves the World, going up its visits stack.
//  * It artifact is removed from the world it currently inhabits,
//  * and placed into the topmost world from its visits.
//  * @param {Artifact} avatar
//  */
// export function leaveWorld(avatar:Artifact) {
//     ipcRenderer.send("leave", {
//         avatarId: avatar.id,
//     })

//     // EVENT: avatar:leave
//     if (avatar.visitsStack.length > 1) {
//         removeArtifact(avatar);
//         avatar.visitsStack.pop();
//         let prevWorld:string = avatar.visitsStack[avatar.visitsStack.length-1];
//         placeArtifact(avatar, avatar.visits[prevWorld]);
//     }
// }

// /**
//  * Artifact avatar picks an Artifact.
//  * The artifact is removed from the world it placed in, and added to the inventory.
//  * and placed into the topmost world from its visits.
//  * @param {Artifact} avatar
//  * @param {Artifact} artifact
//  */
// export function pickupArtifact(avatar: Artifact, artifact: Artifact) {
//     ipcRenderer.send("pickup", {
//         avatarId: avatar.id,
//         artifactId: artifact.id,
//     })

//     removeArtifact(artifact);
//     avatar.inventory.push(artifact);
//     // emit events
//     // artifact.dispatcher.emit("script:pickup", 
//     //     new ScriptPickupEvent(artifact, avatar));
// }

// /**
//  * Avatar attempts to put down the artifact he has recently picked up.
//  * Direction is provided.
//  * The attempt fails if there is no free place for the artifact.
//  * Does nothing if the inventory is empty.
//  * @param {Artifact} avatar
//  * @param {Dir} dir
//  * @returns {Artifact} or nothing if the attempt is failed.
//  */
// export function putdownArtifact(avatar: Artifact, dir: Dir) {
//     ipcRenderer.send("putdown", {
//         avatarId: avatar.id,
//         dir: dir,
//     })

//     if (avatar.inventory.length > 0) {
//         let coords: Coordinates = cpCoords(avatar.coords);
//         let artifact: Artifact = avatar.inventory.pop();
//         coords.position.x += dir.x*(
//             avatar.body.size[0]
//             + artifact.body.size[0]
//             )/2
//             -artifact.body.offset[0]
//             +avatar.body.offset[0];
//         coords.position.y += dir.y*(
//             avatar.body.size[1] 
//             + artifact.body.size[1]
//             )/2
//             -artifact.body.offset[1]
//             +avatar.body.offset[1];
//         if (tryToPlaceArtifact(artifact, coords)) {
//             // emit events
//             // artifact.dispatcher.emit("script:putdown", 
//             //     new ScriptPutdownEvent(artifact, avatar, 
//             //                            coords.position.x, coords.position.y));
//             return artifact;
//         } else {
//             avatar.inventory.push(artifact)
//         }
//     }
// }

// /**
//  * Removes the artifact from the world it is placed in.
//  * Keeps consistency of both world and artifact structures.
//  * @param {Artifact} artifact
//  */
// export function removeArtifact(artifact: Artifact) {
//     ipcRenderer.send("remove", {
//         artifactId: artifact.id,
//     })

//     if (!artifact.coords) return;
//     // EVENT: world:remove_artifact / artifact: remove
//     delete artifact.coords.world.artifacts[artifact.id];
//     delete artifact.coords;
// }

// *
//  * Forcibly puts the artifact in a world at the given coordinates.
//  * Keeps consistency of both world and artifact structures.
//  * @param {Artifact} artifact
//  * @param {Coordinates} coords
 
// export function placeArtifact(artifact: Artifact, coords: Coordinates) {
//     // EVENT: world:place_artifact / artifact: place
//     if (artifact.coords && artifact.coords.world.id != coords.world.id) {
//         removeArtifact(artifact);
//     }
//     //
//     ipcRenderer.send("place", {
//         artifactId: artifact.id,
//         targetArtifactId: coords.world.owner.id,
//         position: coords.position,
//     })
//     //
//     if (!artifact.coords) artifact.coords = coords;
//     artifact.coords.world = coords.world;
//     updateArtifactPosition(artifact, coords.position)
//     artifact.coords.world.artifacts[artifact.id] = artifact;
// }

// export function pushArtifact(artifact: Artifact, pusher: Artifact, dir: Dir) {
//     ipcRenderer.send("push", {
//         artifactId: artifact.id,
//         pusherId: pusher.id,
//         dir: dir,
//     })

//     let success = false;    
//     let straightDir: Dir = DIRfrom(dir);
//     let newCoords = cpCoords(artifact.coords);
//     let pushStrength = pusher.power / artifact.weight * 2;
//     newCoords.position.x += straightDir.x * pushStrength;
//     newCoords.position.y += straightDir.y * pushStrength;
//     success = tryToPlaceArtifact(artifact, newCoords);
//     // emit events
//     // artifact.dispatcher.emit("script:push", new ScriptPushEvent(artifact, pusher, dir));
//     return success
// }

// /**
//  * Forcibly puts the artifact in a world at the given coordinates.
//  * Keeps consistency of both world and artifact structures.
//  * @param {Artifact} artifact
//  * @param {Coordinates} coords
//  */
// export function tryToPlaceArtifact(artifact: Artifact, coords: Coordinates) {
//     if (isArtifactPlaceable(artifact, coords)) {
//         placeArtifact(artifact, coords);
//         return true;
//     } else {
//         return false;
//     }
// }

// /**
//  * Check is is is possible to place the artifact at the given coordinates.
//  * @param {Artifact} artifact
//  * @param {Coordinates} coords
//  * @returns {boolean}
//  */
// export function isArtifactPlaceable(artifact: Artifact, coords: Coordinates) {
//     for (let i in coords.world.artifacts) {
//         let another:Artifact = coords.world.artifacts[i];
//         if (another.id != artifact.id && isOverlap(artifact, another, coords)) {
//             // console.log("STUCK", artifact.name, another.name)
//             // console.log(artifact.name, artifactBox(artifact, coords))
//             // console.log(another.name, artifactBox(another))
//             return false;
//         }
//     }
//     return true;
// }

// /**
//  * Updates an artifact position in the world it is placed in.
//  * Emits `artifact:move` event that describes the move
//  * Events are currently not used.
//  * @param {Artifact} artifact
//  * @param {Position} newPosition
//  */
// export function updateArtifactPosition(artifact: Artifact, newPosition: Position) {
//     if (!artifact.coords) return;
//     // prep
//     let dx,dy: number;
//     dx = newPosition.x - artifact.coords.position.x;
//     dy = newPosition.y - artifact.coords.position.y;
//     if (dx == 0 && dy == 0) return;
//     //
//     if (artifact.updateTimeout) { clearTimeout(artifact.updateTimeout); }
//     function update() {
//         ipcRenderer.send("position", {
//             artifactId: artifact.id,
//             position: newPosition,
//         }) 
//         clearTimeout(artifact.updateTimeout);
//     }
//     artifact.updateTimeout = setTimeout(update, universeUpdateDelay);
//     if (Math.random() < universeUpdateProbability) { update() }
//     // update locally
//     artifact.coords.position = cpPosition(newPosition);
//     // emit events
//     // artifact.dispatcher.emit("script:move", new ScriptMoveEvent(artifact, dx, dy));
// }


// // full text & recompile
// export function updateWorldText(world: World, text?: string, compile?:boolean) {
//     ipcRenderer.send("text", {
//         artifactId: world.owner.id,
//         worldId: world.id,
//         text: text,
//         compile: compile
//     })    
//     // update universe
//     if (text != undefined) {
//         world.text = text;    
//     }
//     // emit events
//     // world.owner.dispatcher.emit("script:text", 
//     //     new ScriptTextEvent(world.owner, world.text, compile));
// }


// export function updateArtifactProperties(artifact: Artifact, properties) {
//     ipcRenderer.send("properties", {
//         artifactId: artifact.id,
//         properties: properties
//     })    
//     // update universe
//     for (let key in properties) {
//         if (properties[key] != undefined) {
//             artifact[key] = properties[key];
//         }
//     }
//     // emit events
//     // if (artifact.dispatcher) {       
//     //     artifact.dispatcher.emit("script:properties", 
//     //         new ScriptPropertiesEvent(artifact, properties));
//     // }
// }

// export function updateArtifactText(artifact: Artifact, text?:string, compile?:boolean) {
//     // it is just a convenience shortcut
//     updateWorldText(artifact.worlds[0], text, compile)
// }

