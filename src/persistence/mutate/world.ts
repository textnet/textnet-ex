import { Persistence } from "../persist"

import { Position, Artifact, World } from "../../universe/interfaces"
import { deepCopy } from "../../universe/utils"

import * as interopSend from "../interop/send"

export async function updateText(P: Persistence, world: World, text:string ) {
    console.log( "update text")
    if (world.text != text) {
        world.text = text;
        await P.worlds.save(world);
        await interopSend.sendText(P, world);
    }
}

