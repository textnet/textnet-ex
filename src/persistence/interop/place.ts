
import { Persistence } from "../persist"
import { Position } from "../../interfaces"

import { PositionEvent } from "../../render/interop/events"

import * as mutatePlace from "../mutate/place"

export async function placeArtifact(P: Persistence, args: PositionEvent) {
    const artifactId = args["artifactId"];
    let   worldId    = args.worldId;
    const position   = args["position"];
    const artifact   = await P.artifacts.load(artifactId);

    console.log(`interop place to "${args.worldId}"`)

    if (!artifact.hostId) return false;
    // const hostWorld = await P.worlds.load(artifact.hostId);
    const hostWorld = await P.worlds.load(worldId);

    const oldPos = hostWorld.artifactPositions[ artifact.id ];

    if (oldPos && position.x == oldPos.x && position.y == oldPos.y) return false;  

    console.log(`^^^^^^^^^^^^^^^^ "${args.worldId}"`)
    const success = await mutatePlace.place(P, artifact, hostWorld, position);

}
