
import { spawnPosition } from "../../universe/const"
import { deepCopy } from "../../universe/utils"
import { Account, Artifact, World } from "../../universe/interfaces"
import { WorldStructure, ArtifactStructure, AccountStructure } from "../../render/data_structures"

import { Persistence } from "../persist"

export async function enterWorld(P: Persistence) {

    const worldId = P.account.body.visitsStack[ P.account.body.visitsStack.length-1 ];
    const world: World = await P.worlds.load(worldId)

    const artifacts = [];
    for (let i in world.artifacts) {
        const artifact = world.artifacts[i];
        artifacts.push(structureFromArtifact(artifact));
    }

    // TODO: proper installation of an avatar
    P.account.body.coords = { world: world, position: spawnPosition };
    if (P.account.body.visits[worldId]) {
        P.account.body.coords.position = P.account.body.visits[worldId].position;
    }
    const playerData = structureFromArtifact(P.account.body);
    playerData.isPlayer = true;
    artifacts.push(playerData);

    const result = {
        account: structureFromAccount(P.account), 
        world: structureFromWorld(world), 
        artifacts: artifacts,
    }
    return result;
}

function structureFromWorld(world: World) {
    const data: WorldStructure = {
        ownerId: world.owner.id,
        name: world.owner.name,
        text: world.text,
        colors: deepCopy(world.owner.colors)
    }
    return data;
}

function structureFromArtifact(artifact: Artifact) {
    const data: ArtifactStructure = {
        id: artifact.id,
        name: artifact.name,
        passable: artifact.passable,
        speed: artifact.speed,
        position: artifact.coords.position,
        sprite: deepCopy(artifact.sprite),
        body: deepCopy(artifact.body),
        isInventory: false,
        isLocal: true, // TODO
        isPlayer: false, 
    }
    return data
}

function structureFromAccount(account: Account) {
    const data: AccountStructure = {
        id: account.id,
        artefactId: account.body.id,
        isLocal: true, // TODO
    }
}


