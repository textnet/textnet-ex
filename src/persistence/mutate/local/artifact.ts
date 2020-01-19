
import { Persistence }                    from "../../persist"
import { spawnPosition }                  from "../../../const"
import { Position, Artifact, World, Dir } from "../../../interfaces"
import { deepCopy }                       from "../../../utils"

import * as remote from "../remote/artifact"


export async function artifactEnter(P: Persistence, artifact: Artifact, worldId: string) {
    if (!await remote.artifactEnter(P, artifact, worldId)) {
        if (!artifact.visits[ worldId ]) {
            artifact.visits[ worldId ] = deepCopy(spawnPosition);
        } 
        if (artifact.hostId && (artifact.hostId != worldId)) {
            artifact.visitsStack.push( worldId );
        }
        await P.artifacts.save(artifact);        
    }
}

export async function artifactLeave(P: Persistence, artifact: Artifact, worldId: string,
                                    position: Position, disconnect?: boolean) {
    if (!await remote.artifactLeave(P, artifact, worldId, position, disconnect)) {
        if (!disconnect) {
            artifact.visitsStack.pop();
        }
        artifact.visits[worldId] = deepCopy(position);
        await P.artifacts.save(artifact);
    }
}

export async function artifactPickup(P: Persistence, artifact: Artifact, objId: string) {
    if (!await remote.artifactPickup(P, artifact, objId)) {
        artifact.inventoryIds.push(objId)
        await P.artifacts.save(artifact);
    }
}


export async function artifactPutdown(P: Persistence, artifact: Artifact) {
    if (!await remote.artifactPutdown(P, artifact)) {
        artifact.inventoryIds.pop();
        await P.artifacts.save(artifact);
    }
}


export async function artifactRemoveFromWorld(P: Persistence, artifact: Artifact, 
                                              worldId: string, position: Position) {
    if (!await remote.artifactRemoveFromWorld(P, artifact, worldId, position)) {
        artifact.visits[ worldId ] = deepCopy(position)
        await P.artifacts.save(artifact);
    }
}


export async function artifactInsertIntoWorld(P: Persistence, artifact: Artifact, 
                                              worldId: string, pos: Position) {
    if (!await remote.artifactInsertIntoWorld(P, artifact, worldId, pos)) {
        artifact.hostId = worldId;
        artifact.visits[ worldId ] = deepCopy(pos)
        await P.artifacts.save(artifact);
    }
}


export async function artifactUpdateProperties(P: Persistence,
                                               artifact: Artifact, properties) {
    if (!await remote.artifactUpdateProperties(P, artifact, properties)) {
        for (let key in properties) {
            if (properties[key] != undefined) {
                artifact[key] = properties[key];
            }
        }
        await P.artifacts.save(artifact);
    }
}

