

import { persistenceId } from "../identity"
import { Persistence } from "../persist"

import * as RemoteEvent from "../mutate/remote/event_structures"
import { ConnectionInfo } from "../../network/p2p"
import * as messaging from "../../network/messaging"


export async function load(P: Persistence, prefix: string, id: string) {
    const idP = getRemotePersistenceById(id);
    const data = await idP.load(P, prefix, id);
    return data;
}

export function getRemotePersistenceById(id: string) {
    return messaging.getConnection(id);
}

// Remote Persistence
export class RemotePersistence {
    id: string;
    conn: ConnectionInfo;

    constructor(conn: ConnectionInfo) {
        this.conn = conn;
        this.id = conn.info.id;
    }

    async load(senderP: Persistence, prefix:string, id: string) {
        // console.log(`RP-Call:Load(${prefix}) => ${id}`)
        return await messaging.sendMessage(senderP, this, {
            event: "load",
            data: {
                prefix: prefix,
                id:     id,
            } as RemoteEvent.Load
        } as RemoteEvent.Payload)
    }

    async send(senderP: Persistence, event: string, data: RemoteEvent.RemoteEvent) {
        // console.log(`RP-Call:Event(${event}) => ... Sender=${senderP.account.id}, receiver=${this.id}`)
        return await messaging.sendMessage(senderP, this, {
            event: event,
            data: data,
        } as RemoteEvent.Payload)
    }

}





