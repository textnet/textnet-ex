import * as ex from "excalibur";
import { PlaneScene, setupScene, purgeScene } from "./plane";
import { worldWidth } from "./universe/const";
import { visualBounds } from "./plane";
import { Account, World } from "./universe/interfaces";
import { createAccount } from "./universe/setup";
import { initSync } from "./networking";
import { getAccountWorld } from "./universe/getters"
import { initEditor } from "./editor"

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

const game = new Game();
const loader = new ex.Loader();
loader.suppressPlayButton = true;
game.backgroundColor = ex.Color.fromRGB(0,0,0,0)

const account = createAccount("Ni", "human_professor");
const scene = new PlaneScene(game);
setupScene(scene, getAccountWorld(account), game)
initSync(game);
game.addScene("world", scene);
game.goToScene("world");


game.start(loader).then(() => {
    console.log("----------------------- :) --------------------");
});
