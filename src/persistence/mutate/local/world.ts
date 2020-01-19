
import { Persistence }                    from "../../persist"
import { spawnPosition }                  from "../../../const"
import { Position, Artifact, World, Dir } from "../../../interfaces"
import { deepCopy }                       from "../../../utils"

import * as remote from "../remote/world"


export async function worldRemoveFromWorld(P: Persistence, artifact: Artifact, world: World) {
    if (!await remote.worldRemoveFromWorld(P, artifact, world)) {
        delete world.artifactPositions[ artifact.id ];    
        await P.worlds.save(world);
    }
}

export async function worldInsertIntoWorld(P: Persistence, artifact: Artifact, 
                                           world: World, pos: Position) {
    if (!await remote.worldInsertIntoWorld(P, artifact, world, pos)) {
        world.artifactPositions[ artifact.id ] = deepCopy(pos)
        await P.worlds.save(world);
    }
}

export async function worldUpdateInWorld(P: Persistence, artifact: Artifact, 
                                      world: World, pos: Position) {
    if (!await remote.worldUpdateInWorld(P, artifact, world, pos)) {
        world.artifactPositions[ artifact.id ] = deepCopy(pos)
        await P.worlds.save(world);
    }
}

export async function worldUpdateText(P: Persistence, world: World, text:string ) {
    if (!await remote.worldUpdateText(P, world, text)) {
        world.text = text;
        await P.worlds.save(world);
    }
}

