
import { Persistence } from "../persistence/persist"
import { RemotePersistence } from "../persistence/remote/persistence"


import * as messaging from "./messaging"
import * as RemoteEvent from "../persistence/mutate/remote/event_structures"

import * as localArtifact from "../persistence/mutate/local/artifact"
import * as localWorld    from "../persistence/mutate/local/world"

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
    console.log(`Message from (${senderId}) "${payload.event}" ->`, payload.data);
    let data
    switch (payload.event) {

        case "load":    data = payload.data as RemoteEvent.Load;
                        return P[data.prefix].load(data.id);
        case "artifactEnter":
        case "artifactLeave":
        case "artifactPickup":
        case "artifactPutdown":
        case "artifactRemoveFromWorld":
        case "artifactInsertIntoWorld":
        case "artifactUpdateProperties":

        case "worldRemoveFromWorld":
        case "worldInsertIntoWorld":
        case "worldUpdateInWorld":
        case "worldUpdateText":

                        return;

    }
}
// ----------^^^^^^^---------

