// proactive sending events

import { ipcMain } from "electron";

import { deepCopy } from "../../utils"
import { Persistence } from "../persist"

import { structureFromAccount, structureFromArtifact, structureFromWorld } from "./structures"

import { PositionEvent, EnterEvent, LeaveEvent, WorldEvent,
         StartMovingEvent, StopMovingEvent,
         ArtifactPropertiesEvent, WorldPropertiesEvent,
         InventoryEvent, TextEvent } from "../../render/interop/events"
import { ArtifactStructure } from "../../render/data_structures"

import { Artifact, World, Position } from "../../interfaces"


export async function sendProperties(P: Persistence, artifact: Artifact) {
    // console.log(`INTEROP: properties`);
    const structure = await structureFromArtifact(P, artifact);
    const worldEvents = [];
    for (let i in artifact.worldIds) {
        const world = await P.worlds.load(artifact.worldIds[i]);
        worldEvents.push({
            worldStructure: await structureFromWorld(P, world),
        } as WorldPropertiesEvent);
    }
    const eventArtifact: ArtifactPropertiesEvent = {
        artifactStructure: structure,
    }
    if (P.window) {
        P.window.webContents.send('properties',  eventArtifact);
        for (let event of worldEvents) {
            P.window.webContents.send('environment', event);
        }
    }
}

export async function sendPlaceArtifact(P: Persistence, artifact: Artifact, position: Position) {
    // console.log(`(${P.account.id})INTEROP: position(placeArtifact)`, artifact.name, position)
    const event: PositionEvent = {
        artifactId: artifact.id,
        worldId:    artifact.hostId,
        position:   deepCopy(position)
    }
    if (P.window) P.window.webContents.send('position', event);
}

export async function sendStartMovingArtifact(P: Persistence, artifact: Artifact) {
    // console.log(`INTEROP: subject(startMoving)`, artifact.name)
    const event: StartMovingEvent = {
        artifactId: artifact.id,
    }
    if (P.window) P.window.webContents.send('startMoving', event);
}

export async function sendStopMovingArtifact(P: Persistence, artifact: Artifact) {
    // console.log(`INTEROP: subject(stopMoving)`, artifact.name)
    const event: StopMovingEvent = {
        artifactId: artifact.id,
    }
    if (P.window) P.window.webContents.send('stopMoving', event);
}


export async function sendInsertArtifact(P: Persistence, artifact: Artifact, position: Position) {
    const world = await P.worlds.load(artifact.hostId);
    const worldOwner = await P.artifacts.load(world.ownerId);
    // console.log(`INTEROP: position(insertArtifact)`, artifact.name, "to", worldOwner.name, "at", position)
    const structure = await structureFromArtifact(P, artifact);
    const event: EnterEvent = {
        artifactStructure: structure,
        worldId: artifact.hostId,
        position:   deepCopy(position)
    }
    if (artifact.inventoryIds.length > 0) {
        const inventoryId = artifact.inventoryIds[ artifact.inventoryIds.length-1 ];
        const inventoryArtifact  = await P.artifacts.load(inventoryId);
        const inventoryStructure = await structureFromArtifact(P, inventoryArtifact, world);
        event.inventoryStructure = inventoryStructure;
    }        
    if (P.window) P.window.webContents.send('enter', event);
}

export async function sendRemoveArtifact(P: Persistence, artifact: Artifact, world: World) {
    // console.log(`INTEROP: leave`, artifact.name)
    const event: LeaveEvent = {
        worldId: world.id,
        artifactId: artifact.id
    }
    if (P.window) P.window.webContents.send('leave', event);
}

export async function sendInventory(P: Persistence, artifact: Artifact, obj: Artifact) {
    // console.log(`INTEROP: inventory`, artifact.name, "=>", obj.name)
    const hostWorld = await P.worlds.load(artifact.hostId);
    const structure = await structureFromArtifact(P, obj, hostWorld);
    const event: InventoryEvent = {
        artifactId: artifact.id,
        inventoryStructure: structure,
    }
    if (P.window) P.window.webContents.send('inventory', event);
}

export async function sendEmptyInventory(P: Persistence, artifact: Artifact) {
    // console.log(`INTEROP: inventory(empty)`, artifact.name);
    const event: InventoryEvent = {
        artifactId: artifact.id
    }
    if (P.window) P.window.webContents.send('inventory', event);
}

export async function sendText(P: Persistence, world: World) {
    // console.log(`INTEROP: text`);
    const event: TextEvent = {
        worldId: world.id,
        text: world.text
    }
    if (P.window) P.window.webContents.send('text', event);
}

export async function sendWorld(P: Persistence, data: WorldEvent) {
    // console.log(`INTEROP: world(${data.world.id}) -> ${P.account.id}`);
    if (P.window) P.window.webContents.send('world', data);
}
