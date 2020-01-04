import { Persistence } from "../persist"

import { Position, Artifact, World } from "../../universe/interfaces"
import { deepCopy } from "../../universe/utils"

export async function updateText(P: Persistence, world: World, text:string ) {
    if (world.text != text) {
        world.text = text;
        await P.worlds.save(world);
    }
}

