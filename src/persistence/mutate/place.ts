// can place? etc.

import { deepCopy } from "../../universe/utils"

import { Artifact, World, Position } from "../../universe/interfaces"
import { Persistence } from "../persist"
import { isPlaceable, isInBounds } from "./spatial"

import { sendPlaceArtifact, sendInsertArtifact, sendRemoveArtifact } from "../interop/send"



// fit if there is space
export async function place(P: Persistence,
                      artifact: Artifact, world: World, position: Position) {
    console.log("mutate place", artifact.name, `(${artifact.id    })`, position)
    if (await isPlaceable(P, artifact, world, position) 
            && isInBounds(position, artifact.body.size)) {
        await force(P, artifact, world, position);
        return true;
    } else {
        return false;
    }
}

// fit to the closest available space
export async function fit(P: Persistence,
                      artifact: Artifact, world: World, position: Position) {
    let success = await place(P, artifact, world, position);
    let size = 0;
    let pos = deepCopy(position);
    // 1. в каком порядке проверять?
    while (!success) {
        // build positions for one round
        // 1. step down.
        size++;
        let sequence = [];
        pos = shiftPos( pos, artifact.body.size, 0, 1 );
        sequence.push( pos );
        // 2. go right (size times)
        for (let i=0; i<size; i++) {
            sequence.push(shiftPos( pos, artifact.body.size, i+1, 0 ))
        }
        // 3. go up (size+1+size)
        for (let i=0; i<size*2+1; i++) {
            sequence.push(shiftPos( pos, artifact.body.size, size, -i ))
        }
        // 4. go left (size+1+size)
        for (let i=0; i<size*2+1; i++) {
            sequence.push(shiftPos( pos, artifact.body.size, size-i, -2*size ))
        }
        // 5. go down (size+1+size)
        for (let i=0; i<size*2+1; i++) {
            sequence.push(shiftPos( pos, artifact.body.size, -size, -2*size+i ))
        }
        // 6. go right.
        for (let i=0; i<size; i++) {
            sequence.push(shiftPos( pos, artifact.body.size, -size, 0 ))
        }
        // now try!
        for (let p of sequence) {
            success = await place(P, artifact, world, p);
            if (success) break;
        }
    }
    return true;
}

function shiftPos(p: Position, body: number[], dx: number, dy: number) {
    const pos = deepCopy(p);
    pos.x += body[0] * dx;
    pos.y += body[1] * dy;
    return pos;
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