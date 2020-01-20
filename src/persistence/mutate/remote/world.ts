
import { Position, Artifact, World } from "../../../interfaces"
import { Persistence } from "../../persist"

import * as RemoteEvent from "./event_structures"
import { wrapper } from "./wrapper"


export async function worldPickup(P: Persistence, world: World, 
                                  artifactId: string, objId: string) {
    return await wrapper(P, "worldPickup", world.id, {
        artifactId: artifactId,
        worldId:    world.id,
        objId:      objId,
    } as RemoteEvent.WorldPickup);
}

export async function worldPutdown(P: Persistence, world: World, 
                                   artifactId: string, objId: string) {
    return await wrapper(P, "worldPutdown", world.id, {
        artifactId: artifactId,
        worldId:    world.id,
        objId:      objId,
    } as RemoteEvent.WorldPutdown);
}

export async function worldUpdateProperties(P: Persistence, world: World, 
                                            artifactId: string) {
    return await wrapper(P, "worldUpdateProperties", world.id, {
        artifactId: artifactId,
        worldId:    world.id,
    } as RemoteEvent.WorldProperties);
}

export async function worldRemoveFromWorld(P: Persistence, world: World, 
                                           artifactId: string) {
    return await wrapper(P, "worldRemoveFromWorld", world.id, {
        artifactId: artifactId,
        worldId:    world.id,
    } as RemoteEvent.WorldRemove);
}

export async function worldInsertIntoWorld(P: Persistence, world: World, 
                                           artifactId: string, pos: Position) {
    return await wrapper(P, "worldInsertIntoWorld", world.id, {
        artifactId: artifactId,
        worldId:    world.id,
        pos:        pos,
    } as RemoteEvent.WorldInsert);
}

export async function worldUpdateInWorld(P: Persistence, world: World, 
                                         artifactId: string, pos: Position) {
    return await wrapper(P, "worldUpdateInWorld", world.id, {
        artifactId: artifactId,
        worldId:    world.id,
        pos:        pos,
    } as RemoteEvent.WorldUpdate);
}

export async function worldUpdateText(P: Persistence, world: World, text:string ) {
    return await wrapper(P, "worldUpdateText", world.id, {
        worldId:    world.id,
        text:       text,
    } as RemoteEvent.WorldUpdateText);
}

