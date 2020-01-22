
import { Persistence } from "../persist"
import * as RemoteEvent from "../mutate/remote/event_structures"


export async function listenEcho(P: Persistence, 
                                 eventName: string, 
                                 data: RemoteEvent.RemoteEvent,
                                 targetIds: Record<string, string>) {
    for (let oId in P.observers) {
        const observer = P.observers[oId];
        observer.sendEvent(eventName, data, targetIds);
    }
}
