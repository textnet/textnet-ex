
import { Artifact } from "../../interfaces"
import { Persistence } from "../persist"

import { sendProperties } from "../interop/send"
import { artifactUpdateProperties } from "./local/artifact";


export async function updateProperties(P: Persistence,
                      artifact: Artifact, properties) {
    await artifactUpdateProperties(P, artifact, properties)
    await sendProperties(P, artifact);
}

