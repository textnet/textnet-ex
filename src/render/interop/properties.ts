import * as ex from "excalibur";

import { Game } from "../game"
import { ArtifactPropertiesEvent, WorldPropertiesEvent } from "./events"
import { BaseActor } from "../actors/base"
import { artifactPrivateProperties } from "../data_structures"
import { updateProperties } from "./world"


export function propertiesArtifact(game: Game, event: ArtifactPropertiesEvent ) {
    const scene = game.gameScene();
    for (let a of scene.actors) {
        const actor = a as BaseActor;
        if (actor.artifact.id == event.artifactStructure.id) {
            for (let key in actor.artifact) {
                if (artifactPrivateProperties.indexOf(key) < 0) {
                    actor.artifact[key] = event.artifactStructure[key];
                }
            }
        }
    }
}    

export function propertiesWorld(game: Game, event: WorldPropertiesEvent ) {
    updateProperties(game, event)
}