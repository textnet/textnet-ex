
import { Persistence } from "../persist"
import { Dir, Position, Artifact, World } from "../../universe/interfaces"
import { DIR } from "../../universe/const"
import { deepCopy } from "../../universe/utils"
/**
 * How far artifacts should be to be considered 'next to each other'.
 */
const PROXIMITY = 3; // how far is 'NEXT'

export async function getArtifact_NextTo(P: Persistence, artifact: Artifact, dir?: Dir) {
    // no direction: try any
    if (!dir) {
        console.log("any direction will do")
        for (let i of [DIR.UP, DIR.RIGHT, DIR.DOWN, DIR.LEFT]) {
            let a = getArtifact_NextTo(P, artifact, i);
            if (a) return a;
            return false;
        }
    }
    // if there is a direction specified:
    const world = await P.worlds.load( artifact.hostId );
    for (let id in world.artifactPositions) {
        const candidate = await P.artifacts.load(id);
        if (artifact.id != candidate.id &&
            await isNext(P, artifact, candidate, dir)) {
            return candidate;
        }
    }
    return;
}

export async function isNext(P: Persistence, a: Artifact, b: Artifact, dir: Dir) {
    let aBox = await artifactBox(P, a);
    let bBox = await artifactBox(P, b);
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
    return (distance >= -PROXIMITY && distance <= PROXIMITY);
}

export async function isOverlap(P: Persistence, a: Artifact, b: Artifact, pos?: Position) {
    let aBox = await artifactBox(P, a, pos);
    let bBox = await artifactBox(P, b);
    if (aBox[0] > bBox[0]) {
        let cBox = deepCopy(bBox);
        bBox = deepCopy(aBox);
        aBox = cBox;
    }
    if (aBox[2] <= bBox[0]) return false;
    if (aBox[1] <= bBox[1] && aBox[3] <= bBox[1]) return false;
    if (aBox[1] >= bBox[3] && aBox[3] >= bBox[3]) return false;
    return true;
}


export async function artifactBox(P: Persistence, a: Artifact, position?: Position) {
    if (!position) position = await artifactPos(P, a)
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