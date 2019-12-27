import * as ex from 'excalibur';
import { 
    Artifact, Avatar, World, 
    Position, Dir, Coordinates 
} from "./interfaces"
import {
    EVENT
} from "./const"

/**
 * First approach to cross-universe messaging.
 * Currently a prototype which is not used much.
 * Expected to come into more use during the 'Written Text' phase 
 * and fully used in 'Multiplayer Persistence'.
 */


/** 
 * Events that are sent around about things that happen with artifacts.
 *
 */
export class SyncEvent extends ex.GameEvent<any> {
    _action: string;
    artifact: Artifact;
    params: object;
    constructor(action: string, artifact?: Artifact, params?: object) {
        super()
        this._action = action;
        this.artifact = artifact;
        this.params = params || {};
    }
}

// + "script:move(artifact, dx, dy, x, y, dir)"
// - "script:enter(avatar, world)"
// - "script:leave(avatar, world)" <- TBD stack!
// - "script:push(artifactSubject, artifactObject, dir)"
// - "script:pull(artifactSubject, artifactObject, dir)"
// - "script:activate(avatar, artifact, dir)"
// - "script:pickup(avatar, artifact)"
// - "script:putdown(avatar, artifact)"
// - "script:create(avatar, artifact)"
// - "script:destroy(avatar, artifact)"

// - "script:text(artifact, text)"
// - "script:line(artifact, lineno, line)"

export class ScriptEvent extends SyncEvent {}
export class ScriptPushEvent extends ScriptEvent {
    constructor(artifact: Artifact, pusher: Artifact, dir: Dir) {
        super(EVENT.PUSH.action, artifact, {
            pusher: pusher,
            dir: artifact.coords.position.dir,           
        });
    }
}
export class ScriptMoveEvent extends ScriptEvent {
    constructor(artifact: Artifact, dx:number, dy:number) {
        super(EVENT.MOVE.action, artifact, {
            dx:  dx,
            dy:  dy,
            x:   artifact.coords.position.x,
            y:   artifact.coords.position.y,
            dir: artifact.coords.position.dir,           
        });
    }
}

export class ScriptPickupEvent extends ScriptEvent {
    constructor(artifact: Artifact, holder: Artifact) {
        super(EVENT.PICK.action, artifact, {
            holder: holder
        });
    }
}
export class ScriptPutdownEvent extends ScriptEvent {
    constructor(artifact: Artifact, holder: Artifact, x:number, y:number) {
        super(EVENT.DOWN.action, artifact, {
            holder: holder,
            x: x, 
            y: y,
        });
    }
}

export class ScriptTextEvent extends ScriptEvent {
    constructor(artifact: Artifact, text:string, compile:boolean) {
        super(EVENT.TEXT.action, artifact, {
            text: text,
            compile: compile,
        });
    }
}

export class ScriptPropertiesEvent extends ScriptEvent {
    constructor(artifact: Artifact, properties:object) {
        super(EVENT.PROP.action, artifact, {
            properties: properties,
        });
    }
}


export class ScriptTimerEvent extends ScriptEvent {
    constructor() {
        super(EVENT.TIME.action)
    }
}







/*

Events to sync:

Push-push action: like balls. Are balls alive? 
Not necessary, they can be moved by another mind.
Still, as long as there is mind moving something, the event is originated from it.

event: 
    - artifact
    - action
    - params: position, etc.
    - originator

- artifact:reposition
- artifact:remove
- artifact:place
- avatar:move? push? be pushed? activate? enter?
    - I need events to recreate them on the other side. So basically all events?
- artifact:move(dX, dY, sourcePosition)

are my events always connected to an artifact?
what would be an example of an event which is not artifact related?
consider an event that touches 'world' -> we don't have it?

To maintain consistency, all events must be applied to a world where action is happening.
Other events can be queried at the moment of entering the world.
On other hand, if something is modifying another artifact outside the world, or rather 
inside the world, then it might make sense to trace those events. Well, no.

So, to capture everything, it is enough to capture events touching artifacts of 
the player's world or the artifact that owns that world.

As we don't know of world that other players are visiting, we have to emit all 
artifact-specific events.

Unclear: how to sync 'written word'. It is surely an event within an artifact, so 
at very least it fits 



*/

