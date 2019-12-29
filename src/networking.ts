import * as ex from 'excalibur';
import { 
    Artifact, Avatar, World, 
    Position, Dir, Coordinates 
} from "./universe/interfaces"
import { Game } from "./index"
import { SyncEvent } from "./universe/events"
import { initObservance } from "./observe"

/**
 * Module that should provide support for multiplayer persistence.
 * Currently a stub.
 */

export function initSync(engine: Game) {
    let dispatcher:ex.EventDispatcher = new ex.EventDispatcher({});
    engine.syncDispatcher = dispatcher;
    initObservance(dispatcher);
}

