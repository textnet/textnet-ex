// dumb


interface DataUpdatesChannel {
    prefix: string; // artifacts, worlds, accounts
    id:     string; 
}



export function sendUpdate(senderId: string,
                           payload:  any,
                           channel?: DataUpdatesChannel) {
    const channelString = channelToString(channel);
    for (let l of listeners[channelString]) {
        l.listener(senderId, payload);
    }
}

export async function sendMessage(senderId:   string,
                                  payload:    any,
                                  receiverId: string) {
    const channelString = channelToString();
    for (let l of listeners[channelString]) {
        if (receiverId == l["listenerId"]) {
            return await l.listener(senderId, payload);
        }
    }
}

const listeners = {}

export function registerListener(listenerId: string,
                                 listener:   (senderId:string,payload)=>void,
                                 channel?:   DataUpdatesChannel) {
    const channelString = channelToString(channel);
    if (!listeners[channelString]) {
        listeners[channelString] = [];
    }
    listeners[channelString].push({
        listenerId: listenerId,
        listener:   listener
    })
}

export function unregisterListener(listenerId, channel?: DataUpdatesChannel) {
    const channelString = channelToString(channel);
    if (listeners[channelString]) {
        for (let i in listeners[channelString]) {
            if (listeners[channelString][i]["listenerId"] == listenerId) {
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
