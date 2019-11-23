import * as ex from "excalibur";
import { ArtifactActor } from "./actor";
import { Direction, Position, spawnPosition } from "./world"

export const visualBounds = {
    left:   40,
    right:  40,
    top:    40,
    height: 300,
}


export class PlaneScene extends ex.Scene {
    constructor(engine: ex.Engine) {
        super(engine);
    }

    public onInitialize(engine: ex.Engine) {
        // compose actors for the scene

        let player = new ArtifactActor(
            spawnPosition,
            "human_professor"
        );
        player.avatar = true;

        let random = new ArtifactActor(
            {x: 100, y:100, dir:Direction.DOWN},
            "chair"
        ); 

        engine.add(player);
        engine.add(random);

        // create camera strategy
        this.camera.clearAllStrategies();
//        this.camera.strategy.lockToActorAxis(player, ex.Axis.Y);
        this.camera.addStrategy(new RadiusAroundActorStrategy(player, visualBounds.height/2))
    }
    public onActivate() {}
    public onDeactivate() {}
}

export class RadiusAroundActorStrategy implements ex.CameraStrategy<ex.Actor> {
  constructor(public target: ex.Actor, public radius: number) {}
  public action = (target: ex.Actor, cam: ex.Camera, _eng: ex.Engine, _delta: number) => {
    const position = target.center;
    const focus = cam.getFocus();
    const diff = position.y - focus.y;
    if (diff > this.radius) {
      return focus.add(new ex.Vector(0, diff-this.radius))
    }
    if (diff < -this.radius) {
      return focus.add(new ex.Vector(0, diff+this.radius))
    }
    return focus;
  };
}
/*


3. Упираться в края экрана

*/
