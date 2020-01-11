/**
 * Written Word: Spatial Commands (move/place/fit)
 *
 * NB: these are commands, so don't expect an artifact
 * to be moved right after sending the command. It will
 * happen in asynchronous way (and in a smooth way).
 *
 * Such commands can be chained, so you can 'program'
 * the route.
 */

import { DIR, DIRfrom, spawnPosition }    from "../../const"
import { Artifact, World, Dir, Position } from "../../interfaces"
import { normalizeDir }                   from "../../utils"

import { MoveEvent, PlaceEvent,
         ObserverCommand }       from "../../persistence/observe/observer_events"
import { PersistenceObserver }   from "../../persistence/observe/observer"
import { updateProperties }      from "../../persistence/mutate/properties"
import * as mutatePlace          from "../../persistence/mutate/place"

import { getArtifactFromData, getArtifactPos } from "./tools"

/**
 * Move an artifact to position (x,y) and turn it to (direction).
 * Also accepts delta values (not to be used directly).
 * @param {PersistenceObserver} O
 * @optional @param {object}  artifactData @see "get.ts"
 * @optional @param {number}  x
 * @optional @param {number}  y
 * @optional @param {string}  direction
 * @optional @param {boolean} isDelta - (x,y) are relative?
 */
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

/**
 * Move an artifact by position (x,y) and turn it to (direction).
 * (x,y) are relative to the current position.
 * Instead of (x,y) pair of (direction, distance) can be used.
 * @param {PersistenceObserver} O
 * @optional @param {object}  artifactData @see "get.ts"
 * @optional @param {number}  x
 * @optional @param {number}  y
 * @optional @param {string}  direction
 * @optional @param {string}  distance
 */
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

/**
 * Halts the programmed sequence of moves.
 * Whenever this command is issued, and artifact stops moving
 * even if it has not reached its destination.
 * @param {PersistenceObserver} O
 * @optional @param {object}  artifactData @see "get.ts"
 */
export function halt(O: PersistenceObserver, 
                     artifactData?: object) {
    console.log(`<${artifactData["name"]}>.halt()`)
    let success = false;
    const artifact = getArtifactFromData(O, artifactData);
    O.executeCommand(ObserverCommand.Halt, {}); // nb: async
    return true; 
}

/**
 * Places an artifact to (x,y) instantaneously.
 * Fails, if there is no space to place it w/o collusion.
 * To override that, use `fit`.
 * @param {PersistenceObserver} O
 * @optional @param {object}  artifactData @see "get.ts"
 * @optional @param {number}  x
 * @optional @param {number}  y
 * @optional @param {string}  direction
 * @optional @param {boolean} isFit (don't use directly)
 */
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

/**
 * Fits an artifact to the nearest free position around (x,y).
 * Always succeeds.
 * @param {PersistenceObserver} O
 * @optional @param {object}  artifactData @see "get.ts"
 * @optional @param {number}  x
 * @optional @param {number}  y
 * @optional @param {string}  direction
 */
export function fit_at(O: PersistenceObserver, 
                       artifactData?: object, 
                       x?: number, y?: number, 
                       direction?: string ) {
    return place_at(O, artifactData, x, y, direction, true);
}



