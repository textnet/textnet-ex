// can place? etc.

import { deepCopy } from "../../utils"
import { Artifact, World, Position, Dir } from "../../interfaces"
import { Persistence } from "../persist"

import { removeFromWorld, place } from "./place"
import { sendInventory, sendEmptyInventory } from "../interop/send"

export async function pickup(P: Persistence,
                      artifact: Artifact, obj: Artifact) {
    // 1. remove from world
    const hostWorld = await P.worlds.load(obj.hostId);
    await removeFromWorld(P, obj, hostWorld);
    // 2. put into inventory
    artifact.inventoryIds.push(obj.id)
    await P.artifacts.save(artifact);
    // 3. send event
    await sendInventory(P, artifact, obj);
}

export async function putdown(P: Persistence, artifact: Artifact, dir: Dir) {
    if (artifact.inventoryIds.length > 0) {
        const objId = artifact.inventoryIds[artifact.inventoryIds.length-1]
        const obj = await P.artifacts.load(objId);
        const hostWorld = await P.worlds.load(artifact.hostId);
        const artifactPos = hostWorld.artifactPositions[artifact.id];
        let pos = deepCopy(artifactPos);
        pos.x += dir.x*(
            artifact.body.size[0]
            + obj.body.size[0]
            )/2
            -obj.body.offset[0]
            +artifact.body.offset[0];
        pos.y += dir.y*(
            artifact.body.size[1] 
            + obj.body.size[1]
            )/2
            -obj.body.offset[1]
            +artifact.body.offset[1];
        // place if possible
        const placeSuccess = await place(P, obj, hostWorld, pos);
        if (placeSuccess) {
            artifact.inventoryIds.pop();
            await P.artifacts.save(artifact);
            // send event
            if (artifact.inventoryIds.length > 0) {
                const newObjId = artifact.inventoryIds[artifact.inventoryIds.length-1]
                const newObj = await P.artifacts.load(newObjId);
                await sendInventory(P, artifact, newObj);
            } else {
                await sendEmptyInventory(P, artifact);
            }
        }
    }
}
