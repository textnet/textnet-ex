
import { Persistence } from "../persistence/persist"
import { RemotePersistence } from "../persistence/remote/persistence"

import { World, Artifact } from "../interfaces"


import * as messaging from "./messaging"
import * as RemoteEvent from "../persistence/mutate/remote/event_structures"

import * as localArtifact from "../persistence/mutate/local/artifact"
import * as localWorld    from "../persistence/mutate/local/world"

import { echo } from "./echo"

export async function sendMessage(sender:   Persistence,
                                  receiver: RemotePersistence,
                                  payload:  RemoteEvent.Payload) {
    return messaging.sendMessage(sender.account.id, receiver.id, payload);
}

export function register(P: Persistence) {
    const _messageListener = async function(senderId, payload) {
        return messageListener(P, senderId, payload);
    }
    messaging.registerListener(P.account.id, _messageListener);
}

export function unregister(P: Persistence) {
    messaging.unregisterListener(P.account.id);
}

// ----------vvvvvvv---------
async function messageListener(P:Persistence, senderId:string, payload:RemoteEvent.Payload) {
    // console.log(`${P.account.id}>> from ${senderId} "${payload.event}" ->`, payload.data);
    const event = payload.event.split(":");
    switch (event[0]) {
        case "load": const data = payload.data as RemoteEvent.Load;
                     return P[data.prefix].load(data.id);
        case "echo": return echo(P, event[1], payload.data);
        default:     
                     if (!_listener_[payload.event]) {
                         console.log(`Listener for "${payload.event}" unknown!`, 
                                     payload.data);
                     }
                     return _listener_[payload.event](P, payload.data);
    }
}
const _listener_ = {
   artifactEnter: async function(P, _) {
       const data = _ as RemoteEvent.ArtifactEnter;
       const artifact = await P.artifacts.load(data.artifactId);
       return localArtifact.artifactEnter(P, artifact, data.worldId);      
   },
   artifactLeave: async function(P, _) {
       const data = _ as RemoteEvent.ArtifactLeave;
       const artifact = await P.artifacts.load(data.artifactId);
       return localArtifact.artifactLeave(P, artifact, data.worldId, 
                                          data.position, data.disconnect);
   },
   artifactPickup: async function(P, _) {
       const data = _ as RemoteEvent.ArtifactPickup;
       const artifact = await P.artifacts.load(data.artifactId);
       return localArtifact.artifactPickup(P, artifact, data.objId);
   },
   artifactPutdown: async function(P, _) {
       const data = _ as RemoteEvent.ArtifactPutdown;
       const artifact = await P.artifacts.load(data.artifactId);
       return localArtifact.artifactPutdown(P, artifact);
   },
   artifactRemoveFromWorld: async function(P, _) {
       const data = _ as RemoteEvent.ArtifactRemove;
       const artifact = await P.artifacts.load(data.artifactId);
       return localArtifact.artifactRemoveFromWorld(P, artifact, data.worldId, data.position);
   },
   artifactInsertIntoWorld: async function(P, _) {
       const data = _ as RemoteEvent.ArtifactInsert;
       const artifact = await P.artifacts.load(data.artifactId);
       return localArtifact.artifactInsertIntoWorld(P, artifact, data.worldId, data.pos)
   },
   artifactUpdateProperties: async function(P, _) {
       const data = _ as RemoteEvent.ArtifactProperties;
       const artifact = await P.artifacts.load(data.artifactId);
       return localArtifact.artifactUpdateProperties(P, artifact, data.properties);
   },
//----
   worldPush: async function(P, _) {
       const data = _ as RemoteEvent.WorldPush;
       const world = await P.worlds.load(data.worldId);
       return localWorld.worldPush(P, world, data.artifactId, data.objId);
   },
   worldPickup: async function(P, _) {
       const data = _ as RemoteEvent.WorldPickup;
       const world = await P.worlds.load(data.worldId);
       return localWorld.worldPickup(P, world, data.artifactId, data.objId);
   },
   worldPutdown: async function(P, _) {
       const data = _ as RemoteEvent.WorldPutdown;
       const world = await P.worlds.load(data.worldId);
       return localWorld.worldPutdown(P, world, data.artifactId, data.objId);
   },
   worldUpdateProperties: async function(P, _) {
       const data = _ as RemoteEvent.WorldProperties;
       const world = await P.worlds.load(data.worldId);
       return localWorld.worldUpdateProperties(P, world, data.artifactId);
   },
   worldRemoveFromWorld: async function(P, _) {
       const data = _ as RemoteEvent.WorldRemove;
       const world = await P.worlds.load(data.worldId);
       return localWorld.worldRemoveFromWorld(P, world, data.artifactId);
   },
   worldInsertIntoWorld: async function(P, _) {
       const data = _ as RemoteEvent.WorldInsert;
       const world = await P.worlds.load(data.worldId);
       return localWorld.worldInsertIntoWorld(P, world, data.artifactId, data.pos)
   },
   worldUpdateInWorld: async function(P, _) {
       const data = _ as RemoteEvent.WorldUpdate;
       const world = await P.worlds.load(data.worldId);
       return localWorld.worldUpdateInWorld(P, world, data.artifactId, data.pos)
   },
   worldStartMoving: async function(P, _) {
       const data = _ as RemoteEvent.WorldStartMoving;
       const world = await P.worlds.load(data.worldId);
       return localWorld.worldStartMoving(P, world, data.artifactId)
   },
   worldStopMoving: async function(P, _) {
       const data = _ as RemoteEvent.WorldStopMoving;
       const world = await P.worlds.load(data.worldId);
       return localWorld.worldStopMoving(P, world, data.artifactId)
   },
   worldUpdateText: async function(P, _) {
       const data = _ as RemoteEvent.WorldUpdateText;
       const world = await P.worlds.load(data.worldId);
       return localWorld.worldUpdateText(P, world, data.text)
   },
}
// ----------^^^^^^^---------

