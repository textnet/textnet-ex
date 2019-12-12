import { 
    Account, Avatar, Artifact, World, 
    Coordinates, Position, Dir,
} from "./interfaces"
import {
    DIR 
} from "./const"


export function getWorld(account: Account) {
    return account.avatar.body.coords.world;
}

const PROXIMITY = 5; // how far is 'NEXT'

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

// check if B is next to A in direction of DIR
export function isNext(a: Artifact, b: Artifact, dir: Dir) {
    let aBox = [0,0,0,0]; // L-U-R-D
    let bBox = [0,0,0,0];
    aBox[0] = a.coords.position.x - a.body.offset[0];
    aBox[1] = a.coords.position.y - a.body.offset[1];
    aBox[2] = aBox[0] + a.body.size[0];
    aBox[3] = aBox[1] + a.body.size[1];
    bBox[0] = b.coords.position.x - b.body.offset[0];
    bBox[1] = b.coords.position.y - b.body.offset[1];
    bBox[2] = bBox[0] + b.body.size[0];
    bBox[3] = bBox[1] + b.body.size[1];
    // console.log("Box A:", aBox[0], aBox[1], aBox[2], aBox[3])
    // console.log("Box B:", bBox[0], bBox[1], bBox[2], bBox[3])
    // check the overlap
    let overlapX = false, overlapY = false;
    if ((aBox[0] > bBox[0] && aBox[0] < bBox[2]) ||
        (aBox[0] < bBox[0] && aBox[2] > bBox[0]))
        overlapX = true;
    if ((aBox[1] > bBox[1] && aBox[1] < bBox[3]) ||
        (aBox[1] < bBox[1] && aBox[3] > bBox[1]))
        overlapY = true;
    // check the distance
    let distance = -66666666666;
    if (overlapY) {
        if (dir == DIR.LEFT)  distance = aBox[0]-bBox[2];
        if (dir == DIR.RIGHT) distance = bBox[0]-aBox[2];
    }
    if (overlapX) {
        if (dir == DIR.UP)   distance = aBox[1]-bBox[3];
        if (dir == DIR.DOWN) distance = bBox[1]-aBox[3];
    }
    return (distance >= 0 && distance < PROXIMITY);
}