

import { persistenceId } from "../identity"
import { Persistence } from "../persist"

import * as RemoteEvent from "../mutate/remote/event_structures"
import * as network from "../../network/registry"


export async function load(P: Persistence, prefix: string, id: string) {
    // temporary!
    // TODO: subscribe etc.
    let data;
    const pId = persistenceId(id);
    const idP = getRemotePersistence(pId);
    data = await idP.load(P, prefix, id);
    return data;
}

const localRegistry = {}; // temporary-2

export function register(P: Persistence) { // temporary-3
    const RP = new RemotePersistence(P.account.id);
    localRegistry[RP.id] = RP;
}

export function getRemotePersistenceFromId(id: string): RemotePersistence|undefined {
    const pId = persistenceId(id);
    const idP = getRemotePersistence(pId);
    return idP;
}

export function getRemotePersistence(pId: string) { // temporary-4
    return localRegistry[pId];
}

// Remote Persistence
export class RemotePersistence {
    id: string;

    constructor(id: string) {
        this.id = id;
    }

    async load(senderP: Persistence, prefix:string, id: string) {
        // console.log(`RP-Call:Load(${prefix}) => ${id}`)
        return await network.sendMessage(senderP, this, {
            event: "load",
            data: {
                prefix: prefix,
                id:     id,
            } as RemoteEvent.Load
        } as RemoteEvent.Payload)
    }

    async send(senderP: Persistence, event: string, data: RemoteEvent.RemoteEvent) {
        // console.log(`RP-Call:Event(${event}) => ... Sender=${senderP.account.id}, receiver=${this.id}`)
        return await network.sendMessage(senderP, this, {
            event: event,
            data: data,
        } as RemoteEvent.Payload)
    }

}





