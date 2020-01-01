
import { mundaneWorldName, spawnPosition } from "../../universe/const"
import { deepCopy } from "../../universe/utils"
import { Account, Artifact, World } from "../../universe/interfaces"
import { WorldStructure, ArtifactStructure, AccountStructure } from "../../render/data_structures"

import { Persistence } from "../persist"

import { structureFromAccount, structureFromArtifact, structureFromWorld } from "./structures"

import * as mutateEnter from "../mutate/enter"

export async function playerPrepareWorld(P: Persistence) {
    const accountBody = await P.artifacts.load(P.account.bodyId);
    const worldId = accountBody.visitsStack[ accountBody.visitsStack.length-1 ];
    let world: World = await P.worlds.load(worldId)

    // get artifact data
    const artifacts = {};
    for (let id in world.artifactPositions) {
        const artifact = await P.artifacts.load(id);
        artifacts[id] = await structureFromArtifact(P, artifact, world);
    }

    const result = {
        account: await structureFromAccount(P, P.account), 
        world: await structureFromWorld(P,world), 
        artifacts: artifacts,
    }
    return result;
}

export async function playerEnterWorld(P: Persistence) {
    const accountBody = await P.artifacts.load(P.account.bodyId);
    const worldId = accountBody.visitsStack[ accountBody.visitsStack.length-1 ];
    let world: World = await P.worlds.load(worldId);
    mutateEnter.enterWorld(P, accountBody, world)
}
