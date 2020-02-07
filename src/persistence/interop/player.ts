
import { mundaneWorldName, spawnPosition } from "../../const"
import { deepCopy } from "../../utils"
import { Account, Artifact, World } from "../../interfaces"
import { WorldStructure, ArtifactStructure, AccountStructure } from "../../render/data_structures"

import { Persistence } from "../persist"

import { InventoryEvent, WorldEvent } from "../../render/interop/events"

import { structureFromAccount, structureFromArtifact, structureFromWorld } from "./structures"

import * as mutateEnter from "../mutate/enter"
import * as sendInterop from "./send"

export async function playerPrepareWorld(P: Persistence) {
    const accountBody = await P.artifacts.load(P.account.bodyId);
    const worldId = accountBody.visitsStack[ accountBody.visitsStack.length-1 ];
    let world: World = await P.worlds.load(worldId)

    // get artifact data
    const inventoryEvents = [];
    const artifacts = {};
    for (let id in world.artifactPositions) {
        const artifact = await P.artifacts.load(id);
        artifacts[id] = await structureFromArtifact(P, artifact, world);
        if (artifact.inventoryIds.length > 0) {
            const inventoryId = artifact.inventoryIds[ artifact.inventoryIds.length-1 ];
            const inventoryArtifact  = await P.artifacts.load(inventoryId);
            const inventoryStructure = await structureFromArtifact(P, inventoryArtifact, world);
            const inventoryEvent: InventoryEvent = {
                artifactId: artifact.id,
                inventoryStructure: inventoryStructure
            }
            inventoryEvents.push(inventoryEvent)
        }
    }
    const result: WorldEvent = {
        account: await structureFromAccount(P, P.account), 
        world: await structureFromWorld(P,world), 
        artifacts: artifacts,
        inventoryEvents: inventoryEvents,
    }
    sendInterop.sendWorld(P, result)
    return result;
}

export async function playerEnterWorld(P: Persistence) {
    const accountBody = await P.artifacts.load(P.account.bodyId);
    const worldId = accountBody.visitsStack[ accountBody.visitsStack.length-1 ];
    let world: World = await P.worlds.load(worldId);
    if (accountBody.hostId != world.id) {
        // console.log(`Player ${accountBody.id} enters world: ${accountBody.hostId} => ${world.id}`)
        await mutateEnter.enterWorld(P, accountBody, world)
    } else {
        // console.log(`Player ${accountBody.id} is there already!`) // I think the issue is here!
        const pos = world.artifactPositions[accountBody.id];
        sendInterop.sendPlaceArtifact(P, accountBody, world, pos);
    }
}
