
import { Game } from "../game"
import { EnterEvent, LeaveEvent } from "./events"
import { ArtifactActor } from "../actors/artifact"
import { BaseActor } from "../actors/base"
import { RadiusAroundActorStrategy } from "../scene"

import { visualBounds } from "../../universe/const"

import * as interopSend from "../interop/send"
import { repositionCamera } from "./position"
import { inventoryArtifact } from "./inventory"


export function enterArtifact(game: Game, event: EnterEvent) {
    var scene = game.gameScene();
    if (scene.worldData.id == event.worldId) {
        event.artifactStructure.position = event.position;
        let existingActor: ArtifactActor;
        let cameraActor: ArtifactActor;
        for (let a of scene.actors) {
            const actor = a as BaseActor;
            if (actor.artifact.id == event.artifactStructure.id) {
                existingActor = actor as ArtifactActor;
                break;
            }
        }
        if (existingActor) {
            existingActor.artifact = event.artifactStructure;
            cameraActor = existingActor;
        } else {
            const actor: ArtifactActor = new ArtifactActor(event.artifactStructure);
            scene.add(actor);
            cameraActor = actor;
            if (event.inventoryStructure) {
                inventoryArtifact(game, { artifactId: actor.artifact.id, 
                    inventoryStructure: event.inventoryStructure });
            }
        }
        // setup camera if it is a player;
        if (cameraActor.artifact.isPlayer) {
            repositionCamera(game, cameraActor);
        }
    } else {
    }
}

export function leaveArtifact(game: Game, event: LeaveEvent) {
    var scene = game.gameScene();
    if (scene.worldData.id == event.worldId) {
        for (let a of scene.actors) {
            const actor = a as BaseActor;
            if (actor.artifact.id == event.artifactId) {
                scene.remove(actor)
                if (actor.artifact.isPlayer) {
                    interopSend.askForWorldLocal()
                }
            }
        }    
    }
}