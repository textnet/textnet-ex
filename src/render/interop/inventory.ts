/**
 * INTEROP: Inventory
 */
import * as ex from "excalibur";

import { visualBounds   } from "../../const"
import { Game           } from "../game"
import { InventoryActor } from "../actors/inventory"
import { ArtifactActor  } from "../actors/artifact"
import { InventoryEvent } from "./events"


/**
 * INTEROP: Update visual representation of inventory
 * @param {Game}           game
 * @param {InventoryEvent} event
 */
export function inventoryArtifact(game: Game, event: InventoryEvent) {
    var scene = game.gameScene();
    for (let a of scene.actors) {
        const actor = a as ArtifactActor;
        if (actor.artifact.id == event.artifactId) {
            if (actor.inventory) {
                actor.remove(actor.inventory);
                delete actor.inventory;
            }
            if (event.inventoryStructure) {
                actor.inventory = new InventoryActor(event.inventoryStructure);
                actor.inventory.pos = new ex.Vector(
                    actor.artifact.body.size[0]/2
                        +actor.inventory.artifact.body.size[0]/2*actor.inventory.scale.x,
                    0
                        -actor.inventory.artifact.body.size[1]/2*actor.inventory.scale.y
                )
                actor.add(actor.inventory);
            }
        }
    }
}    
