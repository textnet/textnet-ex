import * as ex from "excalibur";
import { DIR } from "./universe/const";
import { Dir, Artifact } from "./universe/interfaces"
import { Game } from "./index"
import { ArtifactSprite } from "./sprite"

export class InventoryActor extends ex.Actor {
    sprite: ArtifactSprite;
    dir: Dir;
    speed: { x:number, y: number };
    artifact: Artifact;

    constructor(artifact: Artifact) {
        let sprite:ArtifactSprite = new ArtifactSprite(artifact);
        super({
            pos: new ex.Vector(0,0),
            scale: new ex.Vector(0.75, 0.75),
            body: new ex.Body({
                collider: new ex.Collider({
                    type:   ex.CollisionType.Passive, 
                    shape:  ex.Shape.Box(artifact.body.size[0], artifact.body.size[1]),
                    offset: new ex.Vector(artifact.body.offset[0], artifact.body.offset[1])
                })
            })
        });
        this.opacity = 0.90;
        this.rotation = -Math.PI/16;
        this.artifact = artifact;
        this.sprite = sprite;
        this.dir = DIR.UP;
    }

    // onInitialize is called before the 1st actor update
    onInitialize(engine: Game) {
        if (!this.sprite.animations)
            this.sprite.makeAnimations(engine)
        for (let a in this.sprite.animations) {
            this.addDrawing(a, this.sprite.animations[a]);
        }
    }


}