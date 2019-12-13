import * as jquery from "jquery";
import * as ex from "excalibur";
import { ArtifactActor } from "./actor";
import { DIR, spawnPosition, worldWidth } from "./universe/const";
import {
    Position,
    Account,
    Avatar,
    World,
    Artifact,
    AvatarKind
} from "./universe/interfaces";
import { adjustEditor } from "./editor"
import { Game } from "./index"
import { initEditor } from "./editor"

export const visualBounds = {
    left: 40,
    right: 40,
    top: 0,
    height: 300,
    margin: 65,
};


export class PlaneScene extends ex.Scene {
    $editor: object;
    world:   World;

    public onInitialize(engine: ex.Engine) {}
    public onActivate() {}
    public onDeactivate() {}

    public timeToUpdateUniverse() {
        // global pacing
        return true;
    }

}

export class RadiusAroundActorStrategy implements ex.CameraStrategy<ex.Actor> {
    constructor(public target: ex.Actor, public radius: number) {}
    public action(
        target: ex.Actor,
        cam: ex.Camera,
        _eng: ex.Engine,
        _delta: number
    ) {
        const position = target.center;
        let focus = cam.getFocus();
        const diff = position.y - focus.y;
        if (diff > this.radius) {
            focus = focus.add(new ex.Vector(0, diff - this.radius));
        }
        if (diff < -this.radius) {
            focus = focus.add(new ex.Vector(0, diff + this.radius));
        }
        adjustEditor((_eng.currentScene as PlaneScene).$editor, focus)
        return focus;
    }
}


export function purgeScene(scene: PlaneScene, engine: Game) {
    for (let a of scene.actors) {
        scene.remove(a);
    }
}

export function setupScene(scene: PlaneScene, world: World, engine: Game) {
    let playerActor: ArtifactActor;
    for (let i in world.artifacts) {
        let actor = new ArtifactActor(world.artifacts[i]);
        if (actor.artifact.avatar) {
            if (actor.artifact.avatar.kind == AvatarKind.PLAYER) playerActor = actor;
        }
        scene.add(actor);
    }
    // create camera strategy
    scene.camera.clearAllStrategies();
    scene.camera.addStrategy(
        new RadiusAroundActorStrategy(playerActor, visualBounds.height / 2)
    );
    // create the label
    let titleHeight = 24;
    let labelHeight = 16;
    let title = new ex.UIActor();
    title.color = ex.Color.fromHex(world.owner.colors.title.bg);
    title.width = worldWidth+ visualBounds.left + visualBounds.right;
    title.height = titleHeight;
    let text = new ex.Label();
    //
    text.color = ex.Color.fromHex(world.owner.colors.title.fg);
    text.text = world.owner.name;
    text.fontFamily = "Nanum Gothic Coding, monospace"
    text.fontSize = labelHeight;
    text.fontUnit = ex.FontUnit.Px;
    text.textAlign = ex.TextAlign.Center;
    text.pos.x = title.width /2;
    text.pos.y = (title.height+labelHeight)/2;
    //
    title.add(text);
    scene.add(title);
    scene.$editor = initEditor();
    // TODO REDO the text approach
    jquery("body").css("backgroundColor", world.owner.colors.world.bg);
    jquery("textarea#editor").css("color", world.owner.colors.world.fg);
}
