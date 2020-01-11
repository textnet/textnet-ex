/** 
 * Module about rendering the game scene.
 */
import * as jquery from "jquery";
import * as ex from "excalibur";

import { visualBounds                      } from "../const"
import { WorldStructure, ArtifactStructure } from "./data_structures"
import { ArtifactActor                     } from "./actors/artifact";
import { InventoryActor                    } from "./actors/inventory";
import { Game                              } from "./game"
import { Editor, adjustEditorFocus              } from "./editor"

/** 
 * Excalibur Scene with some additional properties:
 * - editor link
 * - world and artifact data
 * - list of UI actors (non-artifact-based)
 */
export class GameScene extends ex.Scene {
    editor?: Editor;
    hasCamera?: boolean;
    worldData?: WorldStructure;
    artifacts?: Record<string, ArtifactStructure>;
    environmentActors?: Record<string, ex.Actor>;
}

/** 
 * Strategy to move camera in a way that it always follows the player actor.
 */
export class RadiusAroundActorStrategy implements ex.CameraStrategy<ex.Actor> {
    constructor(public target: ex.Actor, public radius: number) {}

    /** 
     * Called regularly in the draw/update cycle.
     * As the player's actor nears screen boundary, we start to move camera,
     * so the player will alwyas stay in the visible area.
     */
    public action(
        target: ex.Actor,
        cam: ex.Camera,
        _eng: ex.Engine,
        _delta: number
    ) {
        const position = target.center;
        let focus = cam.getFocus();
        focus.y = visualBounds.height/2;
        const diff = position.y - focus.y;
        if (diff > this.radius) {
            focus = focus.add(new ex.Vector(0, diff - this.radius));
        }
        if (diff < -this.radius) {
            focus = focus.add(new ex.Vector(0, diff + this.radius));
        }
        const scene = target.scene as GameScene
        const artifactActor = target as ArtifactActor;
        if (scene && !artifactActor.isKneeled) {
            adjustEditorFocus(scene.editor, focus)
        }
        return focus;
    }
}

