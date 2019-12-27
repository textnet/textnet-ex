import { Artifact, Dir, World } from "../universe/interfaces"
import { DIRfrom } from "../universe/const"
import { AvatarObserver, ObserverCommand } from "../observe"
import { getArtifact_NextTo } from "../universe/getters"
import { FengariMap } from "./api"
import { 
    updateArtifactProperties,
    updateArtifactText,
    tryToPlaceArtifact,
} from "../universe/manipulations"
import { cpCoords, normalizeDir } from "../universe/utils"

export const supportedFunctions = {
    "get_artifacts": { signature: ["world", "id", "name"], f: get_artifacts },
    "get_artifact":  { signature: ["world", "id", "name"], f: get_artifact  },
    "get_myself":    { signature: [],                      f: get_myself    },
    "get_next":      { signature: ["direction"],           f: get_next      },
    "get_closest":   { signature: ["name"],                f: get_closest   },

    "update":        { signature: false,                   f: update        },
    "self":          { signature: false,                   f: update        },

    "get_text":    { signature: ["artifact", "line", "anchor"         ], f: get_text    },
    "update_text": { signature: ["artifact", "text",                  ], f: update_text },
    "update_line": { signature: ["artifact", "line", "anchor", "text" ], f: update_line },
    "insert_line": { signature: ["artifact", "line", "anchor", "text" ], f: insert_line },
    "delete_line": { signature: ["artifact", "line", "anchor"         ], f: delete_line },

    "move_to":  { signature: ["artifact", "x", "y", "direction" ], f: move_to  },
    "move_by":  { signature: ["artifact", "x", "y", "direction", "distance" ], 
                                                                   f: move_by  },
    "turn_to":  { signature: ["artifact", "directon"            ], f: move_by  },
    "place_at": { signature: ["artifact", "x", "y", "direction" ], f: place_at },

    "on":  { signature: false, f: event_on }, // artifact, event, handler
    "off": { signature: ["artifact", "event", "key",     ], f: event_off },

}

function event_on(observer: AvatarObserver, 
                  params: FengariMap) {
    let artifact = getArtifactFromStructure(observer, params.get("artifact"));
    let event = params.get("event") || "timer";
    let handler = params.get("handler");
    if (handler == undefined) return false;
    return observer.subscribe(artifact, event, handler);
}
function event_off(observer: AvatarObserver, 
                   artifactStructure?: object, event?: string, key?:any) {
    let artifact = getArtifactFromStructure(observer, artifactStructure);
    if (event === undefined) event = "timer";
    observer.unsubscribe(artifact, event, key);
    return true;
}


function move_to(observer: AvatarObserver, 
                 artifactStructure?: object, x?: number, y?: number, direction?: string) {
    let artifact = getArtifactFromStructure(observer, artifactStructure);
    const dir = DIRfrom({name:direction} as Dir);
    if (x === undefined) x = artifact.coords.position.x;
    if (y === undefined) y = artifact.coords.position.y;
    observer.executeCommand(ObserverCommand.Move, { artifact: artifact, x: x, y: y, dir: dir })
    return true;
}

function move_by(observer: AvatarObserver, 
                 artifactStructure?: object, x?: number, y?: number, 
                 direction?: string, distance?: number) {
    let artifact = getArtifactFromStructure(observer, artifactStructure);
    const dir = DIRfrom({name:direction} as Dir);
    if (x === undefined) x = 0;
    if (y === undefined) y = 0;
    if (distance == undefined) {
        x += artifact.coords.position.x;
        y += artifact.coords.position.y;
    } else {
        const nDir = normalizeDir(dir, distance);
        x = artifact.coords.position.x + nDir.x;
        y = artifact.coords.position.y + nDir.y;
    }
    observer.executeCommand(ObserverCommand.Move, { artifact: artifact, x: x, y: y, dir: dir })
    return true;
}

function place_at(observer: AvatarObserver, 
                 artifactStructure?: object, x?: number, y?: number, direction?: string) {
    let artifact = getArtifactFromStructure(observer, artifactStructure);
    const dir = DIRfrom({name:direction} as Dir);
    if (x === undefined) x = artifact.coords.position.x;
    if (y === undefined) y = artifact.coords.position.y;
    const newCoords = cpCoords(artifact.coords);
    newCoords.position = { x: x, y: y, dir: dir };
    tryToPlaceArtifact(artifact, newCoords)
    return true;
}


function get_text(observer: AvatarObserver, 
                  artifactStructure?: object, line?: number, anchor?: string) {
    let artifact = getArtifactFromStructure(observer, artifactStructure);
    let text = ""+artifact.worlds[0].text;
    if (line || anchor) {
        let lines = text.split("\n");
        if (line) { lines = [lines[line]] }
        let result = [];
        if (anchor) {
            for (let l of lines) {
                if (l.substr(0,anchor.length+2) == "#"+anchor+" ") {
                    result.push(l.substr(anchor.length+2));
                }
            }
        } else {
            result = lines;
        }
        return result.join("\n");
    } else {
        return text;
    }
}

function update_text(observer: AvatarObserver, 
                  artifactStructure?: object, text?: string) {
    let artifact = getArtifactFromStructure(observer, artifactStructure);
    updateArtifactText(artifact, text, true);
    return true;
}

function _update_line(observer: AvatarObserver, 
                  artifactStructure?: object, line?: number, anchor?: string,
                  text?: string,
                  mode?: string
                  ) {
    let artifact = getArtifactFromStructure(observer, artifactStructure);
    let artifact_text = artifact.worlds[0].text
    if (!line && !anchor) return true;
    let lines = artifact_text.split("\n");
    if (line) {
        if (lines.length >= line) {
            lines = appendLinesToList(lines, line-lines.length+1);
        }
        if (mode == "insert") {
            if (text === undefined) text = "";
            lines.splice(line, 0, text);
        } else
        if (mode == "delete") {
            lines.splice(line, 1)
        } else {
            lines[line] = text;    
        }
    }
    if (anchor) {
        let skip = false;
        for (let i in lines) {
                if (!skip && (lines[i].substr(0,anchor.length+2) == "#"+anchor+" ")) {
                    if (mode == "insert") {
                        if (text === undefined) text = "";
                        lines.splice(parseInt(i), 0, "#"+anchor+" "+text)
                        skip = true;
                    } else
                    if (mode == "delete") {
                        lines.splice(parseInt(i), 1);
                    } else {
                        lines[i] = "#"+anchor+" "+text;    
                    }
                } else {
                    skip = false;
                }
            }
    }
    let result = lines.join("\n");
    updateArtifactText(artifact, result, false);
    return true
}

function update_line(observer: AvatarObserver, 
                  artifactStructure?: object, line?: number, anchor?: string,
                  text?: string) {
    return _update_line(observer, artifactStructure, line, anchor, text);
}
function insert_line(observer: AvatarObserver, 
                  artifactStructure?: object, line?: number, anchor?: string,
                  text?: string) {
    return _update_line(observer, artifactStructure, line, anchor, text, "insert");
}
function delete_line(observer: AvatarObserver, 
                  artifactStructure?: object, line?: number, anchor?: string) {
    return _update_line(observer, artifactStructure, line, anchor, undefined, "delete");
}

function appendLinesToList(lines, number) {
    let count = 0;
    while (count < number) {
        lines.push("");
        number++;
    }
    return lines;
}


function update(observer: AvatarObserver, 
                params: FengariMap) {
    let artifact = getArtifactFromStructure(observer, params.get("artifact"))
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

function getArtifactFromStructure(observer: AvatarObserver, artifactStructure) {
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
    return artifact;
}


