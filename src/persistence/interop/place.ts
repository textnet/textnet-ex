
import { Persistence } from "../persist"
import { Position } from "../../universe/interfaces"

import { PositionEvent } from "../../render/interop/events"

import * as mutatePlace from "../mutate/place"

export async function placeArtifact(P: Persistence, args: PositionEvent) {
    const artifactId = args["artifactId"];
    const position   = args["position"];
    const artifact   = await P.artifacts.load(artifactId);
    if (!artifact.hostId) return false;
    const hostWorld = await P.worlds.load(artifact.hostId);

    const oldPos = hostWorld.artifactPositions[ artifact.id ];
    if (oldPos && position.x == oldPos.x && position.y == oldPos.y) return false;
    
    const success = await mutatePlace.place(P, artifact, hostWorld, position);

}
