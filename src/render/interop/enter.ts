
import { Game } from "../game"
import { EnterEvent, LeaveEvent } from "./events"
import { ArtifactActor } from "../actors/artifact"
import { BaseActor } from "../actors/base"
import { RadiusAroundActorStrategy } from "../scene"

import { visualBounds } from "../../universe/const"


export function enterArtifact(game: Game, event: EnterEvent) {
    var scene = game.gameScene();
    const actor: ArtifactActor = new ArtifactActor(event.artifactStructure);
    scene.add(actor);
    // setup camera if it is a player;
    if (actor.artifact.isPlayer) {
        scene.camera.clearAllStrategies();
        scene.camera.addStrategy(
            new RadiusAroundActorStrategy(actor, visualBounds.height / 2)
        );
    }
}

export function leaveArtifact(game: Game, event: LeaveEvent) {
    var scene = game.gameScene();
    for (let a of scene.actors) {
        const actor = a as BaseActor;
        if (actor.artifact.id == event.artifactId) {
            scene.remove(actor)
        }
    }    
}