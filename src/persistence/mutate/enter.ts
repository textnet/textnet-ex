
import { Persistence } from "../persist"
import { fit, removeFromWorld } from "./place"

import { Artifact, World } from "../../interfaces"
import { deepCopy }        from "../../utils"

import { artifactEnter, artifactLeave } from "./local/artifact";

export async function enterWorld(P: Persistence, artifact: Artifact, world: World) {
    console.log(`Enter world: ${artifact.name} -> ${world.id} (from ${artifact.hostId})`);
    await artifactEnter(P, artifact, world.id)
    artifact = await P.artifacts.load(artifact.id);
    console.log(`visit coords:`, artifact.visits[ world.id ])
    await fit(P, artifact, world, artifact.visits[ world.id ])
}

export async function disconnect(P: Persistence, artifact: Artifact, world: World) {
    return await leaveWorld(P, artifact, world, true)
}

export async function leaveWorld(P: Persistence, artifact: Artifact, world: World, 
                                 disconnect?: boolean) {
    // console.log(`Leave world: ${artifact.name} -> ${world.id} (from ${artifact.hostId})`);
    if (disconnect) console.log("--- disconnect.")
    if (disconnect 
        || (artifact.visitsStack.length > 1 
           && world.id == artifact.visitsStack[artifact.visitsStack.length-1])) {
        await artifactLeave(P, artifact, world.id, 
                            world.artifactPositions[artifact.id],
                            disconnect);
        await removeFromWorld(P, artifact, world);
    }
}