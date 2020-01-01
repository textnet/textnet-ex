// can place? etc.

import { deepCopy } from "../../universe/utils"

import { Artifact, World, Position } from "../../universe/interfaces"
import { Persistence } from "../persist"

import { sendPlaceArtifact, sendInsertArtifact } from "../interop/send"

// fit if there is space
export async function place(P: Persistence,
                      artifact: Artifact, world: World, position: Position) {
    await force(P, artifact, world, position);
    return deepCopy(position);
}

// fit to the closest available space
export async function fit(P: Persistence,
                      artifact: Artifact, world: World, position: Position) {
    await force(P, artifact, world, position);
    return deepCopy(position);
}

export async function force(P: Persistence,
                      artifact: Artifact, world: World, position: Position) {
    let prevWorldId;
    if (!artifact.hostId || artifact.hostId != world.id) {
        removeFromWorld(P, artifact, world);
        await insertIntoWorld(P, artifact, world, position);
    } else {
        await updateInWorld(P, artifact, world, position);
    }
    
}


// technical, don't use directly
export async function removeFromWorld(P: Persistence, artifact: Artifact, world: World) {
    if (artifact.hostId) {
        let hostWorld: World = await P.worlds.load(artifact.hostId);
        delete hostWorld.artifactPositions[ artifact.id ];
        await P.worlds.save(hostWorld);
    }
    delete world.artifactPositions[ artifact.id ];
    artifact.hostId = null;
    await P.worlds.save(world);
    await P.artifacts.save(artifact);
    // sent event to renderer
}

// technical, don't use directly
export async function insertIntoWorld(P: Persistence, artifact: Artifact, 
                                      world: World, pos: Position) {
    world.artifactPositions[ artifact.id ] = deepCopy(pos)
    artifact.hostId = world.id;
    await P.worlds.save(world);
    await P.artifacts.save(artifact);
    // send event to renderer
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