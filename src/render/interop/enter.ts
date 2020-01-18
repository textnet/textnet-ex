/**
 * INTEROP: Artifacts entering and leaving the world.
 */
import { visualBounds              } from "../../const"
import { Game                      } from "../game"
import { ArtifactActor             } from "../actors/artifact"
import { BaseActor                 } from "../actors/base"
import { RadiusAroundActorStrategy } from "../scene"

import * as interopSend from "../interop/send"
import { EnterEvent, LeaveEvent    } from "./events"
import { repositionCamera          } from "./position"
import { inventoryArtifact         } from "./inventory"

/**
 * INTEROP: Artifact enters the world on stage.
 * @param {Game}       game
 * @param {EnterEvent} event
 */
export function enterArtifact(game: Game, event: EnterEvent) {
    var scene = game.gameScene();
    if (scene.worldData.id == event.worldId) {
        console.log("ENTER", event.artifactStructure.id, scene.worldData.id, event.worldId)
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

/**
 * INTEROP: Artifact leaves the world on stage.
 * @param {Game}       game
 * @param {LeaveEvent} event
 */
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