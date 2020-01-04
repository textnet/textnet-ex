
import { Persistence } from "../persist"
import { StandEvent } from "../../render/interop/events"
import { Artifact, Position, Dir } from "../../universe/interfaces"
import { DIR, DIRfrom } from "../../universe/const"

import * as mutatePlace from "../mutate/place"
import * as mutateWorld from "../mutate/world"

export async function standArtifact(P: Persistence, event: StandEvent) {
    const artifactId = event["artifactId"];
    const position   = event["position"];
    const text       = event["text"];
    const worldId    = event["worldId"];
    const artifact   = await P.artifacts.load(artifactId);
    const world      = await P.worlds.load(artifact.hostId);

    // 1. update world
    if (world.text != text) {
        await mutateWorld.updateText(P, world, text);
    }
    // 2. fit artifact
    if (position) {
        await mutatePlace.fit(P, artifact, world, position);
    }
}