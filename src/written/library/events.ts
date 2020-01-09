import { PersistenceObserver } from "../../persistence/observe/observer"
import { getArtifactFromData } from "./spatial"
import { FengariMap } from "../api"


export async function event_on(O: PersistenceObserver, params: FengariMap) {
    const artifactData = params.has("artifact") ? params.get("artifact") : undefined;
    const event = params.has("event") ? params.get("event") : "timer";
    const role  = params.has("role")  ? params.get("role") : "object";
    const artifact = getArtifactFromData(O, artifactData);
    if (params.has("handler")) {
        O.subscribe(artifact, event, role, params.get("handler"));
        return true;
    } else {
        return false;
    }
}


export async function event_off( O: PersistenceObserver, 
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

