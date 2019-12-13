import * as ex from "excalibur";
import { DIR, COMMAND, 
         worldWidth, universeUpdateFrequency } from "./universe/const";
import { Dir, Position, Artifact, Avatar, AvatarKind } from "./universe/interfaces"
import { updateArtifactPosition } from "./universe/manipulations"
import { visualBounds } from "./plane"
import { Game } from "./index"
import { ArtifactSprite } from "./sprite"
import { getArtifact_NextTo } from "./universe/getters"
import { enterArtifact, leaveWorld } from "./universe/manipulations"
import { PlaneScene } from "./plane"
import { getPlayerDirection, getPlayerCommand } from "./command"
import { deepCopy, addDir } from "./universe/utils"

export class ArtifactActor extends ex.Actor {
    sprite: ArtifactSprite;
    dir: Dir;
    speed: { x:number, y: number };
    artifact: Artifact;
    needRelease: boolean;
    interval: object;

    constructor(artifact: Artifact) {
        let pos:Position = artifact.coords.position;
        let sprite:ArtifactSprite = new ArtifactSprite(artifact);
        super({
            pos: new ex.Vector(pos.x, pos.y),
            body: new ex.Body({
                collider: new ex.Collider({
                    type:   ex.CollisionType.Active, 
                    shape:  ex.Shape.Box(artifact.body.size[0], artifact.body.size[1]),
                    offset: new ex.Vector(artifact.body.offset[0], artifact.body.offset[1])
                })
            })
        });
        this.needRelease = true;
        this.artifact = artifact;
        this.sprite = sprite;
        if (artifact.sprite.moving || artifact.sprite.turning)
        {
            this.dir = pos.dir;
        } else {
            this.dir = DIR.UP;
        }
    }

    // onInitialize is called before the 1st actor update
    onInitialize(engine: Game) {
        this.artifact.dispatcher = engine.syncDispatcher;
        if (!this.sprite.animations)
            this.sprite.makeAnimations(engine)
        for (let a in this.sprite.animations) {
            this.addDrawing(a, this.sprite.animations[a]);
        }
    }

    updateFromAvatar(engine: Game) {
        this.speed = { x:0, y:0 };
        let speedMod = 100; // TBD get speed from avatar/artifact
        let dir: Dir = deepCopy(DIR.NONE);
        // Player input for direction and speed
        if (this.artifact.avatar.kind == AvatarKind.PLAYER) {
            if (this.needRelease && engine.input.keyboard.getKeys().length == 0) {
                this.needRelease = false;
            }
            if (!this.needRelease) {
                let playerDir = getPlayerDirection(engine);
                let command = getPlayerCommand(engine);
                if (command == COMMAND.NONE && playerDir.name != DIR.NONE.name) {
                    dir = addDir(dir, playerDir);
                }
                if (command == COMMAND.LEAVE) {
                    leaveWorld(this.artifact.avatar);
                    engine.switchScene(this.artifact.coords.world)                   
                }
                if (command == COMMAND.ENTER) {
                    console.log("ENTER!", playerDir)
                    let item = getArtifact_NextTo(this.artifact, playerDir);
                    if (item) {
                        enterArtifact(this.artifact.avatar, item)
                        engine.switchScene(this.artifact.coords.world)                       
                    }
                }
            }
        }

        // adjust orientation if it is changing
        if (dir.name != DIR.NONE.name) {
            this.dir = dir;
        } 
        // Adjust velocity
        this.vel.x = dir.x * speedMod;
        this.vel.y = dir.y * speedMod;

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
        // update from avatar
        if (this.artifact.avatar) {
            this.updateFromAvatar(engine)
        }
        // Update animations
        if (this.artifact.sprite.turning) {
            if (Math.abs(this.vel.x)+Math.abs(this.vel.y) > 0) {
                this.setDrawing("move:"+this.dir.name)
            } else {
                this.setDrawing("idle:"+this.dir.name)
            }
        }
        // update 2.5D visualisation
        this.setZIndex(10000+this.pos.y)
        // update universe
        if ((this.scene as PlaneScene).timeToUpdateUniverse()) {
            this.updatePositionInUniverse(engine)
        }
    }

    updatePositionInUniverse(engine: Game) {
        let newPosition: Position = {
            x: this.pos.x,
            y: this.pos.y,
            dir: this.dir
        }
        updateArtifactPosition(this.artifact, newPosition)
    }


}