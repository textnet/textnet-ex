
import { deepCopy } from "../../utils"
import { Artifact, World, Position, Dir } from "../../interfaces"
import { Persistence } from "../persist"

import { sendProperties } from "../interop/send"


export async function updateProperties(P: Persistence,
                      artifact: Artifact, properties) {
    for (let key in properties) {
        if (properties[key] != undefined) {
            artifact[key] = properties[key];
        }
    }
    await P.artifacts.save(artifact);
    await sendProperties(P, artifact);
}

