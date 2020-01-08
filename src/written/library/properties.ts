
import { PersistenceObserver } from "../../persistence/observe/observer"
import { FengariMap } from "../api"

import { updateProperties } from "../../persistence/mutate/properties"


export async function update( O: PersistenceObserver, properties) {
    let artifactId;
    if (properties["artifact"]) {
        artifactId = properties["artifact"]["id"];
    } else {
        artifactId = O.ownerId;
    }
    const artifact = await O.P.artifacts.load(artifactId);
    await updateProperties(O.P, artifact, properties);
    return true;
}
