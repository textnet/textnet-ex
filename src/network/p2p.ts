// const crypto = require('crypto')
const Swarm = require('discovery-swarm')
const defaults = require('dat-swarm-defaults')
const getPort = require('get-port')

import * as crypto from "crypto";


import { messagingChannelPrefix } from "../const"
import { Persistence } from "../persistence/persist"

import { Socket } from "net"
import * as readline from "readline"


const discoveryChannel = messagingChannelPrefix+"discovery";

export interface ConnectionInfo {
    id: string,
    socket: Socket,
    info;
}

export function message(connectionInfo: ConnectionInfo, fullPayload) {
    let data = JSON.stringify(fullPayload);
    connectionInfo.socket.write(data+"\n\n");
}


export async function connect( id:string, onMessage?, onConnect?, onClose? ) {
    const swarm = new Swarm(defaults({
        id: Buffer.from(id, 'utf8')
    }))
    const port = await getPort()
    swarm.listen(port);
    // console.log(`P2P: join "${discoveryChannel}" at port ${port}`);
    swarm.on("connection", (conn: Socket, info) => {
        let connectionDataTail = "";
        const connectionInfo = { id: id, socket:conn, info:info }
        // console.log(`(p2p) start connection ${id}---${info.id}`)
        // keep alive ---------------------------------------
        if (info.initiator) {
            // console.log(`(p2p) ${id} keep alive!`)
           try {
               conn.setKeepAlive(true, 600)
           } catch (exception) {
               console.log('P2P Connect Exception', exception)
           }
        }
        if (onConnect) onConnect(connectionInfo);
        // incoming -----------------------------------------
        conn.on('data', data => {
            // console.log(`${id}: Tail -->`, connectionDataTail)
            // console.log(`${id}: Received Message from peer ` + info.id,
            //             '----> ' + data.toString()
            // )
            const messages = (connectionDataTail+data.toString()).split("\n\n");
            for (let i=0; i<messages.length-1; i++) {
                const fullPayload = JSON.parse(messages[i])    
                if (onMessage) onMessage(connectionInfo, fullPayload);
            }
            connectionDataTail = messages[messages.length-1]
        })
        // close --------------------------------------------
        conn.on('close', () => {
            // console.log(`(p2p) close connection ${id}-/-${info.id}`);
            if (onClose) onClose(connectionInfo)
        })
    })
    return new Promise((resolve, reject)=>{
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question('Press <ENTER>', (answer) => {
            swarm.join(discoveryChannel, {}, function(){
                // console.log(id, "joined.")
                resolve()
            });
            rl.close();
        });
    })

}
