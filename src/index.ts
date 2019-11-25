import * as ex from "excalibur";
import { PlaneScene } from "./plane";
import { loader } from "./resources";
import { worldWidth } from "./universe/const";
import { visualBounds } from "./plane";
import { Account } from "./universe/interfaces";
import { createAccount } from "./universe/setup";
import { initSync } from "./networking";
import { initEditor } from "./editor"

export class Game extends ex.Engine {
    syncDispatcher: ex.EventDispatcher;
    $editor:object;
    constructor() {
        super({
            width: worldWidth + visualBounds.left + visualBounds.right,
            height: visualBounds.height + 2*visualBounds.margin,
        });
    }
}

const game = new Game();
game.backgroundColor = ex.Color.fromRGB(0,0,0,0)

const account = createAccount("Ni", "human_professor");
const scene = new PlaneScene(game, account);

game.add("plane", scene);
game.goToScene("plane");

// Game events to handle
game.on("hidden", () => {
    console.log("pause");
    game.stop();
});
game.on("visible", () => {
    console.log("start");
    game.start();
});

game.start(loader).then(() => {
    game.$editor = initEditor()
    initSync(game);
    var input = document.createElement('TEXTAREA');
    document.body.appendChild(input)
    console.log("----------------------- :) --------------------");
});
