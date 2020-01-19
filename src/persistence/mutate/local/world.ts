
import { Persistence }                    from "../../persist"
import { spawnPosition }                  from "../../../const"
import { Position, Artifact, World, Dir } from "../../../interfaces"
import { deepCopy }                       from "../../../utils"

import * as remote from "../remote/world"


export async function worldRemoveFromWorld(P: Persistence, world: World, 
                                           artifactId: string) {
    if (!await remote.worldRemoveFromWorld(P, world, artifactId)) {
        delete world.artifactPositions[ artifactId ];    
        await P.worlds.save(world);
    }
}

export async function worldInsertIntoWorld(P: Persistence, world: World, 
                                           artifactId: string, pos: Position) {
    if (!await remote.worldInsertIntoWorld(P, world, artifactId, pos)) {
        world.artifactPositions[ artifactId ] = deepCopy(pos)
        await P.worlds.save(world);
    }
}

export async function worldUpdateInWorld(P: Persistence, world: World, 
                                         artifactId: string, pos: Position) {
    if (!await remote.worldUpdateInWorld(P, world, artifactId, pos)) {
        world.artifactPositions[ artifactId ] = deepCopy(pos)
        await P.worlds.save(world);
    }
}

export async function worldUpdateText(P: Persistence, world: World, text:string ) {
    if (!await remote.worldUpdateText(P, world, text)) {
        world.text = text;
        await P.worlds.save(world);
    }
}

