import * as ex from 'excalibur';
import { Dir, Artifact, Avatar, AvatarKind, World, Coordinates } from "./universe/interfaces"
import { initWrittenWord, freeWrittenWord, WrittenEnvironment } from "./written/word"
import { numerate, normalizeDir, lengthDir } from "./universe/utils"
import { DIR } from "./universe/const"
import { tryToPlaceArtifact, placeArtifact } from "./universe/manipulations"
import { ScriptTimerEvent } from "./universe/events"


export enum ObserverCommand {
    None = "None",
    Move = "Move",
}
const observerSpeed     = 0.01;
const observerThreshold = 0.01;
const observerInterval =  10; // ms

export function initObservance(dispatcher: ex.EventDispatcher) {
    setInterval(function(){
        dispatcher.emit("script:timer", new ScriptTimerEvent())
    }, observerInterval)
}
    
export class AvatarObserver {
    artifact: Artifact;
    avatar: Avatar;
    dispatcher: ex.EventDispatcher;

    constructor(artifact: Artifact) {
        const that = this;
        this.dispatcher = new ex.EventDispatcher({});
        this.dispatcher.on("script:timer", function(){
            that.iterateCommand();
        });
        this.artifact = artifact;
        this.avatar = this.attemptAvatar();
    }

    free() {
        if (this.avatar && this.avatar._env) {
            this.dispatcher.unwire(this.artifact.dispatcher);
            freeWrittenWord(this.artifact.avatar._env);
            delete this.artifact.avatar._env;
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
            this.dispatcher.on("script:"+event, h);
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
            this.dispatcher.on("script:"+event, h);
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
            this.dispatcher.on("script:"+event, h);
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
            this.dispatcher.on("script:"+event, h);
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
            this.dispatcher.on("script:"+event, h);
        }
        // ---- ..... ----------------------------------------------------
        return h;
    }
    unsubscribe(artifact: Artifact, event: string, key:any) {
        this.dispatcher.off("script:"+event, key)
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
                if (lengthDir(delta) < observerThreshold ||
                        !tryToPlaceArtifact(artifact, newCoords)) {
                    if (params["dir"].name != DIR.NONE.name) {
                        artifact.coords.position.dir = params["dir"];
                        placeArtifact(artifact, artifact.coords)
                    }                   
                    return;
                }
                return ObserverCommand.Move;
            }
        }
        // ---- .... ----------------------------------------------------
    }

    attemptAvatar() {
        const texts = []
        for (let i of this.artifact.worlds) {
            texts.push(i.text)
        }
        const text = texts.join("\n\n");
        if (text == "") return;
        const env = initWrittenWord(this, this.artifact.id, text);
        this.free();
        if (env) {
            if (!this.artifact.avatar) {
                this.artifact.avatar = {
                    id: numerate("avatar"),
                    body: this.artifact,
                    inventory: [],
                    kind: AvatarKind.LOCAL,
                    visits: {},
                    visitsStack: [],
                }
            }
            this.artifact.avatar._env = env;
            this.dispatcher.wire(this.artifact.dispatcher);
            return this.artifact.avatar;
        }
    }
}
