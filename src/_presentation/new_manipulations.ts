// import { ipcRenderer } from "electron";

// import {
//     Position, Dir, Coordinates,
//     Artifact, World, 
//     Account
// } from "../interfaces"


// export function enterWorld(avatar:Artifact, world:World) {
//     ipcRenderer.send("enter", {
//         avatarId: avatar.id,
//         artifactId: world.owner.id,
//         worldId: world.id,
//     })
// }
// export function leaveWorld(avatar:Artifact) {
//     ipcRenderer.send("leave", {
//         avatarId: avatar.id,
//     })
// }

// export function pickupArtifact(avatar: Artifact, artifact: Artifact) {
//     ipcRenderer.send("pickup", {
//         avatarId: avatar.id,
//         artifactId: artifact.id,
//     })
// }

// export function putdownArtifact(avatar: Artifact, dir: Dir) {
//     ipcRenderer.send("putdown", {
//         avatarId: avatar.id,
//         dir: dir,
//     })
// }

// export function removeArtifact(artifact: Artifact) {
//     ipcRenderer.send("remove", {
//         artifactId: artifact.id,
//     })
// }

// export function placeArtifact(artifact: Artifact, coords: Coordinates) {
//     if (artifact.coords && artifact.coords.world.id != coords.world.id) {
//         removeArtifact(artifact);
//     }
//     //
//     ipcRenderer.send("place", {
//         artifactId: artifact.id,
//         targetArtifactId: coords.world.owner.id,
//         position: coords.position,
//     })
// }

// export function pushArtifact(artifact: Artifact, pusher: Artifact, dir: Dir) {
//     ipcRenderer.send("push", {
//         artifactId: artifact.id,
//         pusherId: pusher.id,
//         dir: dir,
//     })
// }

// export function updateArtifactPosition(artifact: Artifact, newPosition: Position) {
//     ipcRenderer.send("position", {
//         artifactId: artifact.id,
//         position: newPosition,
//     }) 
// }

// // full text & recompile
// export function updateWorldText(world: World, text?: string, compile?:boolean) {
//     ipcRenderer.send("text", {
//         artifactId: world.owner.id,
//         worldId: world.id,
//         text: text,
//         compile: compile
//     })    
// }

// export function updateArtifactProperties(artifact: Artifact, properties) {
//     ipcRenderer.send("properties", {
//         artifactId: artifact.id,
//         properties: properties
//     })    
// }

// export function updateArtifactText(artifact: Artifact, text?:string, compile?:boolean) {
//     // it is just a convenience shortcut
//     updateWorldText(artifact.worlds[0], text, compile)
// }

