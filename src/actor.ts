import * as ex from "excalibur";
import { DIR, worldWidth, universeUpdateFrequency } from "./universe/const";
import { Dir, Position, Artifact, Avatar, AvatarKind } from "./universe/interfaces"
import { SpriteType, getSprite, Sprite, spriteSpeed } from "./resources";
import { updateArtifactPosition } from "./universe/manipulations"
import { visualBounds } from "./plane"
import { Game } from "./index"
import { editUnder } from "./editor"

export class ArtifactActor extends ex.Actor {
    spriteName: string;
    sprite: Sprite;
    dir: Dir;
    speed: number;
    artifact: Artifact;
    isUnder: boolean;

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
        this.isUnder = false;
        this.artifact = artifact;
        this.spriteName = spriteName;
        this.sprite = sprite;
        if (this.sprite.type == SpriteType.STATIC)
            this.dir = DIR.UP;
        else
            this.dir = pos.dir;
    }

    // OnInitialize is called before the 1st actor update
    onInitialize(engine: Game) {
        this.artifact.dispatcher = engine.syncDispatcher;
        if (!this.sprite.animations)
            this.sprite.makeAnimations(engine)
        for (let a in this.sprite.animations) {
            this.addDrawing(a, this.sprite.animations[a]);
        }
        let that = this;
        setInterval(function(){
            that.updateUniverse(engine);
        }, universeUpdateFrequency);
    }

    to: any;
    updateFromAvatar(engine: Game) {
        if (this.isUnder) {
            this.vel.x = 0;
            this.vel.y = 0;
            return; // if it is under, no control.
        }

        let speedMod = 100; // TBD get speed from avatar/artifact
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
            // 
            if (engine.input.keyboard.wasReleased(13)) {
                editUnder(this, engine)
            }
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
    }

    // After main update, once per frame execute this code
    onPostUpdate(engine: Game, delta: number) {
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
    }

    updateUniverse(engine: Game) {
        let newPosition: Position = {
            x: this.pos.x,
            y: this.pos.y,
            dir: this.dir
        }
        updateArtifactPosition(this.artifact, newPosition)        
    }


}