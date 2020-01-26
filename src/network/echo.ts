
import { Persistence } from "../persistence/persist"
import { listenEcho } from "../persistence/observe/listen"
import * as RemoteEvent from "../persistence/mutate/remote/event_structures"

import * as interopSend from "../persistence/interop/send"

export function echo(P: Persistence, eventName: string, data: RemoteEvent.RemoteEvent) {
    if (!_echo_[eventName]) {
        console.log(`ECHO: not found "${eventName}"`, data)
    }
    _echo_[eventName](P, data).then(function(targetIds){
        listenEcho(P, eventName, data, targetIds);
    })
    
}

let _echo_move_latency = 500;
let _echo_timeout;
const _echo_ = {
    enter: async function(P: Persistence, data: RemoteEvent.WorldInsert) {
            const artifact = await P.artifacts.load(data.artifactId);
            await interopSend.sendInsertArtifact(P, artifact, data.pos);
            const targetIds = {
                world: (await P.worlds.load(data.worldId)).ownerId,
                object: data.artifactId
            }
            return targetIds;
    },
    leave: async function(P: Persistence, data: RemoteEvent.WorldRemove) {
            const artifact = await P.artifacts.load(data.artifactId);
            const world = await P.worlds.load(data.worldId)
            await interopSend.sendRemoveArtifact(P, artifact, world);
            const targetIds = {
                world: (await P.worlds.load(data.worldId)).ownerId,
                object: data.artifactId
            }
            return targetIds;
    },
    move: async function(P: Persistence, data: RemoteEvent.WorldUpdate) {
            async function _() {
                const artifact = await P.artifacts.load(data.artifactId);
                await interopSend.sendPlaceArtifact(P, artifact, data.pos)
            }
            if (data.artifactId == P.account.bodyId) {
                clearTimeout(_echo_timeout);
                _echo_timeout = setTimeout(_, _echo_move_latency);
            } else {
                _();
            }
            const targetIds = {
                world: (await P.worlds.load(data.worldId)).ownerId,
                object: data.artifactId
            }
            return targetIds;
    },
    move_start: async function(P: Persistence, data: RemoteEvent.WorldStartMoving) {
        const artifact = await P.artifacts.load(data.artifactId);
        await interopSend.sendStartMovingArtifact(P, artifact);
        const targetIds = {
            world: (await P.worlds.load(data.worldId)).ownerId,
            subject: data.artifactId,
        }
        return targetIds;
    },
    move_stop: async function(P: Persistence, data: RemoteEvent.WorldStopMoving) {
        const artifact = await P.artifacts.load(data.artifactId);
        await interopSend.sendStopMovingArtifact(P, artifact);
        const targetIds = {
            world: (await P.worlds.load(data.worldId)).ownerId,
            subject: data.artifactId,
        }
        return targetIds;
    },
    push: async function(P: Persistence, data: RemoteEvent.WorldPush) {
        const targetIds = {
            world: (await P.worlds.load(data.worldId)).ownerId,
            object: data.objId,
            subject: data.artifactId,
        }
        return targetIds;
    },
    pickup: async function(P: Persistence, data: RemoteEvent.WorldPickup) {
        const artifact = await P.artifacts.load(data.artifactId);
        const obj      = await P.artifacts.load(data.objId);
        await interopSend.sendInventory(P, artifact, obj);
        const targetIds = {
            world: (await P.worlds.load(data.worldId)).ownerId,
            object: data.objId,
            subject: data.artifactId,
        }
        return targetIds;
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
        const targetIds = {
            world: (await P.worlds.load(data.worldId)).ownerId,
            object: data.objId,
            subject: data.artifactId,
        }
        return targetIds;
    },
    properties: async function(P: Persistence, data: RemoteEvent.WorldProperties) {
        const artifact = await P.artifacts.load(data.artifactId);
        await interopSend.sendProperties(P, artifact);
        const targetIds = {
            world: (await P.worlds.load(data.worldId)).ownerId,
            object: data.artifactId,
        }
        return targetIds;
    },
    text: async function(P: Persistence, data: RemoteEvent.WorldUpdateText) {
        const world = await P.worlds.load(data.worldId);
        await interopSend.sendText(P, world)
        const targetIds = {
            world: world.ownerId,
            object: world.ownerId,
        }
        return targetIds;
    },
}