
import { Persistence } from "../persistence/persist"
import * as RemoteEvent from "../persistence/mutate/remote/event_structures"

import * as interopSend from "../persistence/interop/send"

export function echo(P: Persistence, eventName: string, data: RemoteEvent.RemoteEvent) {
    if (!_echo_[eventName]) {
        console.log(`ECHO: not found "${eventName}"`, data)
    }
    _echo_[eventName](P, data)
}

const _echo_ = {
    enter: async function(P: Persistence, data: RemoteEvent.WorldInsert) {
            const artifact = await P.artifacts.load(data.artifactId);
            await interopSend.sendInsertArtifact(P, artifact, data.pos);
    },
    leave: async function(P: Persistence, data: RemoteEvent.WorldRemove) {
        const artifact = await P.artifacts.load(data.artifactId);
        const world = await P.worlds.load(data.worldId)
        await interopSend.sendRemoveArtifact(P, artifact, world);
    },
    move: async function(P: Persistence, data: RemoteEvent.WorldUpdate) {
        const artifact = await P.artifacts.load(data.artifactId);
        await interopSend.sendPlaceArtifact(P, artifact, data.pos)
    },
    pickup: async function(P: Persistence, data: RemoteEvent.WorldPickup) {
        const artifact = await P.artifacts.load(data.artifactId);
        const obj      = await P.artifacts.load(data.objId);
        await interopSend.sendInventory(P, artifact, obj);
    },
    putdown: async function(P: Persistence, data: RemoteEvent.WorldPutdown) {
        const artifact = await P.artifacts.load(data.artifactId);
        if (artifact.inventoryIds.length > 0) {
            const newObjId = artifact.inventoryIds[artifact.inventoryIds.length-1]
            const newObj = await P.artifacts.load(newObjId);
            await interopSend.sendInventory(P, artifact, newObj);
        } else {
            await interopSend.sendEmptyInventory(P, artifact);
        }
    },
    properties: async function(P: Persistence, data: RemoteEvent.WorldProperties) {
        const artifact = await P.artifacts.load(data.artifactId);
        await interopSend.sendProperties(P, artifact);
    },
    text: async function(P: Persistence, data: RemoteEvent.WorldUpdateText) {
        const world = await P.worlds.load(data.worldId);
        await interopSend.sendText(P, world)
    },
}