
import { Persistence } from "../persist"
import { Position } from "../../universe/interfaces"

import { PositionEvent } from "../../render/interop/events"

import * as mutatePlace from "../mutate/place"

export async function placeArtifact(P: Persistence, args: PositionEvent) {
    const artifactId = args["artifactId"];
    const position   = args["position"];
    const artifact   = await P.artifacts.load(artifactId);

    if (artifact.coords
        && artifact.coords.position.x == position.x
        && artifact.coords.position.y == position.y
        && artifact.coords.position.dir == position.dir
        ) return false;

    await mutatePlace.place(P, artifact, artifact.coords.world, position);

    const result: PositionEvent = {
        artifactId: artifactId,
        position: artifact.coords.position
    }
    return result;
}
