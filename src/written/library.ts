import { Artifact, Dir, World } from "../universe/interfaces"
import { DIRfrom } from "../universe/const"
import { AvatarObserver } from "../observe"
import { getArtifact_NextTo } from "../universe/getters"
import { FengariMap } from "./api"
import { updateArtifactProperties } from "../universe/manipulations"

export const supportedFunctions = {
    "get_artifacts": { signature: ["world", "id", "name"], f: get_artifacts },
    "get_artifact":  { signature: ["world", "id", "name"], f: get_artifact  },
    "get_myself":    { signature: [],                      f: get_myself    },
    "get_next":      { signature: ["direction"],           f: get_next      },
    "get_closest":   { signature: ["name"],                f: get_closest   },
    "update":        { signature: false,                   f: update        },
}


function update(observer: AvatarObserver, 
                params: FengariMap) {
    let artifactStructure = params.get("artifact")
    let artifact = observer.artifact;
    if (artifactStructure) {
        // TODO: get artifact from persistence.
        let found = false;
        for (let i in artifact.coords.world.artifacts) {
            if (artifactStructure["id"] == artifact.coords.world.artifacts[i].id) {
                found = true;
                artifact = artifact.coords.world.artifacts[i];
            }
        }
        for (let i in artifact.worlds[0].artifacts) {
            if (artifactStructure["id"] == artifact.worlds[0].artifacts[i].id) {
                artifact = artifact.worlds[0].artifacts[i];
            }
        }
    }
    const properties = {}
    for (let key of artifact.API) {
        properties[key] = params.get(key)
    }
    updateArtifactProperties(artifact, properties);
    return false;
}



function get_artifacts( observer: AvatarObserver, 
                               world?: string, id?: string, name?: string) {
    let _world: World;
    if (world == "upper") _world = observer.artifact.coords.world;
    else                  _world = observer.artifact.worlds[0];   

    let result = [];
    for (let i in _world.artifacts) {
        if (!name || _world.artifacts[i].name == name) {
            if (!id || _world.artifacts[i].id == id) {
                result.push(prepArtifact(_world.artifacts[i]));
            }
        }
    }
    return result;
}

function get_artifact( observer: AvatarObserver, 
                              world?: string, id?: string, name?: string) {
    const result = get_artifacts(observer, world, id, name);
    if (result.length > 0) return result[0];
}

function get_myself( observer: AvatarObserver ) {
    return prepArtifact(observer.artifact);
}

function get_next( observer: AvatarObserver, direction: string) {
    const dir = DIRfrom({name:direction} as Dir);
    return getArtifact_NextTo(observer.artifact, dir)
}

function get_closest( observer: AvatarObserver, 
                             name?: string) {
    let all = get_artifacts(observer, "upper", null, name);
    let myself = get_myself(observer);
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


function dist(a, b) {
    return Math.sqrt((a.pos.x - b.pos.x)*(a.pos.x - b.pos.x)
                    +(a.pos.y - b.pos.y)*(a.pos.y - b.pos.y));
}

function prepArtifact(artifact: Artifact) {
    const result = {}
    for (let i of artifact.API) {
        result[i] = artifact[i]
    }
    result["pos"] = {
        x: artifact.coords.position.x,
        y: artifact.coords.position.y
    }
    result["direction"] = artifact.coords.position.dir.name;
    return result;
}