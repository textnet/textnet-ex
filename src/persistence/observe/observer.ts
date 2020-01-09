import * as events from "events"

import { Persistence } from "../persist"
import { deepCopy } from "../../universe/utils"

import { Dir, Artifact, World, Position } from "../../universe/interfaces"
import { initWrittenWord, freeWrittenWord, WrittenEnvironment } from "../../written/word"
import { SyncWrittenPersistence } from "../../written/persistence"


import * as observerEvents from "./observer_events";
import { ObserverCommand } from "./observer_events";




    
export class PersistenceObserver extends events.EventEmitter {
    P?: Persistence;
    writtenP: SyncWrittenPersistence;
    ownerId?: string;
    interval: any; // to be used for timer events?
    env?: WrittenEnvironment;
    
    init(P: Persistence, artifactId: string) {
        const that = this;
        this.P = P;
        this.writtenP = new SyncWrittenPersistence(this);
        this.ownerId = artifactId;
        this.cleanCommands();
        this.command = ObserverCommand.None;
        this.subscribe(undefined, "timer", "object", 
            (event: observerEvents.TimeEvent) => { that.iterateCommand() })
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
            that.sendEvent("timer", { delta: delta } as observerEvents.TimeEvent)
        }, observerEvents.observerInterval)
    }

    sendEvent(event: string, data,
              targets?: Record<string,Artifact>){
        let targetIds: Record<string,string> = {}
        if (targets) {
            for (let targetRole in targets) {
                targetIds[targetRole] = targets[targetRole].id
            }
        } else {
            targetIds = undefined;
        }
        this.emit(event, {
            data: deepCopy(data),
            targetIds: targetIds,
        });
    }
    subscribe(artifact: Artifact, event: string, role: string, handler: any) {
        const that = this;
        const key = this.on(event, (fullData) => {
            let caught = false;
            if (fullData.targetIds) {
                if (fullData.targetIds[role]) {
                    if (fullData.targetIds[role] == artifact.id) {
                        caught = true;
                    }
                }
            } else {
                caught = true;
            }
            if (caught) {
                const eventData = {
                    event: event,
                    role: role,
                    data: fullData.data
                }
                if (handler.invoke) {
                    handler.invoke(eventData, {})
                } else {
                    handler.call(this, eventData);
                }
            }
        });
        if (artifact) console.log(`SUBSCRIBE <${artifact.name}> #${event}:${role}`)
        else          console.log(`SUBSCRIBE <> #${event}:${role}`)
        return key;
    }
    unsubscribe(artifact: Artifact, event: string, role: string, key:any) {
        this.off(event, key);
        if (artifact) console.log(`unsubscribe <${artifact.name}> #${event}:${role}`)
        else          console.log(`unsubscribe <> #${event}:${role}`)
    }    

    cleanCommands() {
        this._commands = [];
        this._commandFuncs = [];
    }
    async nextCommand() {
        if (this._commands.length == 0) {
            this.command = ObserverCommand.None;
            this.commandFunc = undefined;
        } else {
            this.command = this._commands.shift();
            this.commandFunc = this._commandFuncs.shift();
        }
    }
    _commands: ObserverCommand[]; 
    _commandFuncs: any[];
    command: ObserverCommand;
    commandFunc: any;
    async iterateCommand() { 
        if (this.command != ObserverCommand.None && this.commandFunc) {
            const repeat = await this.commandFunc();
            if (!repeat) {
                await this.nextCommand();
            }
        }
    }
    async executeCommand(command: ObserverCommand, params: object) {
        let commandFunc;
        switch (command) {
            case ObserverCommand.Move:
                        commandFunc = await observerEvents.moveAction(this, 
                                      params as observerEvents.MoveEvent);
                        break;
            case ObserverCommand.Place:
                        commandFunc = await observerEvents.placeAction(this, 
                                      params as observerEvents.PlaceEvent);
                        break;
            case ObserverCommand.Halt:
                        this.cleanCommands()
                        break;
        }
        if (commandFunc) {
            this._commands.push(command);
            this._commandFuncs.push(commandFunc);
        }
        if (this.command == ObserverCommand.None) {
            this.nextCommand()
        }
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
        await this.prepareWrittenPersistence();
        this.env = initWrittenWord(this, this.ownerId, text);
    }

    async prepareWrittenPersistence() {
        const artifacts: Record<string,Artifact> = {};
        const worlds:    Record<string,World> = {};
        // artifacts - 1
        const artifact = await this.P.artifacts.load(this.ownerId);
        artifacts[artifact.id] = artifact;
        // outer world
        if (artifact.hostId) {
            const hostWorld = await this.P.worlds.load(artifact.hostId)
            worlds[hostWorld.id] = hostWorld;
            for (let id in hostWorld.artifactPositions) {
                const a = await this.P.artifacts.load(id);
                artifacts[id] = a;
            }
        }
        // inner worlds - 1
        for (let id in artifacts) {
            for (let worldName in artifact.worldIds) {
                const innerWorld = await this.P.worlds.load(artifact.worldIds[worldName])
                worlds[innerWorld.id] = innerWorld;
            }
        }   
        // artifacts - 2 (with their worlds)
        for (let worldId in worlds) {
            if (worldId != artifact.hostId) {
                for (let artifactId in worlds[worldId].artifactPositions) {
                    const innerArtifact = await this.P.artifacts.load(artifactId);
                    artifacts[artifactId] = innerArtifact;
                    for (let worldName in innerArtifact.worldIds) {
                        const innerWorld = await this.P.worlds.load(
                                           innerArtifact.worldIds[worldName]);
                        worlds[innerWorld.id] = innerWorld;
                    }
                }
            }
        }
        // setup from scratch, yeah.
        this.writtenP.artifacts.setup(artifacts);
        this.writtenP.worlds.setup(worlds);
    }
}
