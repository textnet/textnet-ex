
import { Persistence } from "../persist"
import { getRemotePersistenceFromId } from "./persistence"

import * as RemoteEvent from "../mutate/remote/event_structures"

import { echo } from "../../network/echo"

export class RemoteSubscription {
    P: Persistence;
    subscriptions: Record<string,string[]>

    constructor(P: Persistence) {
        this.P = P;
        this.subscriptions = {};
    }

    emit(event: string, hostWorldId: string, data: RemoteEvent.RemoteEvent) {
        echo(this.P, event.split(":")[1], data);
        if (this.subscriptions[hostWorldId]) {
            for (let artifactId of this.subscriptions[hostWorldId]) {
                const artifactRP = getRemotePersistenceFromId(artifactId);
                artifactRP.send(this.P, event, data);
            }
        }
    }

    subscribe(hostWorldId: string, guestArtifactId: string, ) {
        const artifactRP = getRemotePersistenceFromId(guestArtifactId);
        if (artifactRP) {
            if (!this.subscriptions[hostWorldId]) {
                this.subscriptions[hostWorldId] = [];
            }
            if (this.subscriptions[hostWorldId].indexOf(guestArtifactId) < 0) {
                this.subscriptions[hostWorldId].push(guestArtifactId)    
            }
        }
    }

    unsubscribe(hostWorldId: string, guestArtifactId: string, ) {
        const artifactRP = getRemotePersistenceFromId(guestArtifactId);
        if (artifactRP) {
            if (this.subscriptions[hostWorldId]) {
                const i = this.subscriptions[hostWorldId].indexOf(guestArtifactId);
                if (i >= 0) {
                    this.subscriptions[hostWorldId].slice(i, 1);
                }
            }
        }
    }

}