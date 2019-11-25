import * as ex from "excalibur";
import { ArtifactActor } from "./actor";
import { DIR, spawnPosition } from "./world/const";
import {
    Position,
    Account,
    Avatar,
    World,
    Artifact,
    AvatarKind
} from "./world/interfaces";
import { getWorld } from "./world/getters";

export const visualBounds = {
    left: 40,
    right: 40,
    top: 40,
    height: 300
};

export class PlaneScene extends ex.Scene {
    account: Account;

    constructor(engine: ex.Engine, account: Account) {
        super(engine);
        this.account = account;
    }

    public onInitialize(engine: ex.Engine) {
        // compose actors for the scene
        let world: World = getWorld(this.account);
        let playerActor: ArtifactActor;
        for (let i in world.artifacts) {
            let actor = new ArtifactActor(world.artifacts[i]);
            if (actor.artifact.avatar) {
                if (actor.artifact.avatar.kind == AvatarKind.PLAYER) playerActor = actor;
            }
            engine.add(actor);
        }
        // create camera strategy
        this.camera.clearAllStrategies();
        this.camera.addStrategy(
            new RadiusAroundActorStrategy(playerActor, visualBounds.height / 2)
        );
    }
    public onActivate() {}
    public onDeactivate() {}
}

export class RadiusAroundActorStrategy implements ex.CameraStrategy<ex.Actor> {
    constructor(public target: ex.Actor, public radius: number) {}
    public action(
        target: ex.Actor,
        cam: ex.Camera,
        _eng: ex.Engine,
        _delta: number
    ) {
        const position = target.center;
        const focus = cam.getFocus();
        const diff = position.y - focus.y;
        if (diff > this.radius) {
            return focus.add(new ex.Vector(0, diff - this.radius));
        }
        if (diff < -this.radius) {
            return focus.add(new ex.Vector(0, diff + this.radius));
        }
        return focus;
    }
}

