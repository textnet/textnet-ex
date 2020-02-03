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

const RPregistry: Record<string, RemotePersistence[]> = {};
export async function connect(P: Persistence) {
    function onMessage(connectionInfo: p2p.ConnectionInfo, data:FullPayload) {
        if (!data.isCallback) {
            console.log("----- received p2p", data)
            // send local message, collect result, send callback.
            const promise = localSendMessage(
                data["senderId"].toString(), 
                data["receiverId"].toString(), 
                data["payload"]);
            promise.then(function(result) { 
                const callbackPayload = {
                    result: result,
                    nonce:  data.nonce,
                    isCallback: true,
                }
                p2p.message(connectionInfo, callbackPayload);
            }) 
        } else {
            console.log("------ received p2p callback")
            const callback = callbackRegistry[data.nonce];
            if (callback) {
                callback(data.result);
            }
        }
    }
    function onConnect(connectionInfo: p2p.ConnectionInfo) {
        // new peer connecting
        console.log(`P(${P.account.id}) <- connected ${connectionInfo.info.id}`)
        const RP = new RemotePersistence(connectionInfo);
        const id = connectionInfo.info.id.toString()
        if (!RPregistry[id]) {
            RPregistry[id] = [];    
        }
        RPregistry[id].push(RP);
        
    }
    function onClose(connectionInfo: p2p.ConnectionInfo) {
        // peer disconnecting
        console.log(`P(${P.account.id}) // disconnected ${connectionInfo.info.id}`)
        const id = connectionInfo.info.id.toString()
        if (RPregistry[id]) {
            const newList = [];
            for (let R of RPregistry[id]) {
                if (!R.conn.socket.destroyed) {
                    newList.push(R);
                }
            }
            RPregistry[id] = newList;
        }
    }
    console.log(`P(${P.account.id}) -> joining swarm`)
    await p2p.connect(P.account.id, onMessage, onConnect, onClose);
}
export function getConnection(persistenceId: string) {
    if (!RPregistry[persistenceId]) {
        console.log("EMPTY PERSISTENCE", persistenceId, RPregistry)
    }
    for (let R of RPregistry[persistenceId]) {
        if (!R.conn.socket.destroyed) {
            return R;
        }
    }
    console.log("ALL SOCKETS ARE DEAD", persistenceId, RPregistry)
    // console.log(RPregistry);
    // console.log("get connection:", persistenceId)
}


const callbackRegistry: Record<string, any> = {}
export async function sendMessage(sender:   Persistence,
                                  receiver: RemotePersistence,
                                  payload:  any) {
    if (sender.account.id == receiver.id.toString()) {
        console.log("local message!")
        return localSendMessage(sender.account.id, receiver.id.toString(), payload);
    } else {
        const fullPayload: FullPayload = {
            senderId: sender.account.id,
            receiverId: receiver.id.toString(),
            payload: payload,
            isCallback: false,            
            nonce:   nonce(),
        }
        console.log("full payload", fullPayload)
        const promise = new Promise((resolve, reject)=>{
            callbackRegistry[fullPayload.nonce] = function(result) {
                resolve(result);
            }
            console.log("sending p2p ^")
            p2p.message(receiver.conn, fullPayload)    
        })
        return promise;
    }
}

async function localSendMessage(senderPersistenceId:   string,
                                receiverPersistenceId: string,
                                payload:  any) {
    console.log(`local send message (${senderPersistenceId}->${receiverPersistenceId})`, 
                payload)
    const channelString = channelToString();
    for (let l of listeners[channelString]) {
        if (receiverPersistenceId == l["id"]) {
            return await l.listener(senderPersistenceId, receiverPersistenceId, payload);
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
