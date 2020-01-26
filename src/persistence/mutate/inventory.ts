// can place? etc.

import { deepCopy } from "../../utils"
import { Artifact, Dir } from "../../interfaces"
import { Persistence } from "../persist"

import { removeFromWorld, place } from "./place"
import { sendInventory, sendEmptyInventory } from "../interop/send"

import { artifactPickup, artifactPutdown } from "./local/artifact"
import { worldPickup, worldPutdown } from "./local/world"

export async function pickup(P: Persistence,
                      artifact: Artifact, obj: Artifact) {
    const hostWorld = await P.worlds.load(obj.hostId);
    await removeFromWorld(P, obj, hostWorld);
    await artifactPickup(P, artifact, obj.id);
    await worldPickup(P, hostWorld, artifact.id, obj.id); // before for event!
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
            await artifactPutdown(P, artifact);
            await worldPutdown(P, hostWorld, artifact.id, obj.id);
        }
    }
}
