// import * as ex from 'excalibur';
// import { 
//     Artifact, World, 
//     Position, Dir, Coordinates 
// } from "./interfaces"
// import {
//     EVENT
// } from "./const"

// /**
//  * First approach to cross-universe messaging.
//  * Currently a prototype which is not used much.
//  * Expected to come into more use during the 'Written Text' phase 
//  * and fully used in 'Multiplayer Persistence'.
//  */


// /** 
//  * Events that are sent around about things that happen with artifacts.
//  *
//  */
// export class SyncEvent extends ex.GameEvent<any> {
//     _action: string;
//     artifact: Artifact;
//     params: object;
//     constructor(action: string, artifact?: Artifact, params?: object) {
//         super()
//         this._action = action;
//         this.artifact = artifact;
//         this.params = params || {};
//     }
// }


// export class ScriptEvent extends SyncEvent {}
// export class ScriptPushEvent extends ScriptEvent {
//     constructor(artifact: Artifact, pusher: Artifact, dir: Dir) {
//         super(EVENT.PUSH.action, artifact, {
//             pusher: pusher,
//             dir: artifact.coords.position.dir,           
//         });
//     }
// }
// export class ScriptMoveEvent extends ScriptEvent {
//     constructor(artifact: Artifact, dx:number, dy:number) {
//         super(EVENT.MOVE.action, artifact, {
//             dx:  dx,
//             dy:  dy,
//             x:   artifact.coords.position.x,
//             y:   artifact.coords.position.y,
//             dir: artifact.coords.position.dir,           
//         });
//     }
// }

// export class ScriptPickupEvent extends ScriptEvent {
//     constructor(artifact: Artifact, holder: Artifact) {
//         super(EVENT.PICK.action, artifact, {
//             holder: holder
//         });
//     }
// }
// export class ScriptPutdownEvent extends ScriptEvent {
//     constructor(artifact: Artifact, holder: Artifact, x:number, y:number) {
//         super(EVENT.DOWN.action, artifact, {
//             holder: holder,
//             x: x, 
//             y: y,
//         });
//     }
// }

// export class ScriptTextEvent extends ScriptEvent {
//     constructor(artifact: Artifact, text:string, compile:boolean) {
//         super(EVENT.TEXT.action, artifact, {
//             text: text,
//             compile: compile,
//         });
//     }
// }

// export class ScriptPropertiesEvent extends ScriptEvent {
//     constructor(artifact: Artifact, properties:object) {
//         super(EVENT.PROP.action, artifact, {
//             properties: properties,
//         });
//     }
// }


// export class ScriptTimerEvent extends ScriptEvent {
//     constructor() {
//         super(EVENT.TIME.action)
//     }
// }
