import * as ex from "excalibur";
import { PlaneScene } from "./plane";
import { worldWidth } from "./universe/const";
import { visualBounds } from "./plane";
import { Account, World } from "./universe/interfaces";
import { createAccount } from "./universe/setup";
import { initSync } from "./networking";
import { initEditor } from "./editor"
import { getAccountWorld } from "./universe/getters"

export class Game extends ex.Engine {
    syncDispatcher: ex.EventDispatcher;
    constructor() {
        super({
            width: worldWidth + visualBounds.left + visualBounds.right,
            height: visualBounds.height + 2*visualBounds.margin,
        });
    }

    switchScene(world: World) {
        this.removeScene("world");
        const scene = new PlaneScene(this, world);
        this.addScene("world", scene);
        this.goToScene("world");
    }



}

const game = new Game();
const loader = new ex.Loader();
loader.suppressPlayButton = true;
game.backgroundColor = ex.Color.fromRGB(0,0,0,0)

const account = createAccount("Ni", "human_professor");
game.switchScene(getAccountWorld(account))

game.start(loader).then(() => {
    initSync(game);
    console.log("----------------------- :) --------------------");
});
