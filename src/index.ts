import * as ex from 'excalibur';
import { PlaneScene } from './plane';
import { loader } from './resources';
import { worldWidth } from './world/const';
import { visualBounds } from "./plane";
import { Account } from './world/interfaces'
import { createAccount } from './world/setup'

class Game extends ex.Engine {
  constructor() {
    super({ width: worldWidth+visualBounds.left+visualBounds.right, 
            height: 300 });
  }
}

const game = new Game();
const account = createAccount("Ni", "human_professor");
const scene = new PlaneScene(game, account)

game.add('plane', scene);
game.goToScene('plane');

// Game events to handle
game.on('hidden', () => {
    console.log('pause');
    game.stop();
});
game.on('visible', () => {
    console.log('start');
    game.start();
});


game.start(loader).then(() => {
    console.log('----------------------- :) --------------------')
});
