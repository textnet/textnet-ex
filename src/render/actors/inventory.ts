/**
 * Inventiory Actor Module.
 * ----------------------
 * When a player holds an artifact in hands, it is rendered as {InventoryActor}
 *
 * As an avatar picks an artifact up, it is removed from the game scene
 * as 'ArtifactActor' and put back as 'InventoryActor' instead.
 * It allows not only for a different rendering style, but also
 * for spatial transparency.
 */
import * as ex from "excalibur";

import { DIR               } from "../../const"
import { ArtifactStructure } from "../data_structures"
import { BaseActor         } from "./base";

/**
 * Visual helper actor for artifacts that an avatar holds in the inventory.
 */
export class InventoryActor extends BaseActor {
    /**
     * Build an actor from the artifact.
     */
    constructor(artifactData: ArtifactStructure) {
        super(artifactData);
        this.opacity = 0.90;
        this.rotation = -Math.PI/16;
        this.dir = DIR.UP;
    }
}
