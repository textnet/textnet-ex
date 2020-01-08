import * as events from "events"

/* TODO: convert to ID-based entities */

import { Persistence } from "../persist"

import { Dir, Artifact, World, Position } from "../../universe/interfaces"
import { initWrittenWord, freeWrittenWord, WrittenEnvironment } from "../../written/word"


import * as observerEvents from "./observer_events";
import { ObserverCommand, ObserverEventType } from "./observer_events";




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
        const that = this;
        this.P = P;
        this.ownerId = artifactId;
        this.on(ObserverEventType.Timer, function( event: observerEvents.TimeEvent){
            // console.log(`<${that.ownerId}># timer: ${event.delta}, command=${that.command}`)
            that.iterateCommand();
        })
    }

    free() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
        }
        if (this.env) {
            freeWrittenWord(this.env);
            delete this.env;
        }
    }
    intervalSetup() {
        const that = this;
        if (this.interval) {
            clearInterval(this.interval)
            this.interval = undefined;
        }
        let prevTime = Date.now();
        this.interval = setInterval(function(){
            const nowTime = Date.now();
            const delta = nowTime - prevTime;
            prevTime = nowTime;
            that.emit(ObserverEventType.Timer, { delta: delta } as observerEvents.TimeEvent)
        }, observerEvents.observerInterval)
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
    async iterateCommand() { 
        if (this.command != ObserverCommand.None && this.commandFunc) {
            const nextCommand = await this.commandFunc();
            if (nextCommand) { this.command = nextCommand }
            else             { this.command = ObserverCommand.None }
        }
    }
    async executeCommand(command: ObserverCommand, params: object) {
        this.command = command;
        switch (command) {
            case ObserverCommand.Move:
                        this.commandFunc = await observerEvents.moveAction(this, 
                                           params as observerEvents.MoveEvent);
                        break;
        }  
        return ObserverCommand.None;                    
    }

    async attempt() {
        this.free();
        this.intervalSetup()
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
