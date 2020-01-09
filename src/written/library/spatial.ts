
import { PersistenceObserver } from "../../persistence/observe/observer"
import { ObserverCommand, MoveEvent, PlaceEvent } from "../../persistence/observe/observer_events"
import { DIR, DIRfrom, spawnPosition } from "../../universe/const"
import { Artifact, World, Dir, Position } from "../../universe/interfaces"
import { deepCopy, normalizeDir } from "../../universe/utils"


import { updateProperties } from "../../persistence/mutate/properties"
import * as mutatePlace from "../../persistence/mutate/place"


export function move_to( O: PersistenceObserver, 
                         artifactData?: object, 
                         x?: number, y?: number, direction?: string, 
                         isDelta?: boolean ) {
    console.log(`<${artifactData["name"]}>.move_to( x=${x}, y=${y} )`)
    const artifact = getArtifactFromData(O, artifactData);
    const dir = DIRfrom({name:direction} as Dir);
    const artifactPos = getArtifactPos(O, artifact);
    if (x === undefined) x = artifactPos.x;
    if (y === undefined) y = artifactPos.y;
    O.executeCommand(ObserverCommand.Move, {
        artifact: artifact.id,
        x: x, 
        y: y, 
        dir: dir.name,
        isDelta: isDelta
    } as MoveEvent) // nb: async
    return true;
}

export function move_by(O: PersistenceObserver, 
                        artifactData?: object, 
                        x?: number, y?: number, 
                        direction?: string, distance?:number ) {
    const artifact = getArtifactFromData(O, artifactData);
    const dir = DIRfrom({name:direction} as Dir);
    const artifactPos = getArtifactPos(O, artifact);
    if (distance != undefined) {
        const nDir = normalizeDir(dir, distance);
        x += nDir.x;
        y += nDir.y;
    }
    return move_to(O, artifactData, x, y, direction, true) // isDelta
}

export function halt(O: PersistenceObserver, 
                     artifactData?: object) {
    console.log(`<${artifactData["name"]}>.halt()`)
    let success = false;
    const artifact = getArtifactFromData(O, artifactData);
    O.executeCommand(ObserverCommand.Halt, {}); // nb: async
    return true; 
}

export function place_at(O: PersistenceObserver, 
                         artifactData?: object, 
                         x?: number, y?: number, 
                         direction?: string,
                         isFit?:boolean) {
    const mode = isFit?"fit":"place";
    console.log(`<${artifactData["name"]}>.${mode}( x=${x}, y=${y} )`)
    let success = false;
    const artifact = getArtifactFromData(O, artifactData);
    const world = O.writtenP.worlds.load(artifact.hostId);
    const dir = DIRfrom({name:direction} as Dir);
    const artifactPos = getArtifactPos(O, artifact);
    if (x === undefined) x = artifactPos.x;
    if (y === undefined) y = artifactPos.y;
    const newPos: Position = { x:x, y:y, dir:dir };
    //
    if (world) {
        O.executeCommand(ObserverCommand.Place, {
            artifact: artifact.id,
            x: x, 
            y: y, 
            dir: dir.name,
            isFit: isFit,
        } as PlaceEvent) // nb: async
    }
    return true; 
}

export function fit_at(O: PersistenceObserver, 
                       artifactData?: object, 
                       x?: number, y?: number, 
                       direction?: string ) {
    return place_at(O, artifactData, x, y, direction, true);
}


export function getArtifactFromData(O: PersistenceObserver, artifactData?: object) {
    let artifactId;
    if (artifactData) {
        artifactId = artifactData["id"];
    } else {
        artifactId = O.ownerId;
    }
    const artifact = O.writtenP.artifacts.load(artifactId);
    return artifact;    
}

export function getArtifactPos(O: PersistenceObserver, artifact: Artifact) {
    if (artifact.hostId) {
        const hostWorld = O.writtenP.worlds.load(artifact.hostId);
        return hostWorld.artifactPositions[artifact.id];
    } else {
        return deepCopy(spawnPosition);
    }
}
