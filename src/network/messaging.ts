// dumb
import { Persistence } from "../persistence/persist"
import * as p2p from "./p2p"
import { RemotePersistence } from "../persistence/remote/persistence"
import { nonce } from "../utils"

// channels for data updates to minimize network traffic.
interface DataUpdatesChannel { // within persistence
    prefix: string; // artifacts, worlds, accounts
    id:     string; 
}
interface FullPayload {
    nonce: string,
    isCallback: boolean;
    senderId?: string;
    receiverId?: string;
    result?: string;
    payload?: string;
}

const RPregistry: Record<string, RemotePersistence> = {}
export async function connect(P: Persistence) {
    function onMessage(connectionInfo: p2p.ConnectionInfo, data:FullPayload) {
        if (!data.isCallback) {
            // send local message, collect result, send callback.
            const promise = localSendMessage(data["senderId"], data["receiverId"], data["payload"]);
            promise.then(function(result) { 
                const callbackPayload = {
                    result: result,
                    nonce:  data.nonce,
                    isCallback: true,
                }
                p2p.message(connectionInfo, callbackPayload);
            }) 
        } else {
            const callback = callbackRegistry[data.nonce];
            if (callback) {
                callback(data.result);
            }
        }
    }
    function onConnect(connectionInfo: p2p.ConnectionInfo) {
        // new peer connecting
        console.log(`P(${P.account.id}) <- connecting ${connectionInfo.info.id}`)
        if (!RPregistry[connectionInfo.info.id]) {
            const RP = new RemotePersistence(connectionInfo);
            RPregistry[connectionInfo.info.id] = RP;
        }
    }
    function onClose(connectionInfo: p2p.ConnectionInfo) {
        // peer disconnecting
        delete RPregistry[connectionInfo.id];
    }
    console.log(`P(${P.account.id}) -> joining swarm`)
    await p2p.connect(P.account.id, onMessage, onConnect, onClose);
}
export function getConnection(persistenceId: string) {
    return RPregistry[persistenceId];
}


const callbackRegistry: Record<string, any> = {}
export async function sendMessage(sender:   Persistence,
                                  receiver: RemotePersistence,
                                  payload:  any) {
    if (sender.account.id == receiver.id) {
        return await localSendMessage(sender.account.id, receiver.id, payload);
    } else {
        const fullPayload: FullPayload = {
            senderId: sender.account.id,
            receiverId: receiver.id,
            payload: payload,
            isCallback: false,            
            nonce:   nonce(),
        }
        const promise = new Promise((resolve, reject)=>{
            callbackRegistry[fullPayload.nonce] = function(result) {
                resolve(result);
            }
            p2p.message(receiver.conn, fullPayload)    
        })
        return promise;
    }
}

async function localSendMessage(senderPersistenceId:   string,
                                receiverPersistenceId: string,
                                payload:  any) {
    const channelString = channelToString();
    for (let l of listeners[channelString]) {
        if (receiverPersistenceId == l["id"]) {
            return await l.listener(senderPersistenceId, payload);
        }
    }
}
const listeners = {}
export function registerListener(persistenceId: string,
                                 listener:   (senderId:string,receiverId:string,payload)=>void,
                                 channel?:   DataUpdatesChannel) {
    const channelString = channelToString(channel);
    if (!listeners[channelString]) {
        listeners[channelString] = [];
    }
    listeners[channelString].push({
        id: persistenceId,
        listener:   listener
    })
}
export function unregisterListener(persistenceId: string,
                                   channel?: DataUpdatesChannel) {
    const channelString = channelToString(channel);
    if (listeners[channelString]) {
        for (let i in listeners[channelString]) {
            if (listeners[channelString][i]["id"] == persistenceId) {
                listeners[channelString].splice(i,1);
                return;
            }
        }
    }
}



function channelToString(channel?: DataUpdatesChannel) {
    if (channel) return channel.prefix+" - "+channel.id;
    else return "*";
}
