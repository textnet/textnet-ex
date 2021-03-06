/**
 * Written Word: Events
 *
 * Provides support for subscribing on events.
 */

import { PersistenceObserver } from "../../persistence/observe/observer"
import { getArtifactFromData } from "./tools"
import { FengariMap          } from "../api"
import { supportedEvents } from "../library"

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
    const artifactId = params.has("artifact") ? params.get("artifact")["id"] : undefined;
    let event = params.has("event") ? params.get("event") : "timer";
    if (supportedEvents.indexOf(event) < 0) {
        event = "timer";
    }
    const role  = params.has("role")  ? params.get("role") : "object";
    if (params.has("handler")) {
        O.subscribe(artifactId, event, role, params.get("handler"));
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
    const artifactId = artifactData ? artifactData["id"] : undefined;
    event = event || "timer";
    role  = role  || "object";
    if (key) {
        O.unsubscribe(artifactId, event, role, key);
        return true;
    } else {
        return false;
    }
}

