
import { Persistence } from "../persist"
import { fit, removeFromWorld } from "./place"

import { spawnPosition } from "../../universe/const"
import { Position, Artifact, World } from "../../universe/interfaces"
import { deepCopy } from "../../universe/utils"

export async function enterWorld(P: Persistence, artifact: Artifact, world: World) {
    console.log(`Enter world: ${artifact.name} -> ${world.id}`);
    // adjust artifact
    if (!artifact.visits[ world.id ]) {
        artifact.visits[ world.id ] = deepCopy(spawnPosition);
    }
    artifact.visitsStack.push( world.id );
    await P.artifacts.save(artifact);
    // fit to the closest available place (always possible)
    await fit(P, artifact, world, artifact.visits[ world.id ]);
}

export async function leaveWorld(P: Persistence, artifact: Artifact, world: World, 
                                 saveHistory: boolean) {
    if (artifact.visitsStack.length > 1 
        && world.id == artifact.visitsStack[artifact.visitsStack.length-1]) {
        // adjust artifact
        if (saveHistory) {
            artifact.visitsStack.pop();
            await P.artifacts.save(artifact);
        }
        // adjust world
        removeFromWorld(P, artifact, world);
//        await removeFromWorld(P, arr)
    }
}