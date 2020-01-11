/**
 * Written Word: Events
 *
 * Provides support for subscribing on events.
 */

import { PersistenceObserver } from "../../persistence/observe/observer"
import { getArtifactFromData } from "./tools"
import { FengariMap          } from "../api"

/**
 * Subscribe on event happening to a particular artifact.
 * Read more about events in the Written Word documentation.
 * @param {PersistenceObserver} O
 * @optional @param {FengariMap} all parameters, namely:
 *    - artifact (default is self)
 *    - event (default is "timer")
 *    - role  (default is "object")
 *    - handler function
 * @returns {any} key for unsubscription.
 */
export function event_on(O: PersistenceObserver, 
                         params: FengariMap) {
    const artifactData = params.has("artifact") ? params.get("artifact") : undefined;
    const event = params.has("event") ? params.get("event") : "timer";
    const role  = params.has("role")  ? params.get("role") : "object";
    const artifact = getArtifactFromData(O, artifactData);
    if (params.has("handler")) {
        O.subscribe(artifact, event, role, params.get("handler"));
        return params.get("handler");
    } else {
        return false;
    }
}


/**
 * Remove subscription for an event.
 * @param {PersistenceObserver} O
 * @optional @param {object} artifactData
 * @optional @param {string} event
 * @optional @param {string} role
 * @optional @param {any}    key @see event_on()
 */
export function event_off( O: PersistenceObserver, 
                           artifactData?: object, 
                           event?: string, role?: string, key? ) {
    const artifact = getArtifactFromData(O, artifactData);
    event = event || "timer";
    role  = role  || "object";
    if (key) {
        O.unsubscribe(artifact, event, role, key);
        return true;
    } else {
        return false;
    }
}

