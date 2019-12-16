import { 
    Account, Avatar, Artifact, World, 
    Coordinates, Position, Dir,
} from "./interfaces"
import {
    DIR 
} from "./const"
import { deepCopy } from "./utils"


export function getAccountWorld(account: Account) {
    return account.avatar.body.coords.world;
}

const PROXIMITY = 2; // how far is 'NEXT'

// get an artifact which is directly next to another
export function getArtifact_NextTo(artifact: Artifact, dir?: Dir) {
    // no direction: try any
    if (!dir) {
        for (let i of [DIR.UP, DIR.RIGHT, DIR.DOWN, DIR.LEFT]) {
            let a = getArtifact_NextTo(artifact, i);
            if (a) return a;
            return false;
        }
    }
    // if there is a direction specified:
    let world = artifact.coords.world;
    for (let i in world.artifacts) {
        if (artifact.id != world.artifacts[i].id &&
            isNext(artifact, world.artifacts[i], dir)) {
            return world.artifacts[i];
        }
    }
    return false;
}

// 
export function artifactBox(a: Artifact) {
    let aBox = [0,0,0,0]; // L-U-R-D
    aBox[0] = a.coords.position.x - a.body.size[0]/2 + a.body.offset[0];
    aBox[1] = a.coords.position.y - a.body.size[1]/2 + a.body.offset[1];
    aBox[2] = aBox[0] + a.body.size[0];
    aBox[3] = aBox[1] + a.body.size[1];
    return aBox    
}
//
export function isOverlap(a: Artifact, b: Artifact, coords?: Coordinates) {
    if (!coords) coords = a.coords;
    if (!a.coords || !b.coords) return false;
    let aBox = artifactBox(a);
    let bBox = artifactBox(b);
    aBox[0] = aBox[0] + coords.position.x - a.coords.position.x;
    aBox[1] = aBox[1] + coords.position.y - a.coords.position.y;
    aBox[2] = aBox[2] + coords.position.x - a.coords.position.x;
    aBox[3] = aBox[3] + coords.position.y - a.coords.position.y;
    if (aBox[0] > bBox[0]) {
        let cBox = deepCopy(bBox);
        bBox = deepCopy(aBox);
        aBox = deepCopy(cBox);
    }
    if (aBox[2] < bBox[0]) return false;
    if (aBox[1] < bBox[1] && aBox[3] < bBox[3]) return false;
    if (aBox[1] > bBox[1] && aBox[3] > bBox[3]) return false;
    return true;
}

// check if B is next to A in direction of DIR
export function isNext(a: Artifact, b: Artifact, dir: Dir) {
    let aBox = artifactBox(a);
    let bBox = artifactBox(b);
    // console.log("Box A:", a.name, aBox[0], aBox[1], aBox[2], aBox[3], 
    //     "pos:", a.coords.position.x )
    // console.log("Box B:", b.name, bBox[0], bBox[1], bBox[2], bBox[3],
    //     "pos:", b.coords.position.x, b.body.offset[0] )
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