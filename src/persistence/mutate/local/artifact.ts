
import { Persistence }                    from "../../persist"
import { spawnPosition }                  from "../../../const"
import { Position, Artifact, World, Dir } from "../../../interfaces"
import { deepCopy }                       from "../../../utils"

import * as remote from "../remote/artifact"


export async function artifactEnter(P: Persistence, artifact: Artifact, world: World) {
    if (!await remote.artifactEnter(P, artifact, world)) {
        if (!artifact.visits[ world.id ]) {
            artifact.visits[ world.id ] = deepCopy(spawnPosition);
        } 
        if (artifact.hostId && (artifact.hostId != world.id)) {
            artifact.visitsStack.push( world.id );
        }
        await P.artifacts.save(artifact);        
    }
}

export async function artifactLeave(P: Persistence, artifact: Artifact, world: World, 
                                    disconnect?: boolean) {
    if (!await remote.artifactLeave(P, artifact, world, disconnect)) {
        if (!disconnect) {
            artifact.visitsStack.pop();
        }
        const position = world.artifactPositions[artifact.id];
        artifact.visits[world.id] = deepCopy(position);
        await P.artifacts.save(artifact);
    }
}


export async function artifactPickup(P: Persistence, artifact: Artifact, obj: Artifact) {
    if (!await remote.artifactPickup(P, artifact, obj)) {
        artifact.inventoryIds.push(obj.id)
        await P.artifacts.save(artifact);
    }
}


export async function artifactPutdown(P: Persistence, artifact: Artifact) {
    if (!await remote.artifactPutdown(P, artifact)) {
        artifact.inventoryIds.pop();
        await P.artifacts.save(artifact);
    }
}


export async function artifactRemoveFromWorld(P: Persistence, artifact: Artifact, world: World) {
    if (!await remote.artifactRemoveFromWorld(P, artifact, world)) {
        artifact.visits[ world.id ] = deepCopy(world.artifactPositions[ artifact.id ])
        await P.artifacts.save(artifact);
    }
}


export async function artifactInsertIntoWorld(P: Persistence, artifact: Artifact, 
                                      world: World, pos: Position) {
    if (!await remote.artifactInsertIntoWorld(P, artifact, world, pos)) {
        artifact.hostId = world.id;
        artifact.visits[ world.id ] = deepCopy(pos)
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

