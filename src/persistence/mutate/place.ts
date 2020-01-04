// can place? etc.

import { deepCopy } from "../../universe/utils"

import { Artifact, World, Position } from "../../universe/interfaces"
import { Persistence } from "../persist"

import { sendPlaceArtifact, sendInsertArtifact, sendRemoveArtifact } from "../interop/send"



// fit if there is space
export async function place(P: Persistence,
                      artifact: Artifact, world: World, position: Position) {
    await force(P, artifact, world, position);
    return true;
}

// fit to the closest available space
export async function fit(P: Persistence,
                      artifact: Artifact, world: World, position: Position) {
    await force(P, artifact, world, position);
    return true;
}

export async function force(P: Persistence,
                      artifact: Artifact, world: World, position: Position) {
    let prevWorldId;
    if (!artifact.hostId || artifact.hostId != world.id) {
        if (artifact.hostId) {
            const hostWorld = await P.worlds.load(artifact.hostId);
            await removeFromWorld(P, artifact, hostWorld);    
        }
        await insertIntoWorld(P, artifact, world, position);
    } else {
        await updateInWorld(P, artifact, world, position);
    }
}

// technical, don't use directly
export async function removeFromWorld(P: Persistence, artifact: Artifact, world: World) {
    artifact.visits[ world.id ] = deepCopy(world.artifactPositions[ artifact.id ])
    delete world.artifactPositions[ artifact.id ];    
    artifact.hostId = null;
    await P.worlds.save(world);
    await P.artifacts.save(artifact);
    // console.log("Visits Remove:", artifact.visits, artifact.visitsStack)
    // sent event to renderer
    await sendRemoveArtifact(P, artifact, world);
}

// technical, don't use directly
export async function insertIntoWorld(P: Persistence, artifact: Artifact, 
                                      world: World, pos: Position) {
    world.artifactPositions[ artifact.id ] = deepCopy(pos)
    artifact.hostId = world.id;
    artifact.visits[ world.id ] = deepCopy(pos)
    await P.worlds.save(world);
    await P.artifacts.save(artifact);
    // send event to renderer
    // console.log("Visits Insert:", artifact.visits, artifact.visitsStack)
    await sendInsertArtifact(P, artifact, pos);
}

// technical, don't use directly
export async function updateInWorld(P: Persistence, artifact: Artifact, 
                                      world: World, pos: Position) {
    world.artifactPositions[ artifact.id ] = deepCopy(pos)
    await P.worlds.save(world);
    // send event to renderer
    await sendPlaceArtifact(P, artifact, pos);
}