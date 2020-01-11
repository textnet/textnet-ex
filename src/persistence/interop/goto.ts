import { Persistence } from "../persist"
import { GotoEvent, LeaveEvent } from "../../render/interop/events"
import { Artifact, Position, Dir } from "../../interfaces"
import { DIR, DIRfrom, mundaneWorldName } from "../../const"

import { getArtifact_NextTo, artifactPos } from "../mutate/spatial";
import * as mutateEnter  from "../mutate/enter"

export async function gotoOfArtifact(P: Persistence, event: GotoEvent) {
    const artifactId  = event["artifactId"];
    const direction   = DIRfrom(event["direction"] as Dir);
    const artifact   = await P.artifacts.load(artifactId);
    if (!artifact.hostId) return false;
    const hostWorld = await P.worlds.load(artifact.hostId);
    let worldName = event["worldName"] || mundaneWorldName;

    // going into artifact's world
    const candidate = await getArtifact_NextTo(P, artifact, direction) as Artifact;
    if (candidate && !candidate.locked ) {
        if (!candidate.worldIds[worldName]) worldName = mundaneWorldName;
        // console.log("loading candidate ",candidate.name," world", worldName, candidate.worldIds[worldName])
        const targetWorld = await P.worlds.load(candidate.worldIds[worldName]);
        // console.log("leaving old while entering new")
        await mutateEnter.enterWorld(P, artifact, targetWorld);
    }
}

export async function leaveOfArtifact(P: Persistence, event: LeaveEvent) {
    const artifactId  = event["artifactId"];
    const artifact   = await P.artifacts.load(artifactId);
    if (!artifact.hostId) return false;
    const hostWorld = await P.worlds.load(artifact.hostId);

    // going up stack
    await mutateEnter.leaveWorld(P, artifact, hostWorld)
}
