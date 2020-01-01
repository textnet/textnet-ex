
import { Game } from "../game"
import { PositionEvent } from "./events"
import { BaseActor } from "../actors/base"

import { deepCopy } from "../../universe/utils"


export function positionArtifact(game: Game, event: PositionEvent) {
    var scene = game.gameScene();
    if (scene.worldData.id == event.worldId) {
        for (let a of scene.actors) {
            const actor = a as BaseActor;
            if (actor.artifact.id == event.artifactId) {
                actor.pos.x = event.position.x;
                actor.pos.y = event.position.y;
                actor.dir   = event.position.dir;
                actor.artifact.position = deepCopy(event.position)
            }
        }
    }
}