
import { Persistence } from "../persist"
import { fit, removeFromWorld } from "./place"
import { sendTopInventory } from "../interop/send";

import { spawnPosition } from "../../universe/const"
import { Position, Artifact, World } from "../../universe/interfaces"
import { deepCopy } from "../../universe/utils"

export async function enterWorld(P: Persistence, artifact: Artifact, world: World) {
    console.log(`Enter world: ${artifact.name} -> ${world.id} (from ${artifact.hostId})`);
    // adjust artifact
    if (!artifact.visits[ world.id ]) {
        artifact.visits[ world.id ] = deepCopy(spawnPosition);
    } 
    if (artifact.hostId && (artifact.hostId != world.id)) {
        artifact.visitsStack.push( world.id );
    }
    await P.artifacts.save(artifact);
    // fit to the closest available place (always possible)
    // event will be sent by rendering the world;

    // console.log("Visits Enter:", artifact.visits, artifact.visitsStack)
    await fit(P, artifact, world, artifact.visits[ world.id ])
    // await sendTopInventory(P, artifact);
}

export async function disconnect(P: Persistence, artifact: Artifact, world: World) {
    return leaveWorld(P, artifact, world, true)
}

export async function leaveWorld(P: Persistence, artifact: Artifact, world: World, 
                                 disconnect?: boolean) {
    console.log(`Leave world: ${artifact.name} -> ${world.id} (from ${artifact.hostId})`, goUp);
    if (disconnect 
        || (artifact.visitsStack.length > 1 
           && world.id == artifact.visitsStack[artifact.visitsStack.length-1])) {
        // adjust artifact
        if (!disconnect) {
            artifact.visitsStack.pop();
        }
        const position = world.artifactPositions[artifact.id];
        artifact.visits[world.id] = deepCopy(position);
        // console.log("Visits Leave:", artifact.visits, artifact.visitsStack)
        await P.artifacts.save(artifact);
        // adjust world
        await removeFromWorld(P, artifact, world);
    }
}