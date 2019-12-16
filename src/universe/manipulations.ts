import {
    Position, Dir, Coordinates,
    Artifact, World, Avatar, 
    Account
} from "./interfaces"
import { cpCoords, cpPosition } from "./utils"
import { spawnPosition } from "./const"
import {
    ScriptMoveEvent
} from "./events"
import { isOverlap } from "./getters"


export function enterArtifact(avatar:Avatar, artifact:Artifact) {
    return enterWorld(avatar, artifact.worlds[0]);
}

export function enterWorld(avatar:Avatar, world:World) {
    // EVENT: avatar:enter
    if (avatar.body.coords) {
        avatar.visits[avatar.body.coords.world.id] = cpCoords(avatar.body.coords);
    }
    removeArtifact(avatar.body);
    if (!avatar.visits[world.id]) {
        avatar.visits[world.id] = { position: cpPosition(spawnPosition), world: world };
     }
    avatar.visitsStack.push(world.id);
    placeArtifact(avatar.body, avatar.visits[world.id]);
}
export function leaveWorld(avatar:Avatar) {
    // EVENT: avatar:leave
    if (avatar.visitsStack.length > 1) {
        removeArtifact(avatar.body);
        avatar.visitsStack.pop();
        let prevWorld:string = avatar.visitsStack[avatar.visitsStack.length-1];
        placeArtifact(avatar.body, avatar.visits[prevWorld]);
    }
}

export function pickupArtifact(avatar: Avatar, artifact: Artifact) {
    // EVENT: avatar:pickup
    removeArtifact(artifact);
    avatar.inventory.push(artifact);
}
export function putdownArtifact(avatar: Avatar) {
    if (avatar.inventory.length > 0) {
        // EVENT: avatar:putdown;
        // TODO: closest position;
        let coords: Coordinates = cpCoords(avatar.body.coords);
        let artifact: Artifact = avatar.inventory.pop();
        placeArtifact(artifact, coords)
        return artifact;
    }
}

export function removeArtifact(artifact: Artifact) {
    if (!artifact.coords) return;
    // EVENT: world:remove_artifact / artifact: remove
    delete artifact.coords.world.artifacts[artifact.id];
    delete artifact.coords;
}

export function placeArtifact(artifact: Artifact, coords: Coordinates) {
    // EVENT: world:place_artifact / artifact: place
    artifact.coords = coords;
    artifact.coords.world.artifacts[artifact.id] = artifact;
}

// check if it is possible to place artifact here
export function isArtifactPlaceable(artifact: Artifact, coords: Coordinates) {
    for (let i in coords.world.artifacts) {
        let another:Artifact = coords.world.artifacts[i];
        if (another.id != artifact.id && isOverlap(artifact, another)) {
            return false;
        }
    }
    return true;
}

export function updateArtifactPosition(artifact: Artifact, newPosition: Position) {
    if (!artifact.coords) return;
    // prep
    let dx,dy: number;
    dx = newPosition.x - artifact.coords.position.x;
    dy = newPosition.y - artifact.coords.position.y;
    if (dx == 0 && dy == 0) return;
    // update universe
    artifact.coords.position = cpPosition(newPosition);
    // emit events
    artifact.dispatcher.emit("script:move", new ScriptMoveEvent(artifact, dx, dy));
}


