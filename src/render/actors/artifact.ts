/**
 * Artifact Actor Module.
 * ----------------------
 * Every artifact in the world is rendered as an {ArtifactActor}.
 */
import * as ex from "excalibur";

import { COMMAND, DIR, DIRfrom, worldWidth, visualBounds } from "../../const"
import { Dir, Position                                   } from "../../interfaces"
import { deepCopy, addDir                                } from "../../utils"

import { BaseActor                            } from "./base"
import { InventoryActor                       } from "./inventory"
import { GameScene                            } from "../scene"
import { Game                                 } from "../game"
import { ArtifactSprite                       } from "../sprite"
import { ArtifactStructure                    } from "../data_structures"
import { getPlayerDirection, getPlayerCommand } from "../command"
import { focusEditor                          } from "../editor"

import * as interopSend from "../interop/send"

/**
 * Excalibur Actor extension for Artifact-based actors.
 */
export class ArtifactActor extends BaseActor {
    speed: { x:number, y: number };
    needRelease: boolean; // need to release a key before next key command is triggered.
    isKneeled: boolean;   // is a player typing in?
    isMoving: boolean;
    inventory?: InventoryActor; // an actor to render current inventory of this artifact.

    constructor(artifact: ArtifactStructure) {
        super(artifact);
        let pos:Position = artifact.position;
        let sprite:ArtifactSprite = new ArtifactSprite(artifact);
        this.isKneeled = false;
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

    /**
     * Update player's actor based on commands received (e.g. move, push, etc.)
     * @param {Game} engine
     */
    updateFromCommands(engine: Game) {
        this.speed = { x:0, y:0 };
        let dir: Dir = deepCopy(DIR.NONE);
        // Player input for direction and speed
        if (this.artifact.isPlayer && !this.isKneeled) {
            if (this.needRelease && engine.input.keyboard.getKeys().length == 0) {
                this.needRelease = false;
            }
            if (!this.needRelease) {
                let playerDir = getPlayerDirection(engine);
                let command   = getPlayerCommand(engine);
                // MOVE, PUSH
                if (command == COMMAND.PUSH && playerDir.name != DIR.NONE.name) {
                    interopSend.push(this, playerDir);
                    dir = addDir(dir, playerDir);
                }                
                if (command == COMMAND.PICKUP) {
                    this.needRelease = true;
                    interopSend.pickup(this, playerDir);
                }
                if (command == COMMAND.NONE && playerDir.name != DIR.NONE.name) {
                    // this.needRelease = true;
                    dir = addDir(dir, playerDir);
                }
                if (command == COMMAND.LEAVE) {
                    this.needRelease = true;
                    interopSend.leave(this);
                }
                if (command == COMMAND.ENTER && playerDir.name != DIR.NONE.name) {
                    this.needRelease = true;
                    interopSend.goto(this, playerDir);
                }
                if (command == COMMAND.KNEEL) {
                    this.needRelease = true;
                    this.isKneeled = true;
                    focusEditor(this);
                }
            }
            // Adjust orientation if it is changing
            if (dir.name != DIR.NONE.name) {
                this.dir = dir;
            } 
            // Adjust velocity
            this.vel.x = dir.x * this.artifact.speed;
            this.vel.y = dir.y * this.artifact.speed;
            //
            const prevMoving = this.isMoving;
            this.isMoving = Math.abs(this.vel.x)+Math.abs(this.vel.y) > 0;
            if (this.isMoving && !prevMoving) {
                interopSend.startMoving(this);
            }
            if (!this.isMoving && prevMoving) {
                interopSend.stopMoving(this);                
            }
            console.log("<keyboard>")
        }
    }


    _movingTimeout;
    _movingTimeoutDuration = 500;
    startMoving() {
        this.isMoving = true;
        this.continueMoving();
    }
    continueMoving() {
        const that = this;
        clearTimeout(this._movingTimeout);
        this._movingTimeout = setTimeout(function(){ that.stopMoving() }, 
                                         this._movingTimeoutDuration);        
    }
    stopMoving() {
        this.isMoving = false;
        clearTimeout(this._movingTimeout);
    }

    /**
     * While moving an actor, make sure it stays within the stage.
     * Same checks are done on the Persistence layer, so this is
     * more for visual smoothness.
     */
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
        if (this.artifact.sprite.moving) {
            if (this.isMoving) {
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
