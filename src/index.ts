import * as ex from 'excalibur';
import { PlaneScene } from './plane';
import { loader } from './resources';
import { planeWidth } from './world';
import { visualBounds } from "./plane";

class Game extends ex.Engine {
  constructor() {
    super({ width: planeWidth+visualBounds.left+visualBounds.right, 
            height: 500 });
  }
}

const game = new Game();
const scene = new PlaneScene(game)
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
