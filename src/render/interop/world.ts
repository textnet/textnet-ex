import * as jquery from "jquery";
import * as ex from "excalibur";

import { worldWidth, visualBounds } from "../../universe/const"

import { Game } from "../game"
import { GameScene } from "../scene"
import { ArtifactActor } from "../actors/artifact"
import { initEditor, updateEditor } from "../editor"

import { askForPlayer } from "./send"

import { WorldStructure, AccountStructure, ArtifactStructure } from "../data_structures"

export function prepareWorld(game: Game, params) {
    const scene = game.gameScene();
    const worldData:   WorldStructure      = params["world"];
    const accountData: AccountStructure    = params["account"];
    const artifacts:   ArtifactStructure[] = params["artifacts"];
    scene.worldData = worldData;
    // stop game
    game.stop();
    // setup scene
    for (let a of scene.actors) {
        scene.remove(a);
    }
    for (let i in artifacts) {
        let actor = new ArtifactActor(artifacts[i]);
        scene.add(actor);
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
    // ask for player!
    askForPlayer();
}
