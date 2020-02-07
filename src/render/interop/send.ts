/**
 * INTEROP: Shooting events back to the main process:
 *  - position      - update artifact position
 *  - askForWorld   - ask for a world to set up next
 *  - askForPlayer  - ask for a player to enter the world
 *  - push          - try to push
 *  - pickup        - try to pickup
 *  - goto          - try to enter an artifact's world
 *  - leave         - try to leave the current world
 *  - stand         - done with editing, send updated text
 */
import { ipcRenderer } from "electron";

import { ArtifactActor } from "../actors/artifact";
import { GameScene } from "../scene"
import { Position, Dir } from "../../interfaces"
import { PositionEvent, 
         PushEvent, 
         PickupEvent, 
         GotoEvent, 
         LeaveEvent, 
         StandEvent,
         StartMovingEvent, 
         StopMovingEvent,    } from "./events";

/**
 * INTEROP-> Attempt to move an artifact to a new position.
 * @param {ArtifactActor} actor
 */
export function updateArtifactPosition(actor: ArtifactActor) {
    let dx,dy: number;
    dx = actor.pos.x - actor.artifact.position.x;
    dy = actor.pos.y - actor.artifact.position.y;
    if (dx == 0 && dy == 0) return;
    ipcRenderer.send("position", {
        artifactId: actor.artifact.id,
        worldId: (actor.scene as GameScene).worldData.id,
        position: { x: actor.pos.x, y: actor.pos.y, dir: actor.dir }
    } as PositionEvent) 
}

/**
 * INTEROP-> Ask for a world data (and list of artifacts) to build a game scene.
 */
export function askForWorldLocal() {
    ipcRenderer.send("askForWorld", {});
}

/**
 * INTEROP-> Ask for a player to enter the world just built.
 * Done separately from the building of the world.
 */
export function askForPlayer() {
    ipcRenderer.send("askForPlayer", {});
}

/**
 * INTEROP-> Attempt of an actor to push in a direction
 * @param {ArtifactActor} actor
 * @param {Dir}           dir
 */
export function push(actor: ArtifactActor, dir: Dir) {
    ipcRenderer.send("push", {
        artifactId: actor.artifact.id,
        direction: dir
    } as PushEvent) 
}

export function startMoving(actor: ArtifactActor) {
    ipcRenderer.send("startMoving", {
        artifactId: actor.artifact.id,
    } as StartMovingEvent) 
}

export function stopMoving(actor: ArtifactActor) {
    ipcRenderer.send("stopMoving", {
        artifactId: actor.artifact.id,
    } as StopMovingEvent) 
}

/**
 * INTEROP-> Attempt of an actor to pickup something in the given direction
 * @param {ArtifactActor} actor
 * @param {Dir}           dir
 */
export function pickup(actor: ArtifactActor, dir: Dir) {
    ipcRenderer.send("pickup", {
        artifactId: actor.artifact.id,
        direction: dir
    } as PickupEvent) 
}

/**
 * INTEROP-> Attempt of an actor to enter another artifact in the given direction.
 * @param {ArtifactActor} actor
 * @param {Dir}           dir
 */
export function goto(actor: ArtifactActor, dir: Dir) {
    ipcRenderer.send("goto", {
        artifactId: actor.artifact.id,
        direction: dir
    } as GotoEvent) 
}

/**
 * INTEROP-> Attempt of an actor to leave the world and go up her stack of visits.
 * @param {ArtifactActor} actor
 * @param {Dir}           dir
 */
export function leave(actor: ArtifactActor) {
    ipcRenderer.send("leave", {
        artifactId: actor.artifact.id,
    } as LeaveEvent) 
}

/**
 * INTEROP-> Actor stands and sends updated text to Persistence.
 * @param {ArtifactActor} actor
 * @param {string}        text
 * @param {Position}      Position
 */
export function stand(actor: ArtifactActor, text: string, pos: Position) {
    ipcRenderer.send("stand", {
        artifactId: actor.artifact.id,
        text: text,
        position: pos
    } as StandEvent)
}