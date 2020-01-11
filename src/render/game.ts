/**
 * Main module. 
 * Also contains overrides for the Excalibur engine.
 * Currently creates everything anew on each restart.
 * To be rewritten as we reach 'persistence' stage.
 */
import * as ex from "excalibur";
import { ipcRenderer } from "electron";

import { visualBounds, worldWidth } from "../const";
import { GameScene                } from "./scene"
import { Editor, initEditor       } from "./editor"

import * as interopSend from "./interop/send"
import { interopSetup } from "./interop/setup"


/**
 * Extension of the Excalibur engine that initialises it
 * with world boundaries from the config.
 */
export class Game extends ex.Engine {
    editor?: Editor;
    syncDispatcher: ex.EventDispatcher;
    constructor() {
        super({
            width: worldWidth + visualBounds.left + visualBounds.right,
            height: visualBounds.height + 2*visualBounds.margin,
        });
    }

    gameSceneName() { return "world" }
    gameScene()     { return this.scenes[this.gameSceneName()] as GameScene; }

}

/**
 * A proper and simple setup of the Excalibur called
 * from the renderer process of Electron.
 */
export function runGame() {
    const game = new Game();
    const loader = new ex.Loader();
    loader.suppressPlayButton = true;
    game.backgroundColor = ex.Color.fromRGB(0,0,0,0)
    
    game.editor = initEditor(game);
 
    interopSetup(game);
    interopSend.askForWorldLocal();
}


