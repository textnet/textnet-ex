
import { Dir, Position, Artifact, World } from "../../universe/interfaces"
import { DIRfrom, mundaneWorldName, possibleWorlds } from "../../universe/const"
import { ObserverCommand } from "../../persistence/observe/observer_events"
import { PersistenceObserver } from "../../persistence/observe/observer"
import { FengariMap } from "../api"
import { normalizeDir } from "../../universe/utils"

import { getArtifact_NextTo } from "../../persistence/mutate/spatial"


export async function get_artifacts( O: PersistenceObserver, 
                      world?: string, id?: string, name?: string) {
    const artifact = await O.P.artifacts.load(O.ownerId);
    let _world: World;
    if (world == "upper") {
        _world = await O.P.worlds.load(artifact.hostId);
    } else {
        if (possibleWorlds.indexOf(world) < 0) {
            world = mundaneWorldName;
        }
        _world = await O.P.worlds.load(artifact.worldIds[world]);
    }
    let result = [];
    if (_world) {
        for (let _id in _world.artifactPositions) {
            const _artifact = await O.P.artifacts.load(_id);
            if (!name || _artifact.name == name) {
                if (!id || _id == id) {
                    result.push(await prepArtifact(O, _artifact));
                }
            }
        }
    }
    return result;
}

export async function get_artifact( O: PersistenceObserver, 
                      world?: string, id?: string, name?: string) {
    const result = await get_artifacts(O, world, id, name);
    if (result.length > 0) return result[0];
}

export async function get_myself( O: PersistenceObserver ) {
    const artifact = await O.P.artifacts.load(O.ownerId);
    return await prepArtifact(O, artifact);
}

export async function get_next( O: PersistenceObserver, direction: string) {
    const artifact = await O.P.artifacts.load(O.ownerId);
    const dir = DIRfrom({name:direction} as Dir);
    return await prepArtifact(O, getArtifact_NextTo(O.P, artifact, dir))
}

export async function get_closest( O: PersistenceObserver, name?: string) {
    let all = await get_artifacts(O, "upper", null, name);
    let myself = await get_myself(O);
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


// -- 

function dist(a, b) {
    return Math.sqrt((a.pos.x - b.pos.x)*(a.pos.x - b.pos.x)
                    +(a.pos.y - b.pos.y)*(a.pos.y - b.pos.y));
}


async function prepArtifact(O: PersistenceObserver, artifact: Artifact) {
    const hostWorld = await O.P.worlds.load(artifact.hostId);
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



