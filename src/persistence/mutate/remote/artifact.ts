
import { Position, Artifact, World } from "../../../interfaces"
import { Persistence } from "../../persist"

import * as RemoteEvent from "./event_structures"
import { wrapper } from "./wrapper"


export async function artifactEnter(P: Persistence, artifact: Artifact, world: World) {
    return await wrapper(P, "artifactEnter", artifact.id, {
        artifactId: artifact.id,
        worldId:    world.id,
    } as RemoteEvent.ArtifactEnter);
}

export async function artifactLeave(P: Persistence, artifact: Artifact, world: World, disconnect?: boolean) {
    return await wrapper(P, "artifactLeave", artifact.id, {
        artifactId: artifact.id,
        worldId:    world.id,
        disconnect: disconnect
    } as RemoteEvent.ArtifactLeave);
}

export async function artifactPickup(P: Persistence, artifact: Artifact, obj: Artifact) {
    return await wrapper(P, "artifactPickup", artifact.id, {
        artifactId: artifact.id,
        objId:      obj.id,
    } as RemoteEvent.ArtifactPickup);
}

export async function artifactPutdown(P: Persistence, artifact: Artifact) {
    return await wrapper(P, "artifactPutdown", artifact.id, {
        artifactId: artifact.id,
    } as RemoteEvent.ArtifactPutdown);
}

export async function artifactRemoveFromWorld(P: Persistence, artifact: Artifact, world: World) {
    return await wrapper(P, "artifactRemoveFromWorld", artifact.id, {
        artifactId: artifact.id,
        worldId:    world.id,
    } as RemoteEvent.ArtifactRemove);
}

export async function artifactInsertIntoWorld(P: Persistence, artifact: Artifact, world: World, 
                                              pos: Position) {
    return await wrapper(P, "artifactInsertIntoWorld", artifact.id, {
        artifactId: artifact.id,
        worldId:    world.id,
        pos:        pos,
    } as RemoteEvent.ArtifactInsert);
}

export async function artifactUpdateProperties(P: Persistence, artifact: Artifact, properties) {
    return await wrapper(P, "artifactUpdateProperties", artifact.id, {
        artifactId: artifact.id,
        properties: properties,
    } as RemoteEvent.ArtifactProperties);
}
