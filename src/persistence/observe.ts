import * as events from "events"

/* TODO: convert to ID-based entities */

import { Persistence } from "./persist"

import { Dir, Artifact, World } from "../universe/interfaces"
import { initWrittenWord, freeWrittenWord, WrittenEnvironment } from "../written/word"
import { numerate, normalizeDir, lengthDir } from "../universe/utils"
import { DIR } from "../universe/const"


export enum ObserverCommand {
    None = "None",
    Move = "Move",
}
const observerSpeed     = 0.01;
const observerThreshold = 0.01;
const observerInterval =  10; // ms

// export interface TimerEvent {}
// export function initObservance() {
//     /// how to do timer events
// }
    
export class PersistenceObserver extends events.EventEmitter {
    P?: Persistence;
    ownerId?: string;
    interval: any; // to be used for timer events?
    env?: WrittenEnvironment;
    
    init(P: Persistence, artifactId: string) {
        this.P = P;
        this.ownerId = artifactId;
        this.free();
    }


    free() {
        if (this.interval) clearInterval(this.interval);
        if (this.env) {
            freeWrittenWord(this.env);
            delete this.env;
        }
    }

    subscribe(artifact: Artifact, event: string, role: string, handler: any) {
        let h;
        // ---- ..... ----------------------------------------------------
        return h;
    }
    unsubscribe(artifact: Artifact, event: string, role: string, key:any) {
    }

    command: ObserverCommand;
    commandFunc: any;
    iterateCommand() { 
        if (this.command != ObserverCommand.None && this.commandFunc) {
            const nextCommand = this.commandFunc();
            if (nextCommand) { this.command = nextCommand }
            else             { this.command = ObserverCommand.None }
        }
    }
    executeCommand(command: ObserverCommand, params: object) {
        let that = this;
        this.command = command;
        // ---- MOVE -----------------------------------------------------
        if (command == ObserverCommand.Move) {
            const target = params;
            this.commandFunc = function(){
                // const artifact = target["artifact"];
                // const stepSize  = artifact.speed * observerSpeed;
                // const delta = normalizeDir({
                //     x: target["x"]-artifact.coords.position.x,
                //     y: target["y"]-artifact.coords.position.y,
                //     name: DIR.NONE.name
                // }, stepSize);
                // const newCoords: Coordinates = {
                //     world: artifact.coords.world,
                //     position: { 
                //         x: artifact.coords.position.x+delta.x,
                //         y: artifact.coords.position.y+delta.y,
                //         dir: delta,
                //     }
                // }
                // TODO ACTUAL MOVE PROCESSING
                // if (lengthDir(delta) < observerThreshold ||
                //         !tryToPlaceArtifact(artifact, newCoords)) {
                //     if (params["dir"].name != DIR.NONE.name) {
                //         artifact.coords.position.dir = params["dir"];
                //         placeArtifact(artifact, artifact.coords)
                //     }                   
                //     return;
                // }
                return ObserverCommand.Move;
            }
        }
        // ---- .... ----------------------------------------------------
    }

    async attempt() {
        this.free();
        const texts = [];
        const owner = await this.P.artifacts.load(this.ownerId);
        for (let i in owner.worldIds) {
            const world = await this.P.worlds.load(owner.worldIds[i])
            if (world.text != "") {
                texts.push(world.text)    
            }
        }
        const text = texts.join("\n\n");
        if (text == "") return;
        this.env = initWrittenWord(this, this.ownerId, text);
    }
}
