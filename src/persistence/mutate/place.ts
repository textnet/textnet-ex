// can place? etc.

import { Artifact, World, Position } from "../../universe/interfaces"
import { Persistence } from "../persist"

export async function place(P: Persistence,
                      artifact: Artifact, world: World, position: Position) {
    await force(P, artifact, world, position);
    return true;
}

export async function force(P: Persistence,
                      artifact: Artifact, world: World, position: Position) {
    let prevWorldId;
    if (artifact.coords) {
        prevWorldId = artifact.coords.world.id;
    }
    // worlds
    if (prevWorldId && prevWorldId != world.id) {
        remove(P, artifact);
    }
    // adjust artifact
    artifact.coords = {
        world: world,
        position: position,
    }
    await P.artifacts.save(artifact);
    // artifact positioning
    if (prevWorldId && prevWorldId != world.id) {
        insert(P, artifact);
    }
}

export async function remove(P: Persistence, artifact: Artifact) {
    let world = artifact.coords.world;
    delete world.artifacts[ artifact.id ];
    await P.worlds.save(world);
}

export async function insert(P: Persistence, artifact: Artifact) {
    let world = artifact.coords.world;
    world.artifacts[ artifact.id ] = artifact;
    await P.worlds.save(world);
}
