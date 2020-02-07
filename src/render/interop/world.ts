/**
 * INTEROP: World-related
 *  - Create a scene for the new world
 *  - Update properties on the scene
 *  - Update the text.
 */
import * as jquery from "jquery";
import * as ex     from "excalibur";

import { worldWidth, visualBounds, uiSettings } from "../../const"
import { Game                                 } from "../game"
import { GameScene, RadiusAroundSpawnPointStrategy } from "../scene"
import { ArtifactActor                        } from "../actors/artifact"
import { initEditor, updateEditor             } from "../editor"

import { askForPlayer, askForWorldLocal                  } from "./send"
import { InventoryEvent, TextEvent, WorldPropertiesEvent } from "./events"
import { inventoryArtifact                               } from "./inventory";

import { WorldStructure, 
         AccountStructure, 
         ArtifactStructure } from "../data_structures"

/**
 * INTEROP: Prepare new world
 * Create scene, plant actors, prep editor and UI.
 * @param {Game}   game
 * @param {object} params
 */
export function prepareWorld(game: Game, params) {
    const oldScene = game.gameScene();
    if (oldScene) game.removeScene(oldScene);
    const scene = new GameScene(game);
    game.addScene(game.gameSceneName(), scene);
    game.goToScene(game.gameSceneName())
    // plant artifacts
    const worldData:   WorldStructure      = params["world"];
    const accountData: AccountStructure    = params["account"];
    const artifacts:   ArtifactStructure[] = params["artifacts"];
    const inventoryEvents: InventoryEvent[] = params["inventoryEvents"]
    for (let i in artifacts) {
        let actor = new ArtifactActor(artifacts[i]);
        scene.add(actor);
    }
    for (let event of inventoryEvents) {
        inventoryArtifact(game, event)
    }
    // create UI
    let titleHeight = uiSettings.titleHeight;
    let labelHeight = uiSettings.labelFontSize;
    let title = new ex.UIActor();
    title.width = worldWidth+ visualBounds.left + visualBounds.right;
    title.height = titleHeight;
    let text = new ex.Label();
    text.fontFamily = uiSettings.fontFamily;
    text.fontSize = labelHeight;
    text.fontUnit = ex.FontUnit.Px;
    text.textAlign = ex.TextAlign.Center;
    text.pos.x = title.width /2;
    text.pos.y = (title.height+labelHeight)/2;
    title.add(text);
    scene.add(title);
    scene.environmentActors = {
        title: title,
        label:  text,
    }
    // set Editor and update scene
    scene.editor = game.editor;
    updateSceneFromWorld(scene, worldData);
    updateEditor(scene);
    // default camera
    scene.camera.addStrategy(
        new RadiusAroundSpawnPointStrategy(title, visualBounds.height / 2)
    );    
    // Go!
    game.start();
    askForPlayer();
    // console.log(`WORLD ${worldData.id} <${worldData.name}>`, worldData)
}

/**
 * INTEROP: Update world visual properties.
 * Update colors, name, textformat.
 * @param {Game}                 game
 * @param {WorldPropertiesEvent} event
 */
export function updateProperties(game: Game, event: WorldPropertiesEvent) {
    const scene = game.gameScene();
    if (scene.worldData.id == event.worldStructure.id) { 
        updateSceneFromWorld(scene, event.worldStructure);
    }
}


/**
 * INTEROP: Update editor text from the world.
 * @param {Game}      game
 * @param {TextEvent} event
 */
export function updateText(game: Game, event: TextEvent) {
    var scene = game.gameScene();
    if (scene.worldData.id == event.worldId) {
        console.log("updating text...")
        scene.worldData.text = event.text;
        updateEditor(scene);       
    }
}



/**
 * Internal: update visual properties of scene from the world (colors, text).
 * @param {GameScene}      scene
 * @param {WorldStructure} worldData
 */
function updateSceneFromWorld(scene: GameScene, worldData: WorldStructure) {
    // console.log("update scene", worldData)
    scene.worldData = worldData;
    const label = (scene.environmentActors["label"] as ex.Label);
    const title = (scene.environmentActors["title"] as ex.UIActor)
    label.text = worldData.name;
    label.color = ex.Color.fromHex(worldData.colors.title.fg);
    title.color = ex.Color.fromHex(worldData.colors.title.bg);
    scene.editor.getSession().setMode('ace/mode/'+worldData.format);
    // todo: main text fg/bg
}