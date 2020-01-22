/**
 * Observer module to handle Written Word in the context of Textnet.
 */
import * as events from "events"

import { deepCopy                       } from "../../utils"
import { Dir, Artifact, World, Position } from "../../interfaces"
import { Persistence                    } from "../persist"
import { initWrittenWord, 
         freeWrittenWord, 
         WrittenEnvironment             } from "../../written/word"
import { SyncWrittenPersistence         } from "../../written/persistence"

import * as observerEvents from "./observer_events";
import { ObserverCommand } from "./observer_events";


/**
 * Persistent Observer is responsible for executing Written Word
 * and receiving events in the vicinity of an artifact with
 * Written Word inside.
 *
 * Each artifact that has some Written Word in it, will spawn
 * an observer which will keep an eye on things happenning around.
 * 
 */    
export class PersistenceObserver extends events.EventEmitter {
    P?: Persistence;
    writtenP: SyncWrittenPersistence;
    ownerId?: string;
    interval: any; // to be used for timer events?
    subscribedKeys: any[];
    env?: WrittenEnvironment;

    _commands: ObserverCommand[]; 
    _commandFuncs: any[];
    command: ObserverCommand;
    commandFunc: any;
    
    /**
     * Create an observer and link it to an artifact by id.
     * @param {Persistence} P
     * @param {string}      artifactId
     */
    init(P: Persistence, artifactId: string) {
        const that = this;
        this.P = P;
        this.writtenP = new SyncWrittenPersistence(this);
        this.ownerId = artifactId;
        this.cleanCommands();
        this.command = ObserverCommand.None;
        this.subscribedKeys = [];
    }

    /**
     * Shut down the observer, dismissing intervals, VM environment, event listeners.
     */
    free() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
        }
        if (this.env) {
            freeWrittenWord(this.env);
            delete this.env;
        }
        for (let item of this.subscribedKeys) {
            this.off(item["event"], item["key"]);
        }
        this.subscribedKeys = [];
    }

    /**
     * Setup the base interval that creates "timer" events.
     * Those events are also used to execute on spatial commands.
     */
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
            that.sendEvent("timer", 
                           { delta: delta } as observerEvents.TimeEvent,
                           { object: that.ownerId })
        }, observerEvents.observerInterval)
        this.subscribe(undefined, "timer", "world", 
            (event: observerEvents.TimeEvent) => { that.iterateCommand() })
    }

    /**
     * Emit an event (and convey it to all targets mentioned).
     * More on events in Written Word documentation.
     * @param {string} event
     * @param {any}    data
     * @param {Record<string,Artifact>} targets @optional
     */
    sendEvent(event: string, data,
              targetIds?: Record<string,string>){
        this.emit(event, {
            data: deepCopy(data),
            targetIds: targetIds,
        });            
    }

    /**
     * Subscribe on an event for an artifact with a given role.
     * E.g. <Subject> PUSHES <object> in the <world>.
     * More on events in Written Word documentation.
     * @param {string}   artifactId
     * @param {string}   event
     * @param {string}   role (subject, object, world)
     * @param {function} handler
     * @returns {any}    key to 'unsubscribe'
     */
    subscribe(artifactId: string, event: string, role: string, handler: any) {
        if (!artifactId) {
            artifactId = this.ownerId;
        }
        const that = this;
        const key = (fullData) => {
            let caught = false;
            if (fullData.targetIds) {
                if (fullData.targetIds[role]) {
                    if (fullData.targetIds[role] == artifactId) {
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
                    data: fullData.data,
                    targetIds: fullData.targetIds,
                }
                if (handler.invoke) {
                    that.prepareWrittenPersistence().then(function(){
                        for (let i of ["subject", "object", "world"]) {
                            const targetId = fullData.targetIds[i];
                            if (targetId) {
                                eventData[i] = that.writtenP.artifacts.load(targetId);
                            }
                        }
                        handler.invoke(eventData, {})    
                    })
                } else {
                    handler.call(this, eventData);
                }
            }
        };
        this.on(event, key);
        this.subscribedKeys.push({event:event, role: role, key:key})
        console.log(`(${this.ownerId}) SUBSCRIBE <${artifactId}> #${event}:${role}`)
        return key;
    }

    /**
     * Remove a subscription.
     * More on events in Written Word documentation.
     * @param {Artifact} artifact
     * @param {string}   event
     * @param {string}   role (subject, object, world)
     * @param {any}      key
     */
    unsubscribe(artifact: Artifact, event: string, role: string, key:any) {
        this.off(event, key);
        if (artifact) console.log(`(${this.ownerId}) unsubscribe <${artifact.name}> #${event}:${role}`)
        else          console.log(`(${this.ownerId}) unsubscribe <> #${event}:${role}`)
    }    

    /**
     * Clean the chained command stack.
     */
    cleanCommands() {
        this._commands = [];
        this._commandFuncs = [];
    }

    /**
     * Move on to the next command in the command stack.
     */
    nextCommand() {
        if (this._commands.length == 0) {
            this.command = ObserverCommand.None;
            this.commandFunc = undefined;
        } else {
            this.command = this._commands.shift();
            this.commandFunc = this._commandFuncs.shift();
        }
    }

    /**
     * Function that is called on timer to make sure we are iterating
     * inn a command. E.g. while 'move' requires multiple iterations
     * until it gets to its designated point.
     */
    async iterateCommand() { 
        if (this.command != ObserverCommand.None && this.commandFunc) {
            const repeat = await this.commandFunc();
            if (!repeat) {
                this.nextCommand();
            }
        }
    }

    /**
     * Call this when you want to command an observer to do something.
     * We might need to rewrite that later. TODO
     */
    async executeCommand(command: ObserverCommand, params: object) {
        let commandFunc;
        switch (command) {
            case ObserverCommand.Move:
                        commandFunc = await observerEvents.moveAction(this, 
                                      params as observerEvents.MoveCommand);
                        break;
            case ObserverCommand.Place:
                        commandFunc = await observerEvents.placeAction(this, 
                                      params as observerEvents.PlaceCommand);
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

    /**
     * The Observer attempts to set itself up.
     * If successful, the VM is ready and Written Word has been executed.
     */
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

    /**
     * A straightforward way of creating synchronous Written Persistence
     * for running the Written Word.
     */
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
        // setup from scratch, yeah.
        this.writtenP.artifacts.setup(artifacts);
        this.writtenP.worlds.setup(worlds);
    }
}
