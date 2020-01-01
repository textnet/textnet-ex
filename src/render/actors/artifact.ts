import * as ex from "excalibur";

import { COMMAND, DIR, DIRfrom, worldWidth, visualBounds } from "../../universe/const"
import { Dir, Position } from "../../universe/interfaces"
import { deepCopy, addDir } from "../../universe/utils"


import { GameScene } from "../scene"
import { Game } from "../game"
import { ArtifactSprite } from "../sprite"
import { ArtifactStructure } from "../data_structures"
import { BaseActor } from "./base"
import { InventoryActor } from "./inventory"
import { getPlayerDirection, getPlayerCommand } from "../command"

import * as interopSend from "../interop/send"


export class ArtifactActor extends BaseActor {
    speed: { x:number, y: number };
    needRelease: boolean;
    inventory?: InventoryActor;

    constructor(artifact: ArtifactStructure) {
        let pos:Position = artifact.position;
        let sprite:ArtifactSprite = new ArtifactSprite(artifact);
        super(artifact);
        this.scale = new ex.Vector(1,1);
        this.opacity = 1;
        this.rotation = 0;
        this.body.pos = new ex.Vector(pos.x, pos.y);
        if (artifact.isPlayer) {
            this.body.collider.type = ex.CollisionType.Active;
        } else {
            this.body.collider.type = ex.CollisionType.Fixed;
        }
        this.needRelease = true;
        this.sprite = sprite;
        if (artifact.sprite.moving || artifact.sprite.turning) {
            this.dir = pos.dir;
        }
    }

    onInitialize(engine: Game) {
        super.onInitialize(engine);
    }


    updateFromCommands(engine: Game) {
        this.speed = { x:0, y:0 };
        let dir: Dir = deepCopy(DIR.NONE);
        // Player input for direction and speed

        if (this.artifact.isLocal) {
            if (this.needRelease && engine.input.keyboard.getKeys().length == 0) {
                this.needRelease = false;
            }
            if (!this.needRelease) {
                let playerDir = getPlayerDirection(engine);
                let command   = getPlayerCommand(engine);
                // just MOVE
                if (command == COMMAND.NONE && playerDir.name != DIR.NONE.name) {
                    dir = addDir(dir, playerDir);
                }
            }
        }

        // adjust orientation if it is changing
        if (dir.name != DIR.NONE.name) {
            this.dir = dir;
        } 
        // Adjust velocity
        this.vel.x = dir.x * this.artifact.speed;
        this.vel.y = dir.y * this.artifact.speed;
      
    }

    checkBounds() {
        if (this.pos.y < 0) {
            this.pos.y = 0;
            this.vel.y = 0;
        }
        if (this.pos.x < visualBounds.left) {
            this.pos.x = visualBounds.left;
            this.vel.x = 0;
        }
        if (this.pos.x > visualBounds.left+worldWidth) { 
            this.pos.x = visualBounds.left+worldWidth;
            this.vel.x = 0;
        }         
    }

    /**
     * Happens after main update once per frame.
     */
    onPostUpdate(engine: Game, delta: number) {
        // update from properties
        if (this.artifact.isPlayer) {
            this.body.collider.type = ex.CollisionType.Active;
        } else
        if (this.artifact.passable) {
            this.body.collider.type = ex.CollisionType.PreventCollision;
        } else {
            this.body.collider.type = ex.CollisionType.Fixed;
        }
        // update position and issue commands
        if (this.artifact.isLocal) {
            this.updateFromCommands(engine)
            interopSend.updateArtifactPosition(this);
        } 
        // Update animations
        if (this.artifact.sprite.turning) {
            if (Math.abs(this.vel.x)+Math.abs(this.vel.y) > 0) {
                this.setDrawing("move:"+this.dir.name)
            } else {
                this.setDrawing("idle:"+this.dir.name)
            }
        }
        // normalize and update 2.5D visualisation
        this.checkBounds()
        this.setZIndex(10000+this.pos.y)
    }

}
