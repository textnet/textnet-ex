/**
 * INTEROP: Movement Dynamics
 */
import * as ex from "excalibur";

import { visualBounds   } from "../../const"
import { Game           } from "../game"
import { InventoryActor } from "../actors/inventory"
import { ArtifactActor  } from "../actors/artifact"
import { StartMovingEvent, StopMovingEvent } from "./events"


export function startMovingArtifact(game: Game, event: StartMovingEvent) {
    var scene = game.gameScene();
    for (let a of scene.actors) {
        const actor = a as ArtifactActor;
        if (actor.artifact.id == event.artifactId && !actor.artifact.isPlayer) {
            actor.startMoving();
        }
    }
}    

export function stopMovingArtifact(game: Game, event: StopMovingEvent) {
    var scene = game.gameScene();
    for (let a of scene.actors) {
        const actor = a as ArtifactActor;
        if (actor.artifact.id == event.artifactId && !actor.artifact.isPlayer) {
            actor.stopMoving();
        }
    }
}    
