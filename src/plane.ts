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
import { updateEditor, adjustEditor, initEditor, Editor } from "./editor"
import { Game } from "./index"
import { AvatarObserver } from "./observe"
import { 
    ScriptTextEvent,
    ScriptPropertiesEvent,
} from "./universe/events"


/**
 * Excalibur engine operates with Scenes.
 * We use only one scene to represent worlds that a player is visiting.
 * When a player switches world, we clean and repopulate same stage.
 *
 * It is possible that we'll need to put some loaders in multiplayer stage.
 * But now we can get away with this very simple solution.
 */

/**
 * When we draw a scene, we use some visual padding around the actual world.
 */
export const visualBounds = {
    left: 43, right: 43,
    top: 0,   height: 150,
    margin: 65,
};


/**
 * Scene object we use to draw everything related to the game content.
 */
export class PlaneScene extends ex.Scene {
    editor: Editor;
    world:  World;
    observers: Record<string,AvatarObserver>;
    handlers: Record<string,any>;

    public onInitialize(engine: Game) {}
    public onActivate() {}
    public onDeactivate() {}

    public onPostUpdate(engine: Game) {
        updateEditor(this);
    }

    public timeToUpdateUniverse() {
        // global pacing
        return true;
    }

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
        const diff = position.y - focus.y;
        if (diff > this.radius) {
            focus = focus.add(new ex.Vector(0, diff - this.radius));
        }
        if (diff < -this.radius) {
            focus = focus.add(new ex.Vector(0, diff + this.radius));
        }
        adjustEditor((_eng.currentScene as PlaneScene).editor, focus)
        return focus;
    }
}


/**
 * Update the artifact position on the scene when the change is not 
 * coming through an Actor.
 * Used to sync visual state with the universe state.
 * Universe state is the source of truth.
 */
export function updateArtifactOnScene(scene: PlaneScene, artifact: Artifact) {
    for (let a of scene.actors) {
        const actor: ArtifactActor = a as ArtifactActor;
        if (actor.artifact.id == artifact.id) {
            actor.dir   = artifact.coords.position.dir;
            actor.pos.x = artifact.coords.position.x;
            actor.pos.y = artifact.coords.position.y;
        }
    }
}

/**
 * Remove all actors from the scene when we leave the world.
 * @param {PlaneScene} scene
 * @param {Game} engine
 */
export function purgeScene(scene: PlaneScene, engine: Game) {
    for (let a of scene.actors) {
        scene.remove(a);
    }
    if (scene.observers) {
        for (let i in scene.observers) {
            scene.observers[i].free()
        }
    }
    for (let e in scene.handlers) {
        engine.syncDispatcher.off(e, scene.handlers[e]);
    }
}

/**
 * Populate the scene with all actors required to represent the world.
 * Also sets up the camera.
 * Currently also sets the editor.
 * REVISE
 * @param {PlaneScene} scene
 * @param {World}      world
 * @param {Game}       engine
 */
export function setupScene(scene: PlaneScene, world: World, engine: Game) {
    let playerActor: ArtifactActor;
    for (let i in world.artifacts) {
        let actor = new ArtifactActor(world.artifacts[i]);
        if (actor.artifact.avatar) {
            if (actor.artifact.avatar.kind == AvatarKind.PLAYER) playerActor = actor;
        }
        scene.add(actor);
        actor.artifact.dispatcher = engine.syncDispatcher; // TODO events better understood

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
    text.fontFamily = "Nanum Gothic Coding, monospace"; // TODO FIX
    text.fontSize = labelHeight;
    text.fontUnit = ex.FontUnit.Px;
    text.textAlign = ex.TextAlign.Center;
    text.pos.x = title.width /2;
    text.pos.y = (title.height+labelHeight)/2;
    //
    title.add(text);
    scene.add(title);
    // editor-world connection
    scene.world = world;
    if (!scene.editor) scene.editor = initEditor(engine);
    updateEditor(scene);
    // event handlers
    scene.handlers = {};
    scene.handlers["script:properties"] = function(event: ScriptPropertiesEvent) {
        // update name and other editor properties
        if (scene.world.owner.id == event.artifact.id) {
            text.text = world.owner.name;
            scene.editor.getSession().setMode('ace/mode/'+world.owner.format);
        }
    };
    scene.handlers["script:text"] = function(event: ScriptTextEvent) {
        if (event.params["compile"] && scene.observers[event.artifact.id]) {
            scene.observers[event.artifact.id].attemptAvatar();
        }
    };
    for (let e in scene.handlers) {
        engine.syncDispatcher.on(e, scene.handlers[e]);
    }
    // observers
    scene.observers = {};
    scene.observers[world.owner.id] = new AvatarObserver(world.owner);
    for (let i in world.artifacts) {
        if (world.artifacts[i] != world.owner) {
            scene.observers[ world.artifacts[i].id ] = new AvatarObserver(world.artifacts[i]);
        }
    }    
}

