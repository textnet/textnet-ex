import { ipcRenderer } from "electron";


import { PositionEvent } from "./events";
import { ArtifactActor } from "../actors/artifact";


export function updateArtifactPosition(actor: ArtifactActor) {
    let dx,dy: number;
    dx = actor.pos.x - actor.artifact.position.x;
    dy = actor.pos.y - actor.artifact.position.y;
    if (dx == 0 && dy == 0) return;
    ipcRenderer.send("position", {
        artifactId: actor.artifact.id,
        position: { x: actor.pos.x, y: actor.pos.y, dir: actor.dir }
    }) 
}