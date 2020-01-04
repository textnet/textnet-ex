
import { Game } from "../game"
import { RadiusAroundActorStrategy } from "../scene"
import { PositionEvent } from "./events"
import { BaseActor } from "../actors/base"

import { visualBounds } from "../../universe/const"
import { deepCopy } from "../../universe/utils"


export function positionArtifact(game: Game, event: PositionEvent) {
    var scene = game.gameScene();
    // console.log("reposition", event.artifactId, "in", event.worldId, "at", event.position)
    if (scene.worldData.id == event.worldId) {
        for (let a of scene.actors) {
            const actor = a as BaseActor;
            if (actor.artifact.id == event.artifactId) {
                actor.pos.x = event.position.x;
                actor.pos.y = event.position.y;
                actor.dir   = event.position.dir;
                actor.artifact.position = deepCopy(event.position)
                repositionCamera(game, actor);
            }
        }
    }
}

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