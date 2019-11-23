import * as ex from "excalibur";
import { Dir, Direction, Position, planeWidth } from "./world";
import { SpriteType, getSprite, Sprite, spriteSpeed } from "./resources";
import { visualBounds } from "./plane"

export class ArtifactActor extends ex.Actor {
    spriteName: string;
    sprite: Sprite;
    dir: Dir;
    speed: number;
    avatar: boolean; // TBD

    constructor(pos: Position, spriteName:string) {
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
        this.spriteName = spriteName;
        this.sprite = sprite;
        if (this.sprite.type == SpriteType.STATIC)
            this.dir = Direction.UP;
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

        // Player input for direction and speed
        this.speed = 0;
        if (engine.input.keyboard.isHeld(ex.Input.Keys.Left)) {
            this.dir=Direction.LEFT; this.speed=1; }
        if (engine.input.keyboard.isHeld(ex.Input.Keys.Right)) {
            this.dir=Direction.RIGHT; this.speed=1; }
        if (engine.input.keyboard.isHeld(ex.Input.Keys.Up)) {
            this.dir=Direction.UP; this.speed=1; }
        if (engine.input.keyboard.isHeld(ex.Input.Keys.Down)) {
            this.dir=Direction.DOWN; this.speed=1; }
        // 
        let speedMod = 100; 
        if (engine.input.keyboard.isHeld(ex.Input.Keys.Shift))
            speedMod = 500;

        // Adjust velocity
        this.vel.x = this.dir.x * this.speed * speedMod;
        this.vel.y = this.dir.y * this.speed * speedMod;
        if (this.vel.x+this.vel.y == 0 && this.oldVel.x + this.oldVel.y != 0) {
            console.log(this.pos)
        }
        // Stay in bounds 
        if (this.pos.x < visualBounds.left) {
            this.pos.x = visualBounds.left;
            this.vel.x = 0;
        }
        if (this.pos.x > visualBounds.right+planeWidth) {
            this.pos.x = visualBounds.right+planeWidth;
            this.vel.x = 0;
        }
    }

    // After main update, once per frame execute this code
    onPostUpdate(engine: ex.Engine, delta: number) {
        // 
        if (this.avatar) {
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
    }

}