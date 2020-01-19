
import { Position, Artifact, World } from "../../../interfaces"
import { Persistence } from "../../persist"

import * as RemoteEvent from "./event_structures"
import { wrapper } from "./wrapper"

export async function worldRemoveFromWorld(P: Persistence, artifact: Artifact, world: World) {
    return await wrapper(P, "worldRemoveFromWorld", world.id, {
        artifactId: artifact.id,
        worldId:    world.id,
    } as RemoteEvent.WorldRemove);
}

export async function worldInsertIntoWorld(P: Persistence, artifact: Artifact, world: World, pos: Position) {
    return await wrapper(P, "worldInsertIntoWorld", world.id, {
        artifactId: artifact.id,
        worldId:    world.id,
        pos:        pos,
    } as RemoteEvent.WorldInsert);
}

export async function worldUpdateInWorld(P: Persistence, artifact: Artifact, world: World, pos: Position) {
    return await wrapper(P, "worldUpdateInWorld", world.id, {
        artifactId: artifact.id,
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

