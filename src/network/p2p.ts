// const crypto = require('crypto')
const Swarm = require('discovery-swarm')
const defaults = require('dat-swarm-defaults')
const getPort = require('get-port')

import * as crypto from "crypto";


import { messagingChannelPrefix } from "../const"
import { Persistence } from "../persistence/persist"

import { Socket } from "net"


const discoveryChannel = messagingChannelPrefix+"discovery";

export interface ConnectionInfo {
    id: string,
    socket: Socket,
    info;
}

export function message(connectionInfo: ConnectionInfo, fullPayload) {
    const data = JSON.stringify(fullPayload);
    connectionInfo.socket.write(data);
}


function hexEncode(s: string) {
    let result = "";
    for (let i=0; i<s.length; i++) {
        const hex = s.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }
    return result
}


export async function connect( id:string, onMessage?, onConnect?, onClose? ) {
    const swarm = Swarm(defaults({
        id: Buffer.from(id, 'utf8')
    }))
    const port = await getPort()
    swarm.listen(port);
    console.log(`P2P: join "${discoveryChannel}" at port ${port}`);
    swarm.on("connection", (conn: Socket, info) => {
        const connectionInfo = { id: id, socket:conn, info:info }
        console.log(`${id}: Connected: ${info.id}`)
        // keep alive ---------------------------------------
        if (info.initiator) {
            console.log(`${id}: keep alive!`)
           try {
               conn.setKeepAlive(true, 600)
           } catch (exception) {
               console.log('P2P Connect Exception', exception)
           }
        }
        if (onConnect) onConnect(connectionInfo);
        // incoming -----------------------------------------
        conn.on('data', data => {
            console.log('${id}: Received Message from peer ' + info.id,
                        '----> ' + data.toString()
            )
            const fullPayload = JSON.parse(data.toString())
            if (onMessage) onMessage(connectionInfo, fullPayload);
        })
        // close --------------------------------------------
        conn.on('close', () => {
            console.log(`${id}: Close connection with peer: ${info.id}`);
            if (onClose) onClose(connectionInfo)
        })
    })
    return new Promise((resolve, reject)=>{
        swarm.join(discoveryChannel, {}, resolve);
    })

}
