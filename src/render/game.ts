import * as ex from "excalibur";
import { ipcRenderer } from "electron";

import { visualBounds, worldWidth } from "../universe/const";

import { interopSetup } from "./interop/setup"
import { GameScene } from "./scene"


/**
 * Main module. 
 * Also contains overrides for the Excalibur engine.
 * Currently creates everything anew on each restart.
 * To be rewritten as we reach 'persistence' stage.
 */
const gameSceneName = "world";

export class Game extends ex.Engine {
    syncDispatcher: ex.EventDispatcher;
    constructor() {
        super({
            width: worldWidth + visualBounds.left + visualBounds.right,
            height: visualBounds.height + 2*visualBounds.margin,
        });
    }

    gameSceneName() { return "world" }
    gameScene() {
        return this.scenes[this.gameSceneName()] as GameScene;
    }

}

export function runGame() {
    const game = new Game();
    const loader = new ex.Loader();
    loader.suppressPlayButton = true;
    game.backgroundColor = ex.Color.fromRGB(0,0,0,0)
    
    const scene = new GameScene(game);
    game.addScene(game.gameSceneName(), scene);

    interopSetup(game);
    ipcRenderer.send("askToStart")
}


