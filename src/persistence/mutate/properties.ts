
import { Artifact } from "../../interfaces"
import { Persistence } from "../persist"

import { sendProperties } from "../interop/send"
import { artifactUpdateProperties } from "./local/artifact";
import { worldUpdateProperties } from "./local/world";


export async function updateProperties(P: Persistence,
                      artifact: Artifact, properties) {
    const hostWorld = await P.worlds.load(artifact.hostId);
    await artifactUpdateProperties(P, artifact, properties)
    await worldUpdateProperties(P, hostWorld, artifact.id)
}

