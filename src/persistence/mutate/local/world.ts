
import { Persistence }                    from "../../persist"
import { spawnPosition }                  from "../../../const"
import { Position, Artifact, World, Dir } from "../../../interfaces"
import { deepCopy }                       from "../../../utils"



export async function worldRemoveFromWorld(P: Persistence, artifact: Artifact, world: World) {
    delete world.artifactPositions[ artifact.id ];    
    await P.worlds.save(world);
}


export async function worldInsertIntoWorld(P: Persistence, artifact: Artifact, 
                                           world: World, pos: Position) {
    world.artifactPositions[ artifact.id ] = deepCopy(pos)
    await P.worlds.save(world);
}


export async function worldUpdateInWorld(P: Persistence, artifact: Artifact, 
                                      world: World, pos: Position) {
    world.artifactPositions[ artifact.id ] = deepCopy(pos)
    await P.worlds.save(world);
}


export async function worldUpdateText(P: Persistence, world: World, text:string ) {
    world.text = text;
    await P.worlds.save(world);
}

