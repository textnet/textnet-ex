import * as events from "events"

import { Dir, Artifact, World, Coordinates } from "../universe/interfaces"
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


export interface TimerEvent {}


export function initObservance(eventTarget: ex.EventDispatcher) {
}
    
export class PersistenceObserver {
    artifact: Artifact;
    emitter: events.EventEmitter;
    interval;
    

    constructor(artifact: Artifact) {
        this.artifact = artifact;
        this.free();
        this.attempt();
    }


    free() {
        const that = this;
        //
        if (this.emitter) this.emitter.removeAllListeners();
        this.emitter = new events.EventEmitter();
        this.emitter.on("timer", function(){
            that.iterateCommand();
        })
        //
        clearInterval(this.interval);
        this.interval = setInterval(function(){
            that.emitter.emit("timer", {} as TimerEvent);
        }, observerInterval)
        //
        if (this.artifact._env) {
            freeWrittenWord(this.artifact._env);
            delete this.artifact._env;
        }
    }

    subscribe(artifact: Artifact, event: string, handler: any) {
        let h;
        // ---- TIMER -----------------------------------------------------
        if (event == "timer") {
            let time = Date.now();
            h = function(){
                handler.apply({ 
                    artifact: artifact,
                    delta: Date.now() - time,
                }, {});
                time = Date.now();
            };
        }
        // ---- MOVE -----------------------------------------------------
        if (event == "move") {
            h = function(event){
                if (event.artifact == artifact) {
                    handler.apply({
                        artifact: artifact, 
                        x: event.params.x,
                        y: event.params.y,
                        dx: event.params.dx,
                        dy: event.params.dy,
                        direction:  event.params.dir.name,
                    }, {})
                }
            };
        }
        // ---- PUSH -----------------------------------------------------
        if (event == "push") {
            h = function(event){
                if (event.artifact == artifact) {
                    handler.apply({
                        artifact:   artifact, 
                        pusher:     event.params.pusher,
                        direction:  event.params.dir.name
                    }, {})
                }
            };
        }
        // ---- PICKUP ---------------------------------------------------
        if (event == "pickup") {
            h = function(event){
                if (event.artifact == artifact) {
                    handler.apply({
                        artifact:   artifact, 
                        holder:     event.params.holder,
                    }, {})
                }
            };
        }
        // ---- PUTDOWN ---------------------------------------------------
        if (event == "putdown") {
            h = function(event){
                if (event.artifact == artifact) {
                    handler.apply({
                        artifact:   artifact, 
                        holder:     event.params.holder,
                        x: event.params.x,
                        y: event.params.y,
                    }, {})
                }
            };
        }
        // ---- ..... ----------------------------------------------------
        if (h) {
            this.emitter.on(event, h);            
        }        
        return h;
    }
    unsubscribe(artifact: Artifact, event: string, key:any) {
        this.emitter.removeListener(event, key);
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
                const artifact = target["artifact"];
                const stepSize  = artifact.speed * observerSpeed;
                const delta = normalizeDir({
                    x: target["x"]-artifact.coords.position.x,
                    y: target["y"]-artifact.coords.position.y,
                    name: DIR.NONE.name
                }, stepSize);
                const newCoords: Coordinates = {
                    world: artifact.coords.world,
                    position: { 
                        x: artifact.coords.position.x+delta.x,
                        y: artifact.coords.position.y+delta.y,
                        dir: delta,
                    }
                }
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

    attempt() {
        this.free();
        const texts = [];
        for (let i of this.artifact.worlds) {
            texts.push(i.text)
        }
        const text = texts.join("\n\n");
        if (text == "") return;
        const env = initWrittenWord(this, this.artifact.id, text);
        if (env) {
            this.artifact._env = env;
            this.artifact._emitter = this.emitter;
            return this.artifact;
        }
    }
}
