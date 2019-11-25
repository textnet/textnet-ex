import * as ex from 'excalibur';
import { 
    Artifact, Avatar, World, 
    Position, Dir, Coordinates 
} from "./universe/interfaces"
import { Game } from "./index"
import { SyncEvent } from "./universe/events"


export function initSync(engine: Game) {
    let dispatcher:ex.EventDispatcher = new ex.EventDispatcher({});
    engine.syncDispatcher = dispatcher;
    // engine.syncDispatcher.on("sync", networkSync);
    // engine.syncDispatcher.on("script:move", networkSync);
    engine.syncDispatcher.emit("sync", new SyncEvent("init"));
}

function networkSync(event: SyncEvent) {
    console.log("network", 
        event._action, 
        event.artifact?event.artifact.id:"<no artifact>", 
        event.params )
}

