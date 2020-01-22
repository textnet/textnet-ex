
import { Position, Artifact, World } from "../../../interfaces"
import { Persistence } from "../../persist"

import * as RemoteEvent from "./event_structures"
import { wrapper } from "./wrapper"


export async function artifactEnter(P: Persistence, artifact: Artifact, worldId: string) {
    return await wrapper(P, "artifactEnter", artifact.id, {
        artifactId: artifact.id,
        worldId:    worldId,
    } as RemoteEvent.ArtifactEnter);
}

export async function artifactLeave(P: Persistence, artifact: Artifact, worldId: string, 
                                    position: Position, disconnect?: boolean) {
    return await wrapper(P, "artifactLeave", artifact.id, {
        artifactId: artifact.id,
        worldId:    worldId,
        position:   position,
        disconnect: disconnect,
    } as RemoteEvent.ArtifactLeave);
}

export async function artifactPickup(P: Persistence, artifact: Artifact, objId: string) {
    return await wrapper(P, "artifactPickup", artifact.id, {
        artifactId: artifact.id,
        objId:      objId,
        worldId:    artifact.hostId,
    } as RemoteEvent.ArtifactPickup);
}

export async function artifactPutdown(P: Persistence, artifact: Artifact) {
    return await wrapper(P, "artifactPutdown", artifact.id, {
        artifactId: artifact.id,
        worldId:    artifact.hostId,
    } as RemoteEvent.ArtifactPutdown);
}

export async function artifactRemoveFromWorld(P: Persistence, artifact: Artifact, 
                                              worldId: string, position: Position) {
    return await wrapper(P, "artifactRemoveFromWorld", artifact.id, {
        artifactId: artifact.id,
        worldId:    worldId,
        position:   position,
    } as RemoteEvent.ArtifactRemove);
}

export async function artifactInsertIntoWorld(P: Persistence, artifact: Artifact, 
                                              worldId: string, position: Position) {
    return await wrapper(P, "artifactInsertIntoWorld", artifact.id, {
        artifactId: artifact.id,
        worldId:    worldId,
        pos:        position,
    } as RemoteEvent.ArtifactInsert);
}

export async function artifactUpdateProperties(P: Persistence, artifact: Artifact, properties) {
    return await wrapper(P, "artifactUpdateProperties", artifact.id, {
        artifactId: artifact.id,
        worldId:    artifact.hostId,
        properties: properties,
    } as RemoteEvent.ArtifactProperties);
}
