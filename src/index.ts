import * as ex from 'excalibur';
import { tempSetup } from './world/world';

class Game extends ex.Engine {
  constructor() {
    super({ width: 800, height: 600, displayMode: ex.DisplayMode.FullScreen });
  	tempSetup()
  	console.log('----------------------- success :) --------------------')
  }

  public start(loader: ex.Loader) {
    return super.start(loader);
  }
}

const game = new Game();
let loader = new ex.Loader();
game.start(loader).then(() => {
});
