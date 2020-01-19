
import { deepCopy } from "../../utils"
import { Account, Artifact, World } from "../../interfaces"
import { WorldStructure, ArtifactStructure, AccountStructure } from "../../render/data_structures"

import { Persistence } from "../persist"



export async function structureFromWorld(P: Persistence, world: World) {
    const owner = await P.artifacts.load(world.ownerId);
    const data: WorldStructure = {
        id: world.id,
        ownerId: owner.id,
        name: owner.name + " " + P.account.id, // TEMP TODO
        text: world.text,
        format: owner.format,
        colors: deepCopy(owner.colors)
    }
    return data;
}

export async function structureFromArtifact(P: Persistence, artifact: Artifact, host?: World) {
    if (!host) host = await P.worlds.load(artifact.hostId);
    let data: ArtifactStructure = {
        id: artifact.id,
        name: artifact.name,
        passable: artifact.passable,
        speed: artifact.speed,
        sprite: deepCopy(artifact.sprite),
        body: deepCopy(artifact.body),
        isInventory: false,
        isLocal: true, // TODO
        isPlayer: P.account.bodyId == artifact.id, 
    }
    if (host) {
        data["position"] =host.artifactPositions[artifact.id];
    }    
    return data
}

export async function structureFromAccount(P: Persistence, account: Account) {
    const data: AccountStructure = {
        id: account.id,
        artefactId: account.bodyId,
        isLocal: true, // TODO
    }
    return data;
}