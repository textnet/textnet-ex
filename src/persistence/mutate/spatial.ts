
import { Persistence } from "../persist"
import { SyncWrittenPersistence } from "../../written/persistence"
import { Dir, Position, Artifact, World } from "../../interfaces"
import { DIR, visualBounds, worldWidth, spatialProximity } from "../../const"
import { deepCopy } from "../../utils"
/**
 * How far artifacts should be to be considered 'next to each other'.
 */

export async function getArtifact_NextTo(P: Persistence, artifact: Artifact, dir?: Dir) {
    if (!dir) {
        for (let i of [DIR.UP, DIR.RIGHT, DIR.DOWN, DIR.LEFT]) {
            let a = getArtifact_NextTo(P, artifact, i);
            if (a) return a;
            return false;
        }
    }
    const world = await P.worlds.load( artifact.hostId );
    for (let id in world.artifactPositions) {
        const candidate = await P.artifacts.load(id);
        if (artifact.id != candidate.id &&
            await isNext(P, artifact, candidate, dir)) {
            return candidate;
        }
    }
    return false;
}

export function sync_getArtifact_NextTo(P: SyncWrittenPersistence, artifact: Artifact, dir?: Dir) {
    if (!dir) {
        for (let i of [DIR.UP, DIR.RIGHT, DIR.DOWN, DIR.LEFT]) {
            let a = sync_getArtifact_NextTo(P, artifact, i);
            if (a) return a;
            return false;
        }
    }
    const world = P.worlds.load( artifact.hostId );
    if (world) {
        for (let id in world.artifactPositions) {
            const candidate = P.artifacts.load(id);
            if (artifact.id != candidate.id &&
                sync_isNext(P, artifact, candidate, dir)) {
                return candidate;
            }
        }
    }
    return false;
}

export function isInBounds(pos: Position, body?: number[]) {
    if (pos.x < 0) return false;
    if (pos.y < 0) return false;
    if (!body) body = [0,0];
    if (pos.x+body[0] >= visualBounds.left+worldWidth) return false;
    return true;
}

export async function isNext(P: Persistence, a: Artifact, b: Artifact, dir: Dir) {
    let aBox = await artifactBox(P, a);
    let bBox = await artifactBox(P, b);
    if (!aBox || !bBox) return false;
    // console.log("IsNext:", dir)
    // console.log("Box A:", a.name, aBox[0], aBox[1], aBox[2], aBox[3]);
    // console.log("Box B:", b.name, bBox[0], bBox[1], bBox[2], bBox[3]);
    // check the overlap
    let overlapX = false, overlapY = false;
    if ((aBox[0] >= bBox[0] && aBox[0] < bBox[2]) ||
        (aBox[0] < bBox[0] && aBox[2] >= bBox[0]))
        overlapX = true;
    if ((aBox[1] >= bBox[1] && aBox[1] < bBox[3]) ||
        (aBox[1] < bBox[1] && aBox[3] >= bBox[1]))
        overlapY = true;
    // check the distance
    let distance = -66666666666;
    if (overlapY) {
        if (dir.name == DIR.LEFT.name)  distance = aBox[0]-bBox[2];
        if (dir.name == DIR.RIGHT.name) distance = bBox[0]-aBox[2];
        // console.log("overlapY", distance, dir.name)
    }
    if (overlapX) {
        if (dir.name == DIR.UP.name)   distance = aBox[1]-bBox[3];
        if (dir.name == DIR.DOWN.name) distance = bBox[1]-aBox[3];
        // console.log("overlapX", distance, dir.name)
    }
    return (distance >= -spatialProximity && distance <= spatialProximity);
}

export function sync_isNext(P: SyncWrittenPersistence, a: Artifact, b: Artifact, dir: Dir) {
    let aBox = sync_artifactBox(P, a);
    let bBox = sync_artifactBox(P, b);
    if (!aBox || !bBox) return false;
    // console.log("IsNext:", dir)
    // console.log("Box A:", a.name, aBox[0], aBox[1], aBox[2], aBox[3]);
    // console.log("Box B:", b.name, bBox[0], bBox[1], bBox[2], bBox[3]);
    // check the overlap
    let overlapX = false, overlapY = false;
    if ((aBox[0] >= bBox[0] && aBox[0] < bBox[2]) ||
        (aBox[0] < bBox[0] && aBox[2] >= bBox[0]))
        overlapX = true;
    if ((aBox[1] >= bBox[1] && aBox[1] < bBox[3]) ||
        (aBox[1] < bBox[1] && aBox[3] >= bBox[1]))
        overlapY = true;
    // check the distance
    let distance = -66666666666;
    if (overlapY) {
        if (dir.name == DIR.LEFT.name)  distance = aBox[0]-bBox[2];
        if (dir.name == DIR.RIGHT.name) distance = bBox[0]-aBox[2];
        // console.log("overlapY", distance, dir.name)
    }
    if (overlapX) {
        if (dir.name == DIR.UP.name)   distance = aBox[1]-bBox[3];
        if (dir.name == DIR.DOWN.name) distance = bBox[1]-aBox[3];
        // console.log("overlapX", distance, dir.name)
    }
    return (distance >= -spatialProximity && distance <= spatialProximity);
}

export async function isPlaceable(P: Persistence, artifact: Artifact, 
                    world: World, pos: Position) {
    for (let id in world.artifactPositions) {
        if (id != artifact.id) {
            const another = await P.artifacts.load(id);
            if (await isOverlap(P, artifact, another, pos)) {
                return false;
            }
        }
    }
    return true
}

export async function isOverlap(P: Persistence, a: Artifact, b: Artifact, pos?: Position) {
    let aBox = await artifactBox(P, a, pos);
    let bBox = await artifactBox(P, b);
    if (!aBox || !bBox) return true;
    if (aBox[0] > bBox[0]) {
        let cBox = deepCopy(bBox);
        bBox = deepCopy(aBox);
        aBox = cBox;
    }
    // console.log("Box A:", a.name, aBox[0], aBox[1], aBox[2], aBox[3]);
    // console.log("Box B:", b.name, bBox[0], bBox[1], bBox[2], bBox[3]);
    if (aBox[2] <= bBox[0]) return false;
    if (aBox[1] <= bBox[1] && aBox[3] <= bBox[1]) return false;
    if (aBox[1] >= bBox[3] && aBox[3] >= bBox[3]) return false;
    // console.log("-- overlap --")
    return true;
}


export async function artifactBox(P: Persistence, a: Artifact, position?: Position) {
    if (!position) position = await artifactPos(P, a)
    if (!position) return;
    let aBox = [0,0,0,0]; // L-U-R-D
    aBox[0] = position.x - a.body.size[0]/2 + a.body.offset[0];
    aBox[1] = position.y - a.body.size[1]/2 + a.body.offset[1];
    aBox[2] = aBox[0] + a.body.size[0];
    aBox[3] = aBox[1] + a.body.size[1];
    return aBox    
}

export async function artifactPos(P: Persistence, a: Artifact) {
    const world = await P.worlds.load( a.hostId );
    return world.artifactPositions[a.id];
}

export function sync_artifactBox(P: SyncWrittenPersistence, a: Artifact, position?: Position) {
    if (!position) position = sync_artifactPos(P, a)
    if (!position) return;
    let aBox = [0,0,0,0]; // L-U-R-D
    aBox[0] = position.x - a.body.size[0]/2 + a.body.offset[0];
    aBox[1] = position.y - a.body.size[1]/2 + a.body.offset[1];
    aBox[2] = aBox[0] + a.body.size[0];
    aBox[3] = aBox[1] + a.body.size[1];
    return aBox    
}


export function sync_artifactPos(P: SyncWrittenPersistence, a: Artifact) {
    const world = P.worlds.load( a.hostId );
    return world.artifactPositions[a.id];
}