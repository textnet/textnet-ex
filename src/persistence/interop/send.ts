// proactive sending events

import { ipcMain } from "electron";

import { deepCopy } from "../../universe/utils"
import { Persistence } from "../persist"

import { structureFromAccount, structureFromArtifact, structureFromWorld } from "./structures"

import { PositionEvent, EnterEvent, LeaveEvent, InventoryEvent } from "../../render/interop/events"
import { ArtifactStructure } from "../../render/data_structures"

import { Artifact, World, Position } from "../../universe/interfaces"


export async function sendPlaceArtifact(P: Persistence, artifact: Artifact, position: Position) {
    console.log(`INTEROP: position(placeArtifact)`, artifact.name, position)
    const event: PositionEvent = {
        artifactId: artifact.id,
        worldId:    artifact.hostId,
        position:   deepCopy(position)
    }
    if (P.window) P.window.webContents.send('position', event);
}

export async function sendInsertArtifact(P: Persistence, artifact: Artifact, position: Position) {
    console.log(`INTEROP: position(insertArtifact)`, artifact.name, position)
    const structure = await structureFromArtifact(P, artifact);
    const event: EnterEvent = {
        artifactStructure: structure,
        position:   deepCopy(position)
    }
    if (P.window) P.window.webContents.send('enter', event);
}

export async function sendRemoveArtifact(P: Persistence, artifact: Artifact) {
    console.log(`INTEROP: leave`, artifact.name)
    const event: LeaveEvent = {
        artifactId: artifact.id
    }
    if (P.window) P.window.webContents.send('leave', event);
}

export async function sendInventory(P: Persistence, artifact: Artifact, obj: Artifact) {
    console.log(`INTEROP: inventory`, artifact.name, "=>", obj.name)
    const hostWorld = await P.worlds.load(artifact.hostId);
    const structure = await structureFromArtifact(P, obj, hostWorld);
    const event: InventoryEvent = {
        artifactId: artifact.id,
        inventoryStructure: structure,
    }
    if (P.window) P.window.webContents.send('inventory', event);
}

export async function sendTopInventory(P: Persistence, artifact: Artifact) {
    if (artifact.inventoryIds.length > 0) {
        const objId = artifact.inventoryIds[ artifact.inventoryIds.length-1 ];
        const obj = await P.artifacts.load(objId);
        return await sendInventory(P, artifact, obj)
    }
}

export async function sendEmptyInventory(P: Persistence, artifact: Artifact) {
    console.log(`INTEROP: inventory(empty)`, artifact.name);
    const event: InventoryEvent = {
        artifactId: artifact.id
    }
    if (P.window) P.window.webContents.send('inventory', event);
}