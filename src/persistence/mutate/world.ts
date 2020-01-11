import { Persistence } from "../persist"

import { Position, Artifact, World } from "../../interfaces"
import { deepCopy } from "../../utils"

import * as interopSend from "../interop/send"

export async function updateText(P: Persistence, world: World, text:string ) {
    if (world.text != text) {
        world.text = text;
        await P.worlds.save(world);
        await interopSend.sendText(P, world);
    }
}

