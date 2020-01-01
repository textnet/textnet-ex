import { 
    Account, Artifact, World, 
    Position, Dir,
} from "./interfaces"
import {
    DIR 
} from "./const"
import { deepCopy } from "./utils"


// /**
//  * How far artifacts should be to be considered 'next to each other'.
//  */
// const PROXIMITY = 3; // how far is 'NEXT'

// /**
//  * Get an artifact that is directly next to a certain artifact
//  * @param {Artifact} artifact - look around this artifact
//  * @param {Dir} dir - optional; look only in this direction. Must be a standart one.
//  * @returns {Artifact} or false
//  */
// export function getArtifact_NextTo(artifact: Artifact, dir?: Dir) {
//     // no direction: try any
//     if (!dir) {
//         for (let i of [DIR.UP, DIR.RIGHT, DIR.DOWN, DIR.LEFT]) {
//             let a = getArtifact_NextTo(artifact, i);
//             if (a) return a;
//             return false;
//         }
//     }
//     // if there is a direction specified:
//     let world = artifact.coords.world;
//     for (let i in world.artifacts) {
//         if (artifact.id != world.artifacts[i].id &&
//             isNext(artifact, world.artifacts[i], dir)) {
//             return world.artifacts[i];
//         }
//     }
//     return false;
// }

// /**
//  * Returns the bounding box for an artifact. 
//  * Takes into account position, size, and offset of the collision body.
//  * @param {Artifact} a
//  * @param {Coordinates} coords - optional; overrides artifact position if provided.
//  * @returns {number[]} array of [Left, Up, Right, Down] coordinates.
//  */
// export function artifactBox(a: Artifact, coords?: Coordinates) {
//     if (!coords) coords = a.coords;
//     let aBox = [0,0,0,0]; // L-U-R-D
//     aBox[0] = coords.position.x - a.body.size[0]/2 + a.body.offset[0];
//     aBox[1] = coords.position.y - a.body.size[1]/2 + a.body.offset[1];
//     aBox[2] = aBox[0] + a.body.size[0];
//     aBox[3] = aBox[1] + a.body.size[1];
//     return aBox    
// }

// /**
//  * Checks if two artifact overlap.
//  * @param {Artifact} a
//  * @param {Artifact} b
//  * @param {Coordinates} coords - optional; used to override coordinates of 'a'.
//  * @returns {boolean}
//  */
// export function isOverlap(a: Artifact, b: Artifact, coords?: Coordinates) {
//     if (!b.coords || (!a.coords && !coords)) return false;
//     let aBox = artifactBox(a, coords);
//     let bBox = artifactBox(b);
//     if (aBox[0] > bBox[0]) {
//         let cBox = deepCopy(bBox);
//         bBox = deepCopy(aBox);
//         aBox = cBox;
//     }
//     if (aBox[2] <= bBox[0]) return false;
//     if (aBox[1] <= bBox[1] && aBox[3] <= bBox[1]) return false;
//     if (aBox[1] >= bBox[3] && aBox[3] >= bBox[3]) return false;
//     return true;
// }


// /**
//  * Checks if an artifact B is next to A in direction of DIR.
//  * @param {Artifact} a
//  * @param {Artifact} b
//  * @param {Dir} dir - must be one of standard.
//  */
// export function isNext(a: Artifact, b: Artifact, dir: Dir) {
//     let aBox = artifactBox(a);
//     let bBox = artifactBox(b);
//     // console.log("Box A:", a.name, aBox[0], aBox[1], aBox[2], aBox[3], 
//     //     "pos:", a.coords.position.x )
//     // console.log("Box B:", b.name, bBox[0], bBox[1], bBox[2], bBox[3],
//     //     "pos:", b.coords.position.x, b.body.offset[0] )
//     // check the overlap
//     let overlapX = false, overlapY = false;
//     if ((aBox[0] >= bBox[0] && aBox[0] < bBox[2]) ||
//         (aBox[0] < bBox[0] && aBox[2] >= bBox[0]))
//         overlapX = true;
//     if ((aBox[1] >= bBox[1] && aBox[1] < bBox[3]) ||
//         (aBox[1] < bBox[1] && aBox[3] >= bBox[1]))
//         overlapY = true;
//     // check the distance
//     let distance = -66666666666;
//     if (overlapY) {
//         if (dir.name == DIR.LEFT.name)  distance = aBox[0]-bBox[2];
//         if (dir.name == DIR.RIGHT.name) distance = bBox[0]-aBox[2];
//         // console.log("overlapY", distance, dir.name)
//     }
//     if (overlapX) {
//         if (dir.name == DIR.UP.name)   distance = aBox[1]-bBox[3];
//         if (dir.name == DIR.DOWN.name) distance = bBox[1]-aBox[3];
//         // console.log("overlapX", distance, dir.name)
//     }
//     return (distance >= -PROXIMITY && distance <= PROXIMITY);
// }



