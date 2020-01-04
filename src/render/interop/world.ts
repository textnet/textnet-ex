import * as jquery from "jquery";
import * as ex from "excalibur";

import { worldWidth, visualBounds } from "../../universe/const"

import { Game } from "../game"
import { GameScene } from "../scene"
import { ArtifactActor } from "../actors/artifact"
import { initEditor, updateEditor } from "../editor"

import { askForPlayer, askForWorldLocal } from "./send"
import { InventoryEvent } from "./events"
import { inventoryArtifact } from "./inventory";

import { WorldStructure, AccountStructure, ArtifactStructure } from "../data_structures"

export function prepareWorld(game: Game, params) {
    const oldScene = game.gameScene();
    if (oldScene) game.removeScene(oldScene);
    const scene = new GameScene(game);
    game.addScene(game.gameSceneName(), scene);
    game.goToScene(game.gameSceneName())

    const worldData:   WorldStructure      = params["world"];
    const accountData: AccountStructure    = params["account"];
    const artifacts:   ArtifactStructure[] = params["artifacts"];
    const inventoryEvents: InventoryEvent[] = params["inventoryEvents"]
    scene.worldData = worldData;
    for (let i in artifacts) {
        let actor = new ArtifactActor(artifacts[i]);
        scene.add(actor);
    }
    for (let event of inventoryEvents) {
        inventoryArtifact(game, event)
    }
    // // create the label
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
    scene.editor = game.editor;
    updateEditor(scene);    
    // // resume
    game.start();
    // ask for player!
    askForPlayer();
}
