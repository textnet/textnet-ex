import * as ex from "excalibur";
import { DIR, DIRfrom, COMMAND, 
         worldWidth, universeUpdateFrequency } from "./universe/const";
import { Dir, Position, Artifact, Avatar, AvatarKind } from "./universe/interfaces"
import { updateArtifactPosition } from "./universe/manipulations"
import { 
    visualBounds,
    updateArtifactOnScene
    } from "./plane"
import { Game } from "./index"
import { ArtifactSprite } from "./sprite"
import { getArtifact_NextTo } from "./universe/getters"
import { 
    enterArtifact, leaveWorld, 
    isArtifactPlaceable, placeArtifact,
    pickupArtifact, putdownArtifact,
    } from "./universe/manipulations"
import { PlaneScene } from "./plane"
import { getPlayerDirection, getPlayerCommand } from "./command"
import { deepCopy, addDir } from "./universe/utils"
import { cpCoords } from "./universe/utils"
import { InventoryActor } from "./inventoryActor"

export class ArtifactActor extends InventoryActor {
    speed: { x:number, y: number };
    needRelease: boolean;
    inventory?: InventoryActor;

    constructor(artifact: Artifact) {
        let pos:Position = artifact.coords.position;
        let sprite:ArtifactSprite = new ArtifactSprite(artifact);
        super(artifact);
        this.scale = new ex.Vector(1,1);
        this.opacity = 1;
        this.rotation = 0;
        this.body.pos = new ex.Vector(pos.x, pos.y);
        if (artifact.avatar && artifact.avatar.kind == AvatarKind.PLAYER) {
            this.body.collider.type = ex.CollisionType.Active;
        } else {
            this.body.collider.type = ex.CollisionType.Fixed;
        }
        this.needRelease = true;
        this.artifact.actor = this;
        this.sprite = sprite;
        if (artifact.sprite.moving || artifact.sprite.turning)
        {
            this.dir = pos.dir;
        }
    }

    // onInitialize is called before the 1st actor update
    onInitialize(engine: Game) {
        this.artifact.dispatcher = engine.syncDispatcher;
        super.onInitialize(engine);
        this.visualiseInventory(engine);
    }

    visualiseInventory(engine: Game) {
        if (this.inventory) {
            this.remove(this.inventory);
            delete this.inventory;
        }
        if (this.artifact.avatar && this.artifact.avatar.inventory.length > 0) {
            // create a new artifact
            this.inventory = new InventoryActor(this.artifact.avatar.inventory[0]);
            this.inventory.pos = new ex.Vector(
                this.artifact.body.size[0]/2+ 
                this.inventory.artifact.body.size[0]/2*this.inventory.scale.x,
                -this.inventory.artifact.body.size[1]/2*this.inventory.scale.y
                )
            this.add(this.inventory);
        }
    }

    updateFromAvatar(engine: Game) {
        this.speed = { x:0, y:0 };
        let speedMod = 100; // TBD get speed from avatar/artifact
        let pushStrength = 3; // TBD get strength from avatar/artifact
        let dir: Dir = deepCopy(DIR.NONE);
        // Player input for direction and speed
        if (this.artifact.avatar.kind == AvatarKind.PLAYER) {
            if (this.needRelease && engine.input.keyboard.getKeys().length == 0) {
                this.needRelease = false;
            }
            if (!this.needRelease) {
                let playerDir = getPlayerDirection(engine);
                let command = getPlayerCommand(engine);
                if (command == COMMAND.PUSH && playerDir.name != DIR.NONE.name) {
                    let item: Artifact = getArtifact_NextTo(this.artifact, playerDir);
                    if (item) {
                        let straightDir: Dir = DIRfrom(playerDir);
                        let newCoords = cpCoords(item.coords);
                        newCoords.position.x += straightDir.x*pushStrength;
                        newCoords.position.y += straightDir.y*pushStrength;
                        if (isArtifactPlaceable(item, newCoords)) {
                            placeArtifact(item, newCoords);
                            updateArtifactOnScene(this.scene as PlaneScene, item);
                            dir = addDir(dir, playerDir);
                        } 
                    } else {
                        command = COMMAND.NONE;
                    }
                }
                if (command == COMMAND.PICKUP) {
                    let straightDir: Dir = DIRfrom(addDir(dir, playerDir));
                    let item:Artifact = getArtifact_NextTo(this.artifact, straightDir);
                    if (item) {
                        pickupArtifact(this.artifact.avatar, item);
                        if (item.actor) {
                            this.scene.remove(item.actor)
                        }
                        this.needRelease = true;
                        this.visualiseInventory(engine)
                    } else {
                        let straightDir: Dir = DIRfrom(playerDir);
                        let item: Artifact = putdownArtifact(this.artifact.avatar, playerDir);
                        if (item) {
                            if (item.actor) {
                                this.scene.add(item.actor)
                            }
                            updateArtifactOnScene(this.scene as PlaneScene, item);
                            this.needRelease = true;
                            this.visualiseInventory(engine)
                        }
                    }
                }
                if (command == COMMAND.NONE && playerDir.name != DIR.NONE.name) {
                    dir = addDir(dir, playerDir);
                }
                if (command == COMMAND.LEAVE) {
                    leaveWorld(this.artifact.avatar);
                    engine.switchScene(this.artifact.coords.world)                   
                }
                if (command == COMMAND.ENTER) {
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
        if (!this.artifact.coords) return;
        let newPosition: Position = {
            x: this.pos.x,
            y: this.pos.y,
            dir: this.dir
        }
        updateArtifactPosition(this.artifact, newPosition)
    }


}