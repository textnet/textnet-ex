import * as ex from "excalibur";
import { ipcRenderer } from "electron";

import { visualBounds, worldWidth } from "../universe/const";
import { Account, World } from "../universe/interfaces";
import { getAccountWorld } from "../universe/getters"

import { PlaneScene, setupScene, purgeScene } from "./plane";
import { initEditor } from "./editor"

import { interopSetup } from "./interop";


/**
 * Main module. 
 * Also contains overrides for the Excalibur engine.
 * Currently creates everything anew on each restart.
 * To be rewritten as we reach 'persistence' stage.
 */

export class Game extends ex.Engine {
    syncDispatcher: ex.EventDispatcher;
    constructor() {
        super({
            width: worldWidth + visualBounds.left + visualBounds.right,
            height: visualBounds.height + 2*visualBounds.margin,
        });
    }

    switchScene(world: World) {
        purgeScene(this.currentScene as PlaneScene, this);
        setupScene(this.currentScene as PlaneScene, world, this);
    }

}

export function runGame() {
    const game = new Game();
    const loader = new ex.Loader();
    loader.suppressPlayButton = true;
    game.backgroundColor = ex.Color.fromRGB(0,0,0,0)
    
    const scene = new PlaneScene(game);
    game.addScene("world", scene);
    game.goToScene("world");

    interopSetup(game);
    ipcRenderer.send("askToStart")
}


