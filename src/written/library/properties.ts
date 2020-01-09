
import { Artifact, World } from "../../universe/interfaces"
import { PersistenceObserver } from "../../persistence/observe/observer"
import { FengariMap } from "../api"

import { updateProperties } from "../../persistence/mutate/properties"


export function update( O: PersistenceObserver, params: FengariMap) {
    let artifact = params.get("artifact") as Artifact;
    if (!artifact) {
        artifact = O.writtenP.artifacts.load(O.ownerId);
    }
    const properties = {}
    for (let key of artifact.API) {
        properties[key] = params.get(key)
    }
    updateProperties(O.P, artifact, properties); // nb: async
    return true;
}
