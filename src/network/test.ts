import * as p2p from "./p2p"
import * as readline from "readline"


export function test() { 

    connect("A").then(()=>{

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question('<ENTER> = add new peer', (answer) => {
            //connect("C")
            rl.close();
        });

    })
    connect("B");

}


const peers = [
]

function connect(id: string) {
    function onMessage(connectionInfo: p2p.ConnectionInfo, pl) {
        return _onMessage(id, connectionInfo, pl)
    }
    function onConnect(connectionInfo: p2p.ConnectionInfo) {
        return _onConnect(id, connectionInfo)
    }
    function onClose(connectionInfo: p2p.ConnectionInfo) {
        console.log("close, is socket destroyed already?", connectionInfo.socket.destroyed)
    }
    return p2p.connect(id, onMessage, onConnect, onClose);
}

function _onMessage(hostId: string, connectionInfo: p2p.ConnectionInfo, payload) {
    const peerId = connectionInfo.info.id.toString();
    console.log(`/${hostId}/ message from "${peerId}" =>`)
    console.log("     ", payload)
    console.log("^^^^^^^^^")
}

function _onConnect(hostId: string, connectionInfo: p2p.ConnectionInfo) {
    const peerId = connectionInfo.info.id.toString();
    console.log(`/${hostId}/ connected with "${peerId}"`)
    peers.push(connectionInfo);
    // p2p.message(connectionInfo, { hostId: hostId, peerId:peerId })
}


