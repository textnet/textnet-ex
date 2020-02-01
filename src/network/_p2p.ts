const crypto = require('crypto')
const Swarm = require('discovery-swarm')
const defaults = require('dat-swarm-defaults')
const getPort = require('get-port')

const TEXTNET_SWARM_CHANNEL = "textnet-swarm(0)"

/**
 * Here we will save our TCP peer connections
 * using the peer id as key: { peer_id: TCP_Connection }
 */
const peers = {};

// Counter for connections, used for identify connections
let connSeq = 0

export function broadcast( message, recipients? ) {
    if (!recipients) recipients = peers;
    for (let id in recipients) {
        recipients[id].conn.write(message)
    }    
}
export function message( message, recipient ) {
    return broadcast( message, [recipient] )
}

export async function connect( id, messageHandler?, openHandler?, closeHandler? ) {
    const swarm = Swarm(defaults({
        id: id
    }))
    const port = await getPort()
    swarm.listen(port);
    swarm.join(TEXTNET_SWARM_CHANNEL);
    swarm.on("connection", (conn, info) => {
        const seq = connSeq++;
        const peerId = info.id
        peers[peerId] = { conn: conn, seq: seq }
        console.log(`Connected #${seq} to peer: ${peerId}`)
        if (openHandler) openHandler(peerId);
        // keep alive
        if (info.initiator) {
           try {
               conn.setKeepAlive(true, 600)
           } catch (exception) {
               console.log('P2P Connect Exception', exception)
           }
        }
        // incoming
        conn.on('data', data => {
            // Here we handle incomming messages
            console.log(
                   'Received Message from peer ' + peerId,
                   '----> ' + data.toString()
            )
            if (messageHandler) messageHandler(peerId, data);
        })
        // close
        conn.on('close', () => {
            console.log(`Close connection with peer: ${peerId}`)
            if (closeHandler) closeHandler(peerId)
            if (peers[peerId].seq === seq) {
                delete peers[peerId]
            }
        })
    })
}
