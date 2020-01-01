import * as jquery from "jquery";
import * as ex from "excalibur";

import { worldWidth, visualBounds } from "../../universe/const"

import { Game } from "../game"
import { GameScene } from "../scene"
import { RadiusAroundActorStrategy } from "../scene"
import { ArtifactActor } from "../actors/artifact"
import { initEditor, updateEditor } from "../editor"

import { WorldStructure, AccountStructure, ArtifactStructure } from "../data_structures"

export function enterWorld(game: Game, params) {
    console.log("enterWorld", params)
    const scene = game.gameScene();
    const worldData:   WorldStructure      = params["world"];
    const accountData: AccountStructure    = params["account"];
    const artifacts:   ArtifactStructure[] = params["artifacts"];
    scene.worldData = worldData;
    // stop game
    game.stop();
    // setup scene
    let playerActor: ArtifactActor;
    for (let a of scene.actors) {
        scene.remove(a);
    }
    for (let i in artifacts) {
        let actor = new ArtifactActor(artifacts[i]);
        if (actor.artifact.isPlayer) {
            playerActor = actor;
        }
        scene.add(actor);
    }
    // setup camera
    if (playerActor) {
        scene.camera.clearAllStrategies();
        scene.camera.addStrategy(
            new RadiusAroundActorStrategy(playerActor, visualBounds.height / 2)
        );
    }
    // create the label
    let titleHeight = 24;
    let labelHeight = 16;
    let title = new ex.UIActor();
    title.color = ex.Color.fromHex(worldData.colors.title.bg);
    title.width = worldWidth+ visualBounds.left + visualBounds.right;
    title.height = titleHeight;
    let text = new ex.Label();
    text.color = ex.Color.fromHex(worldData.colors.title.fg);
    text.text = worldData.name; //
    text.fontFamily = "Nanum Gothic Coding, monospace"; // TODO FIX
    text.fontSize = labelHeight;
    text.fontUnit = ex.FontUnit.Px;
    text.textAlign = ex.TextAlign.Center;
    text.pos.x = title.width /2;
    text.pos.y = (title.height+labelHeight)/2;
    title.add(text);
    scene.add(title);
    // editor
    if (!scene.editor) scene.editor = initEditor(game);
    updateEditor(scene);    
    // resume
    game.goToScene(game.gameSceneName())
    game.start();

}
