/**
 * Written Word: Retrieving data about the world and artifacts in it.
 * Unlike all the commands, these functions work in synchronous manner.
 */

import { Dir, Position, Artifact, World            } from "../../interfaces"
import { DIRfrom, mundaneWorldName, possibleWorlds } from "../../const"
import { normalizeDir                              } from "../../utils"

import { ObserverCommand         } from "../../persistence/observe/observer_events"
import { PersistenceObserver     } from "../../persistence/observe/observer"
import { sync_getArtifact_NextTo } from "../../persistence/mutate/spatial"

import { FengariMap } from "../api"


/**
 * Get list of artifacts that suffice a number of (optional) criteria.
 * All criteria are optional.
 * @param {PersistenceObserver} O
 * @optional @param {string} world
 *                            - none    = the mundane world of the observer
 *                            - "upper" = the world where the observer's artifact is placed
 *                            - any string = codename of the world (e.g. "mundane")
 * @optional @param {string} id
 * @optional @param {string} name (not unique! useful for filtering)
 * @returns         {object} Written Word artifact data
 */
export function get_artifacts( O: PersistenceObserver, 
                               world?: string, id?: string, name?: string) {
    console.log(`get_artifacts( world="${world}", name="${name}", id="${id}" )`)
    const artifact = O.writtenP.artifacts.load(O.ownerId);
    let _world: World;
    if (world == "upper") {
        _world = O.writtenP.worlds.load(artifact.hostId);
    } else {
        if (possibleWorlds.indexOf(world) < 0) {
            world = mundaneWorldName;
        }
        _world = O.writtenP.worlds.load(artifact.worldIds[world]);
    }
    let result = [];
    if (_world) {
        for (let _id in _world.artifactPositions) {
            const _artifact = O.writtenP.artifacts.load(_id);
            if (!name || _artifact.name == name) {
                if (!id || _id == id) {
                    result.push(prepArtifact(O, _artifact));
                }
            }
        }
    }
    return result;
}

/**
 * Get one artifact matching the criteria. First if there are multiple.
 * All criteria are optional.
 * @param {PersistenceObserver} O
 * @optional @param {string} world
 *                            - none    = the mundane world of the observer
 *                            - "upper" = the world where the observer's artifact is placed
 *                            - any string = codename of the world (e.g. "mundane")
 * @optional @param {string} id
 * @optional @param {string} name (not unique! useful for filtering)
 * @returns         {object} Written Word artifact data
 */
export function get_artifact( O: PersistenceObserver, 
                              world?: string, id?: string, name?: string) {
    const result = get_artifacts(O, world, id, name);
    if (result.length > 0) return result[0];
    else return false;
}

/**
 * Get the artifact of the observer.
 * @param {PersistenceObserver} O
 * @returns {object}            Written Word artifact data
 */
export function get_myself( O: PersistenceObserver ) {
    const artifact = O.writtenP.artifacts.load(O.ownerId);
    return prepArtifact(O, artifact);
}

/**
 * Get the artifact that is directly next to the observer.
 * @param {PersistenceObserver} O
 * @param {string}              direction (e.g. "up")
 * @returns {object}            Written Word artifact data
 */
export function get_next( O: PersistenceObserver, direction: string) {
    const artifact = O.writtenP.artifacts.load(O.ownerId);
    const dir = DIRfrom({name:direction} as Dir);
    return prepArtifact(O, sync_getArtifact_NextTo(O.writtenP, artifact, dir))
}

/**
 * Get the artifact that is closest to the observer.
 * Can filter by `name`.
 * @param {PersistenceObserver} O
 * @param {string}              name
 * @returns {object}            Written Word artifact data
 */
export function get_closest( O: PersistenceObserver, name?: string) {
    let all = get_artifacts(O, "upper", null, name);
    let myself = get_myself(O);
    let closestDist = -1;
    let closest = false;
    for (let a of all) {
        if (a["id"] != myself["id"]) {
            const d = dist(myself, a);
            if (closestDist < 0 || d < closestDist) {
                closestDist = d;
                closest = a;
            }
        }
    }
    return closest;
}


/**
 * Internal: calculate distance between centers of two artifact data objects.
 * NB: uses neither Artifact, nor ArtifactStructure format.
 * NB: uses the format that is compatible with Written Word.
 * @param {object}   a
 * @param {object}   b
 * @returns {number} distance between a.pos and b.pos
 */
function dist(a, b) {
    return Math.sqrt((a.pos.x - b.pos.x)*(a.pos.x - b.pos.x)
                    +(a.pos.y - b.pos.y)*(a.pos.y - b.pos.y));
}

/**
 * Prepare data structure to be exported to Written Word (Lua VM).
 * NB: It is neither Artifact nor AertifactStructure.
 * @param {PersistenceObserver} O
 * @param {Artifact}            artifact
 * @returns {object}            Written Word artifact data
 */
function prepArtifact(O: PersistenceObserver, artifact: Artifact) {
    const hostWorld = O.writtenP.worlds.load(artifact.hostId);
    const result = {}
    for (let i of artifact.API) {
        result[i] = artifact[i];
    }
    if (hostWorld) {
        result["pos"] = {
            x: hostWorld.artifactPositions[artifact.id].x,
            y: hostWorld.artifactPositions[artifact.id].y,
        }
        result["direction"] = hostWorld.artifactPositions[artifact.id].dir.name;
    }
    return result;
}



