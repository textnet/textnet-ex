/**
 * INTEROP: Artifacts and camera changing positions.
 */
import { visualBounds              } from "../../const"
import { deepCopy                  } from "../../utils"
import { Game                      } from "../game"
import { RadiusAroundActorStrategy } from "../scene"
import { BaseActor                 } from "../actors/base"
import { ArtifactActor             } from "../actors/artifact"

import { PositionEvent             } from "./events"

/**
 * INTEROP: Artifact changes position on stage
 * @param {Game}       game
 * @param {PositionEvent} event
 */
export function positionArtifact(game: Game, event: PositionEvent) {
    var scene = game.gameScene();
    console.log("reposition", event.artifactId, "in", event.worldId, "at", event.position)
    if (scene.worldData.id == event.worldId) {
        for (let a of scene.actors) {
            const actor = a as BaseActor;
            if (actor.artifact.id == event.artifactId) {
                const artifactActor = actor as ArtifactActor;
                const vel = { 
                    x: event.position.x - artifactActor.pos.x,
                    y: event.position.y - artifactActor.pos.y,
                };
                if (Math.abs(vel.x) + Math.abs(vel.y) > 0) {
                    artifactActor.continueMoving();    
                } else {
                    artifactActor.stopMoving();
                }
                actor.pos.x = event.position.x;
                actor.pos.y = event.position.y;
                actor.dir   = event.position.dir;
                actor.artifact.position = deepCopy(event.position)
                artifactActor.isKneeled = false;
                repositionCamera(game, actor);
            }
        }
    }
}

/**
 * Internal: Adjust camera if the player's actor has moved.
 * @param {Game}      game
 * @param {BaseActor} actor
 */
export function repositionCamera(game: Game, actor: BaseActor) {
    var scene = game.gameScene();
    if (actor.artifact.isPlayer && !scene.hasCamera) {
        scene.hasCamera = true;
        scene.camera.clearAllStrategies();
        scene.camera.addStrategy(
            new RadiusAroundActorStrategy(actor, visualBounds.height / 2)
        );
    }

}