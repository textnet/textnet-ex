
import { Persistence }                    from "../../persist"
import { spawnPosition }                  from "../../../const"
import { Position, Artifact, World, Dir } from "../../../interfaces"
import { deepCopy }                       from "../../../utils"

import * as remote from "../remote/artifact"


export async function artifactEnter(P: Persistence, artifact: Artifact, worldId: string) {
    if (!await remote.artifactEnter(P, artifact, worldId)) {
        const fullArtifact = await P.artifacts.load(artifact.id);
        if (!fullArtifact.visits[ worldId ]) {
            fullArtifact.visits[ worldId ] = deepCopy(spawnPosition);
        } 
        if (fullArtifact.hostId && (artifact.hostId != worldId)) {
            fullArtifact.visitsStack.push( worldId );
        }
        await P.artifacts.save(fullArtifact);        
    }
}

export async function artifactLeave(P: Persistence, artifact: Artifact, worldId: string,
                                    position: Position, disconnect?: boolean) {
    if (!await remote.artifactLeave(P, artifact, worldId, position, disconnect)) {
        const fullArtifact = await P.artifacts.load(artifact.id);
        if (!disconnect) {
            fullArtifact.visitsStack.pop();
        }
        fullArtifact.visits[worldId] = deepCopy(position);
        await P.artifacts.save(fullArtifact);
    }
}

export async function artifactPickup(P: Persistence, artifact: Artifact, objId: string) {
    if (!await remote.artifactPickup(P, artifact, objId)) {
        const fullArtifact = await P.artifacts.load(artifact.id);
        fullArtifact.inventoryIds.push(objId)
        await P.artifacts.save(fullArtifact);
    }
}


export async function artifactPutdown(P: Persistence, artifact: Artifact) {
    if (!await remote.artifactPutdown(P, artifact)) {
        const fullArtifact = await P.artifacts.load(artifact.id);
        fullArtifact.inventoryIds.pop();
        await P.artifacts.save(fullArtifact);
    }
}


export async function artifactRemoveFromWorld(P: Persistence, artifact: Artifact, 
                                              worldId: string, position: Position) {
    if (!await remote.artifactRemoveFromWorld(P, artifact, worldId, position)) {
        const fullArtifact = await P.artifacts.load(artifact.id);
        fullArtifact.hostId = null;
        fullArtifact.visits[ worldId ] = deepCopy(position)
        await P.artifacts.save(fullArtifact);
    }
}


export async function artifactInsertIntoWorld(P: Persistence, artifact: Artifact, 
                                              worldId: string, position: Position) {
    if (!await remote.artifactInsertIntoWorld(P, artifact, worldId, position)) {
        const fullArtifact = await P.artifacts.load(artifact.id);
        fullArtifact.hostId = worldId;
        fullArtifact.visits[ worldId ] = deepCopy(position)
        await P.artifacts.save(fullArtifact);
    }
}


export async function artifactUpdateProperties(P: Persistence,
                                               artifact: Artifact, properties) {
    if (!await remote.artifactUpdateProperties(P, artifact, properties)) {
        const fullArtifact = await P.artifacts.load(artifact.id);
        for (let key in properties) {
            if (properties[key] != undefined) {
                fullArtifact[key] = properties[key];
            }
        }
        await P.artifacts.save(fullArtifact);
    }
}

