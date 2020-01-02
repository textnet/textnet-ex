import * as ex from "excalibur";

import { Dir } from "../../universe/interfaces"

import { GameScene } from "../scene"
import { Game } from "../game"
import { ArtifactSprite } from "../sprite"
import { ArtifactStructure } from "../data_structures"


export class BaseActor extends ex.Actor {
    artifact: ArtifactStructure;
    sprite: ArtifactSprite;
    dir: Dir;
    speed: { x:number, y: number };

    /**
     * Build an actor from the artifact.
     */
    constructor(artifactData: ArtifactStructure) {
        let sprite:ArtifactSprite = new ArtifactSprite(artifactData);
        super({
            pos: new ex.Vector(0,0),
            scale: new ex.Vector(0.75, 0.75),
            body: new ex.Body({
                collider: new ex.Collider({
                    type:   ex.CollisionType.Passive, 
                    shape:  ex.Shape.Box(artifactData.body.size[0], artifactData.body.size[1]),
                    offset: new ex.Vector(artifactData.body.offset[0], artifactData.body.offset[1])
                })
            })
        });
        console.log(`Adding artifact ${artifactData.name} to scene`, artifactData);
        this.artifact = artifactData;
        this.sprite = sprite;
    }

    /**
     * Called before the first actor update.
     * Makes all animations ready.
     */
    onInitialize(engine: Game) {
        if (!this.sprite.animations)
            this.sprite.makeAnimations(engine)
        for (let a in this.sprite.animations) {
            this.addDrawing(a, this.sprite.animations[a]);
        }
    }

}
