import { Persistence } from "../persist"
import { PickupEvent } from "../../render/interop/events"
import { Artifact, Position, Dir } from "../../interfaces"
import { DIR, DIRfrom } from "../../const"

import { getArtifact_NextTo, artifactPos } from "../mutate/spatial";
import * as mutatePlace  from "../mutate/place"
import * as mutateInventory from "../mutate/inventory"

export async function pickupFromArtifact(P: Persistence, event: PickupEvent) {
    const artifactId  = event["artifactId"];
    const direction   = DIRfrom(event["direction"] as Dir);
    const artifact   = await P.artifacts.load(artifactId);
    if (!artifact.hostId) return false;
    const hostWorld = await P.worlds.load(artifact.hostId);

    // aiming to pick up
    const candidate = await getArtifact_NextTo(P, artifact, direction) as Artifact;
    // TODO ERROR THE CHECK SHOULD BE DONE IN MUTATE!
    if (candidate && candidate.pickable) {
        const success = await mutateInventory.pickup(P, artifact, candidate);
    }
    if (!candidate && artifact.inventoryIds.length > 0) {
        const success = await mutateInventory.putdown(P, artifact, direction);
    }
}
