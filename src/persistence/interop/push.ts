
import { Persistence } from "../persist"
import { PushEvent, StartMovingEvent, StopMovingEvent } from "../../render/interop/events"
import { Artifact, Position, Dir } from "../../interfaces"
import { DIR, DIRfrom } from "../../const"

import { getArtifact_NextTo, artifactPos } from "../mutate/spatial";
import * as mutatePlace from "../mutate/place"
import * as mutateDynamics from "../mutate/dynamics"

export async function pushFromArtifact(P: Persistence, event: PushEvent) {
    const artifactId  = event["artifactId"];
    const direction   = DIRfrom(event["direction"] as Dir);
    const artifact   = await P.artifacts.load(artifactId);
    if (!artifact.hostId) return false;
    const hostWorld = await P.worlds.load(artifact.hostId);

    let success = false;
    const candidate = await getArtifact_NextTo(P, artifact, direction) as Artifact;
    if (candidate && candidate.pushable) {
        console.log(`<${candidate.name}> is pushable? ${candidate.pushable}`)
        const newPos = await artifactPos(P, candidate);
        const pushStrength = artifact.power / candidate.weight * 2;
        newPos.x += direction.x * pushStrength;
        newPos.y += direction.y * pushStrength;
        success = await mutatePlace.place(P, candidate, hostWorld, newPos);
        if (success) {
            await mutateDynamics.push(P, artifact, candidate);
        }
    }
    return success
}


export async function startMoving(P: Persistence, event: StartMovingEvent) {
    const artifactId  = event["artifactId"];
    const artifact   = await P.artifacts.load(artifactId);
    await mutateDynamics.startMoving(P, artifact, artifact);
    return true
}

export async function stopMoving(P: Persistence, event: StopMovingEvent) {
    const artifactId  = event["artifactId"];
    const artifact   = await P.artifacts.load(artifactId);
    await mutateDynamics.stopMoving(P, artifact, artifact);
    return true
}