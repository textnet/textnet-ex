// proactive sending events

import { ipcMain } from "electron";

import { deepCopy } from "../../universe/utils"
import { Persistence } from "../persist"

import { structureFromAccount, structureFromArtifact, structureFromWorld } from "./structures"

import { PositionEvent, EnterEvent } from "../../render/interop/events"
import { ArtifactStructure } from "../../render/data_structures"

import { Artifact, World, Position } from "../../universe/interfaces"


export async function sendPlaceArtifact(P: Persistence, artifact: Artifact, position: Position) {
    // check if the world is ok.
    console.log(`INTEROP: position(placeArtifact)`, artifact.name, position)
    const event: PositionEvent = {
        artifactId: artifact.id,
        worldId:    artifact.hostId,
        position:   deepCopy(position)
    }
    P.window.webContents.send('position', event);
}

export async function sendInsertArtifact(P: Persistence, artifact: Artifact, position: Position) {
    // check if the world is ok.
    console.log(`INTEROP: position(insertArtifact)`, artifact.name, position)
    const structure = await structureFromArtifact(P, artifact);
    const event: EnterEvent = {
        artifactStructure: structure,
        position:   deepCopy(position)
    }
    P.window.webContents.send('enter', event);
}

