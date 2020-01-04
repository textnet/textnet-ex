import { ipcRenderer } from "electron";


import { PositionEvent, PushEvent, PickupEvent, 
         GotoEvent, LeaveEvent, StandEvent } from "./events";
import { ArtifactActor } from "../actors/artifact";
import { Position, Dir } from "../../universe/interfaces"


export function updateArtifactPosition(actor: ArtifactActor) {
    let dx,dy: number;
    dx = actor.pos.x - actor.artifact.position.x;
    dy = actor.pos.y - actor.artifact.position.y;
    if (dx == 0 && dy == 0) return;
    ipcRenderer.send("position", {
        artifactId: actor.artifact.id,
        position: { x: actor.pos.x, y: actor.pos.y, dir: actor.dir }
    } as PositionEvent) 
}

export function askForWorldLocal() {
    ipcRenderer.send("askForWorld", {});
}

export function askForPlayer() {
    ipcRenderer.send("askForPlayer", {});
}

export function push(actor: ArtifactActor, dir: Dir) {
    ipcRenderer.send("push", {
        artifactId: actor.artifact.id,
        direction: dir
    } as PushEvent) 
}

export function pickup(actor: ArtifactActor, dir: Dir) {
    ipcRenderer.send("pickup", {
        artifactId: actor.artifact.id,
        direction: dir
    } as PickupEvent) 
}

export function goto(actor: ArtifactActor, dir: Dir) {
    ipcRenderer.send("goto", {
        artifactId: actor.artifact.id,
        direction: dir
    } as GotoEvent) 
}

export function leave(actor: ArtifactActor) {
    ipcRenderer.send("leave", {
        artifactId: actor.artifact.id,
    } as LeaveEvent) 
}

export function stand(actor: ArtifactActor, text: string, pos: Position) {
    ipcRenderer.send("stand", {
        artifactId: actor.artifact.id,
        text: text,
        position: pos
    } as StandEvent)
}