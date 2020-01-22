import { Artifact, World, defaultsArtifact }     from "../../interfaces"
import { PersistenceObserver } from "../../persistence/observe/observer"
import { FengariMap }          from "../api"
import { updateText }    from "../../persistence/mutate/world"
import { mundaneWorldName } from "../../const"



function getWorldFromArtifactData(O: PersistenceObserver, artifactData?: object) {
    const artifact = O.writtenP.artifacts.load(artifactData?artifactData["id"]:O.ownerId);
    const worldId = artifact.worldIds[ mundaneWorldName ];
    const world = O.writtenP.worlds.load(worldId);
    return world;    
}

export function get_text( O: PersistenceObserver, artifactData?: object, 
                          line?: number, anchor?: string, 
                         ) {
    const world = getWorldFromArtifactData(O, artifactData)
    const text = ""+world.text;
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

export function update_text( O: PersistenceObserver, artifactData?: object,
                             text?: string) {
    const world = getWorldFromArtifactData(O, artifactData)
    updateText(O.P, world, text);
}

export function update_line( O: PersistenceObserver, artifactData?: object,
                             line?: number, anchor?: string, text?: string ) {
    return _update_line(O, artifactData, line, anchor, text);    
}
export function insert_line( O: PersistenceObserver, artifactData?: object,
                             line?: number, anchor?: string, text?: string ) {
    return _update_line(O, artifactData, line, anchor, text, "insert");    
}
export function delete_line( O: PersistenceObserver, artifactData?: object,
                             line?: number, anchor?: string ) {
    return _update_line(O, artifactData, line, anchor, undefined, "delete");    
}


function _update_line(O: PersistenceObserver, artifactData?: object,
                      line?: number, anchor?: string, text?: string,
                      mode?: string ) // undefined/insert/delete
{
    const world = getWorldFromArtifactData(O, artifactData)  
    const worldText = world.text;
        if (!line && !anchor) return true;
        let lines = worldText.split("\n");
        if (line) {
            if (lines.length >= line) {
                lines = _appendLinesToList(lines, line-lines.length+1);
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
        updateText(O.P, world, result, true);
        return true
}

function _appendLinesToList(lines, number) {
    let count = 0;
    while (count < number) {
        lines.push("");
        number++;
    }
    return lines;
}
