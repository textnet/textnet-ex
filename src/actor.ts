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
    pushArtifact,
    } from "./universe/manipulations"
import { PlaneScene } from "./plane"
import { getPlayerDirection, getPlayerCommand } from "./command"
import { deepCopy, addDir } from "./universe/utils"
import { cpCoords } from "./universe/utils"
import { InventoryActor } from "./inventoryActor"
import { Editor, focusEditor } from "./editor"

/**
 * When player moves through the world, we draw it on the Scene.
 * Every Artifact in this world is represented by an ArtifactActor.
 *
 * The universe (model) is considered Source of Truth.
 *
 * As some of the artifacts (including player's one) have Avatars,
 * they can change position and take actions. It alters source of truth.
 *
 * If Actors are moved by the game engine (e.g. player move her Actor),
 * these changes are converted into events and emitted to adjust 
 * the source of truth.
 */


/**
 * Actor entity from the Excalibur that visualises artifacts on the Scene.
 * It extends InventoryActor, but introduces more functionality.
 * E.g. ArtifactActors act as spatial colliders.
 */
export class ArtifactActor extends InventoryActor {
    speed: { x:number, y: number };
    needRelease: boolean;
    inventory?: InventoryActor;

    /**
     * Builds an Actor out of Artifact structure.
     */
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

    /**
     * Called before the first actor update.
     * Initialises event dispatchers.
     */
    onInitialize(engine: Game) {
        super.onInitialize(engine);
        this.visualiseInventory(engine);
    }

    /**
     * Visualises the inventory: artifacts that this artifact has picked up.
     * Does nothing if there is no avatar connected with the artifact.
     * Called internally; don't call it explicitly.
     */
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

    /**
     * Update an actor from the actions that its avatar is doing.
     * For local player avatars: takes input command and attempts to execute it.
     * Adjusts its own position if moved.
     */
    updateFromAvatar(engine: Game) {
        this.speed = { x:0, y:0 };
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
                    if (item && item.pushable) {
                        if (pushArtifact(item, this.artifact, playerDir)) {
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
                    if (item && item.pickable) {
                        pickupArtifact(this.artifact.avatar, item);
                        if (item.actor) {
                            this.scene.remove(item.actor)
                        }
                        this.needRelease = true;
                        this.visualiseInventory(engine)
                    } else if (this.artifact.avatar.inventory.length > 0) {
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
                    if (item && !item.locked) {
                        enterArtifact(this.artifact.avatar, item)
                        engine.switchScene(this.artifact.coords.world)                       
                    }
                }
                if (command == COMMAND.KNEEL) {
                    engine.stop();
                    focusEditor(this);
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

        // Stay in bounds 
        if (this.pos.y < 0) {
            this.pos.y = 0;
            this.vel.y = 0;
        }
        if (this.pos.x < visualBounds.left) {
            this.pos.x = visualBounds.left;
            this.vel.x = 0;
        }
        if (this.pos.x > visualBounds.right+worldWidth) {
            this.pos.x = visualBounds.right+worldWidth;
            this.vel.x = 0;
        }

    }

    /**
     * Happens after main update once per frame.
     */
    onPostUpdate(engine: Game, delta: number) {
        // update from properties
        if (this.artifact.passable) {
            this.body.collider.type = ex.CollisionType.PreventCollision;
        } else {
            this.body.collider.type = ex.CollisionType.Fixed;
        }
        if (this.artifact.avatar && this.artifact.avatar.kind == AvatarKind.PLAYER) {
            this.body.collider.type = ex.CollisionType.Active;
        }
        // update from avatar
        if (this.artifact.avatar) {
            this.updateFromAvatar(engine)
        } 
        // update from universe
        if (!this.artifact.avatar || this.artifact.avatar.kind != AvatarKind.PLAYER) {
            if (this.artifact.coords) {
                this.body.pos.x = this.artifact.coords.position.x;
                this.body.pos.y = this.artifact.coords.position.y;
                this.dir = this.artifact.coords.position.dir;
            }
        }  else {
            if ((this.scene as PlaneScene).timeToUpdateUniverse()) {
                this.updatePositionInUniverse(engine)
            }
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
    }

    /**
     * Synchronises its position back into Universe directly.
     * Doesn't perform any spatial checks, relies on universe
     * doing so.
     */
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