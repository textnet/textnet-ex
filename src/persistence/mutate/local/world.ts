
import { Persistence }                    from "../../persist"
import { spawnPosition }                  from "../../../const"
import { Position, Artifact, World, Dir } from "../../../interfaces"
import { deepCopy, deltaPos }             from "../../../utils"

import { fit } from "../place"

import * as remote from "../remote/world"
import * as RemoteEvent from "../remote/event_structures"


export async function worldPickup(P: Persistence, world: World, 
                                  artifactId: string, objId: string) {
    if (!await remote.worldPickup(P, world, artifactId, objId)) {
        // emit event!
        P.subscription.emit("echo:pickup", world.id, {
            artifactId: artifactId,
            worldId:    world.id,
            objId: objId,
        } as RemoteEvent.WorldPickup);
    }
}

export async function worldPutdown(P: Persistence, world: World, 
                                   artifactId: string, objId: string) {
    if (!await remote.worldPutdown(P, world, artifactId, objId)) {
        // emit event!
        P.subscription.emit("echo:putdown", world.id, {
            artifactId: artifactId,
            worldId:    world.id,
            objId:      objId,
        } as RemoteEvent.WorldPutdown);
    }    
}

export async function worldUpdateProperties(P: Persistence, world: World, 
                                      artifactId: string) {
    if (!await remote.worldUpdateProperties(P, world, artifactId)) {
        // emit event!
        P.subscription.emit("echo:properties", world.id, {
            worldId:    world.id,
            artifactId: artifactId,
        } as RemoteEvent.WorldProperties);        
    }    
}

export async function worldRemoveFromWorld(P: Persistence, world: World, 
                                           artifactId: string) {
    if (!await remote.worldRemoveFromWorld(P, world, artifactId)) {
        const pos = deepCopy(world.artifactPositions[ artifactId ]);
        delete world.artifactPositions[ artifactId ];    
        await P.worlds.save(world);
        // emit event!
        P.subscription.emit("echo:leave", world.id, {
            artifactId: artifactId,
            worldId: world.id,
        } as RemoteEvent.WorldRemove);
        P.subscription.unsubscribe(world.id, artifactId);
    }
}

export async function worldInsertIntoWorld(P: Persistence, world: World, 
                                           artifactId: string, pos: Position) {
    if (!await remote.worldInsertIntoWorld(P, world, artifactId, pos)) {
        world.artifactPositions[ artifactId ] = deepCopy(pos)
        await P.worlds.save(world);
        P.subscription.subscribe(world.id, artifactId);
        // emit event!
        P.subscription.emit("echo:enter", world.id, {
            artifactId: artifactId,
            worldId: world.id,
            pos: pos,
        } as RemoteEvent.WorldInsert);
    }
}

export async function worldUpdateInWorld(P: Persistence, world: World, 
                                         artifactId: string, pos: Position) {
    if (!await remote.worldUpdateInWorld(P, world, artifactId, pos)) {
        let prevPos = deepCopy(world.artifactPositions[ artifactId ]);
        world.artifactPositions[ artifactId ] = deepCopy(pos)
        if (!prevPos) prevPos = pos;
        await P.worlds.save(world);
        // emit event!
        P.subscription.emit("echo:move", world.id, {
            artifactId: artifactId,
            worldId: world.id,
            pos: pos,
            delta: deltaPos(pos, prevPos),
        } as RemoteEvent.WorldUpdate);
    }
}

export async function worldUpdateText(P: Persistence, world: World, text:string,
                                      skipAttempt?: boolean ) {
    if (!await remote.worldUpdateText(P, world, text, skipAttempt)) {
        if (text != undefined) {
            world.text = text;
            await P.worlds.save(world);
        }
        if (!skipAttempt) {
            await P.observers[world.ownerId].attempt();    
        }
        // emit event!
        P.subscription.emit("echo:text", world.id, {
            worldId: world.id,
            text: text,
            skipAttempt: skipAttempt,
        } as RemoteEvent.WorldUpdateText);    
    }
}

