
import { Persistence } from "../persist"
import { PushEvent } from "../../render/interop/events"
import { Artifact, Position, Dir } from "../../universe/interfaces"
import { DIR, DIRfrom } from "../../universe/const"

import { getArtifact_NextTo, artifactPos } from "../mutate/spatial";
import * as mutatePlace from "../mutate/place"

export async function pushFromArtifact(P: Persistence, event: PushEvent) {
    const artifactId  = event["artifactId"];
    const direction   = event["direction"] as Dir;
    const artifact   = await P.artifacts.load(artifactId);
    if (!artifact.hostId) return false;
    const hostWorld = await P.worlds.load(artifact.hostId);

    const candidate = await getArtifact_NextTo(P, artifact, direction) as Artifact;
    if (candidate && candidate.pushable ) {
        const straightDir = DIRfrom(direction);
        const newPos = await artifactPos(P, candidate);
        const pushStrength = artifact.power / candidate.weight * 2;
        newPos.x += straightDir.x * pushStrength;
        newPos.y += straightDir.y * pushStrength;
        const success = await mutatePlace.place(P, candidate, hostWorld, newPos);
    }
}