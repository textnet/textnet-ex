import { Persistence } from "../persist"
import { Position, Artifact, World } from "../../interfaces"

import * as interopSend from "../interop/send"
import { worldUpdateText } from "./local/world";

export async function updateText(P: Persistence, world: World, text:string,
                                 skipAttempt?: boolean ) {
    await worldUpdateText(P, world, text, skipAttempt);
}

