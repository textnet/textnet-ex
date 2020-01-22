/**
 * Written Word: Properties of worlds and artifacts.
 * E.g. name, speed, background color.
 */

import { Artifact, World, defaultsArtifact }     from "../../interfaces"
import { PersistenceObserver } from "../../persistence/observe/observer"
import { FengariMap }          from "../api"
import { updateProperties }    from "../../persistence/mutate/properties"

/**
 * Updates an artifact or a world referenced.
 * Update is done asynchronously.
 * @param {PersistenceObserver} O
 * @optional @param {FengariMap} all parameters, namely:
 *    - artifact (default is self)
 *    - name, speed, power, etc. from API
 */
export function update( O: PersistenceObserver, params: FengariMap) {
    let artifact = params.get("artifact") as Artifact;
    if (!artifact) {
        artifact = O.writtenP.artifacts.load(O.ownerId);
    }
    const properties = {}
    for (let key of defaultsArtifact.API) {
        properties[key] = params.get(key)
    }
    updateProperties(O.P, artifact, properties); // nb: async
    return true;
}
