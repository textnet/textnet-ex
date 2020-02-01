
import { Artifact } from "../../interfaces"
import { Persistence } from "../persist"
import * as mutateEnter from "./enter"
import { mundaneWorldName } from "../../const"

export async function teleport(P: Persistence,
                               artifact: Artifact, 
                               target: Artifact ) {
    let artifactWorld, targetWorld;
    if (artifact.hostId) {
        artifactWorld = await P.worlds.load(artifact.hostId);
    }
    const targetInnerWorld = await P.worlds.load(target.worldIds[mundaneWorldName]);
    if (artifactWorld && targetInnerWorld.id == artifactWorld.id) {
        return true;
    }
    await mutateEnter.enterWorld(P, artifact, targetInnerWorld);
    return true;
}

