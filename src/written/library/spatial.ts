
import { PersistenceObserver } from "../../persistence/observe/observer"
import { ObserverCommand, MoveEvent } from "../../persistence/observe/observer_events"
import { DIR, DIRfrom, spawnPosition } from "../../universe/const"
import { Artifact, World, Dir, Position } from "../../universe/interfaces"
import { deepCopy, normalizeDir } from "../../universe/utils"


import { updateProperties } from "../../persistence/mutate/properties"
import * as mutatePlace from "../../persistence/mutate/place"


export async function move_to( O: PersistenceObserver, 
                               artifactData?: object, 
                               x?: number, y?: number, direction?: string ) {
    console.log(`<${artifactData["name"]}>.move_to( x=${x}, y=${y} )`)
    const artifact = await getArtifactFromData(O, artifactData);
    const dir = DIRfrom({name:direction} as Dir);
    const artifactPos = await getArtifactPos(O, artifact);
    if (x === undefined) x = artifactPos.x;
    if (y === undefined) y = artifactPos.y;
    await O.executeCommand(ObserverCommand.Move, {
        artifact: artifact.id,
        x: x, 
        y: y, 
        dir: dir.name
    } as MoveEvent)
    return true;
}

export async function move_by( O: PersistenceObserver, 
                               artifactData?: object, 
                               x?: number, y?: number, 
                               direction?: string, distance?:number ) {
    const artifact = await getArtifactFromData(O, artifactData);
    const dir = DIRfrom({name:direction} as Dir);
    const artifactPos = await getArtifactPos(O, artifact);
    if (x === undefined) x = 0;
    if (y === undefined) y = 0;
    x += artifactPos.x;
    y += artifactPos.y;
    if (distance != undefined) {
        const nDir = normalizeDir(dir, distance);
        x += nDir.x;
        y += nDir.y;
    }
    return await move_to(O, artifactData, x, y, direction)
}

export async function place_at( O: PersistenceObserver, 
                               artifactData?: object, 
                               x?: number, y?: number, 
                               direction?: string,
                               isFit?:boolean) {
    let success = false;
    const artifact = await getArtifactFromData(O, artifactData);
    const world = await O.P.worlds.load(artifact.hostId);
    const dir = DIRfrom({name:direction} as Dir);
    const artifactPos = await getArtifactPos(O, artifact);
    if (x === undefined) x = artifactPos.x;
    if (y === undefined) y = artifactPos.y;
    const newPos: Position = { x:x, y:y, dir:dir };
    //
    if (world) {
        if (isFit) {
            success = await mutatePlace.fit(O.P, artifact, world, newPos);
        } else {
            success = await mutatePlace.place(O.P, artifact, world, newPos);    
        }
        
    }
    return success;
}

export async function fit_at( O: PersistenceObserver, 
                               artifactData?: object, 
                               x?: number, y?: number, 
                               direction?: string ) {
    return await place_at(O, artifactData, x, y, direction, true);
}


async function getArtifactFromData(O: PersistenceObserver, artifactData?: object) {
    let artifactId;
    if (artifactData) {
        artifactId = artifactData["id"];
    } else {
        artifactId = O.ownerId;
    }
    const artifact = await O.P.artifacts.load(artifactId);
    return artifact;    
}

async function getArtifactPos(O: PersistenceObserver, artifact: Artifact) {
    if (artifact.hostId) {
        const hostWorld = await O.P.worlds.load(artifact.hostId);
        return hostWorld.artifactPositions[artifact.id];
    } else {
        return deepCopy(spawnPosition);
    }
}
