import * as ex from "excalibur";
import { DIR, worldWidth } from "./world/const";
import { Dir, Position, Artifact, Avatar, AvatarKind } from "./world/interfaces"
import { SpriteType, getSprite, Sprite, spriteSpeed } from "./resources";
import { visualBounds } from "./plane"

export class ArtifactActor extends ex.Actor {
    spriteName: string;
    sprite: Sprite;
    dir: Dir;
    speed: number;
    artifact: Artifact;

    constructor(artifact: Artifact) {
        let pos:Position = artifact.coords.position;
        let spriteName:string = artifact.spriteName;
        let sprite:Sprite = getSprite(spriteName);
        super({
            pos: new ex.Vector(pos.x+visualBounds.left, pos.y+visualBounds.top),
            body: new ex.Body({
                collider: new ex.Collider({
                    type:   ex.CollisionType.Active,
                    shape:  ex.Shape.Box(sprite.body.size[0], sprite.body.size[1]),
                    offset: new ex.Vector(-sprite.body.offset[0], -sprite.body.offset[1])
                })
            })
        });
        this.artifact = artifact;
        this.spriteName = spriteName;
        this.sprite = sprite;
        if (this.sprite.type == SpriteType.STATIC)
            this.dir = DIR.UP;
        else
            this.dir = pos.dir;
    }

    // OnInitialize is called before the 1st actor update
    onInitialize(engine: ex.Engine) {
        if (!this.sprite.animations)
            this.sprite.makeAnimations(engine)
        for (let a in this.sprite.animations) {
            this.addDrawing(a, this.sprite.animations[a]);
        }
    }

    to: any;
    updateFromAvatar(engine: ex.Engine) {
        // debug
        var that = this;
        if (engine.input.keyboard.isHeld(ex.Input.Keys.Space)) {
            clearTimeout(this.to)
            this.to = setTimeout(function(){ console.log(that) },100)
        }

        let speedMod = 50; // TBD get speed from avatar/artifact
        // Player input for direction and speed
        if (this.artifact.avatar.kind == AvatarKind.PLAYER) {
            this.speed = 0;
            if (engine.input.keyboard.isHeld(ex.Input.Keys.Left)) {
                this.dir=DIR.LEFT; this.speed=1; }
            if (engine.input.keyboard.isHeld(ex.Input.Keys.Right)) {
                this.dir=DIR.RIGHT; this.speed=1; }
            if (engine.input.keyboard.isHeld(ex.Input.Keys.Up)) {
                this.dir=DIR.UP; this.speed=1; }
            if (engine.input.keyboard.isHeld(ex.Input.Keys.Down)) {
                this.dir=DIR.DOWN; this.speed=1; }
            // 
            if (engine.input.keyboard.isHeld(ex.Input.Keys.Shift))
                speedMod = 500;            
        }

        // Adjust velocity
        this.vel.x = this.dir.x * this.speed * speedMod;
        this.vel.y = this.dir.y * this.speed * speedMod;

        // Stay in bounds 
        if (this.pos.x < visualBounds.left) {
            this.pos.x = visualBounds.left;
            this.vel.x = 0;
        }
        if (this.pos.x > visualBounds.right+worldWidth) {
            this.pos.x = visualBounds.right+worldWidth;
            this.vel.x = 0;
        }

        // temp: Report position as we stop.
        if (this.vel.x+this.vel.y == 0 && this.oldVel.x + this.oldVel.y != 0) {
            console.log(this.pos)
        }
    }

    // After main update, once per frame execute this code
    onPostUpdate(engine: ex.Engine, delta: number) {
        // 
        if (this.artifact.avatar) {
            this.updateFromAvatar(engine)
        }
        // Update animations
        if (this.sprite.type != SpriteType.STATIC) {
            if (this.speed > 0) {
                this.setDrawing("move:"+this.dir.name)
            } else {
                this.setDrawing("idle:"+this.dir.name)
            }
        }
        this.setZIndex(10000+this.pos.y)
        // 
    }

}