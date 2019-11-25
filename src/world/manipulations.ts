import {
    Position, Dir, Coordinates,
    Artifact, World, Avatar, 
    Account
} from "./interfaces"
import { cpCoords, cpPosition } from "./utils"
import { spawnPosition } from "./const"


export function enterWorld(avatar:Avatar, world:World) {
    // EVENT: avatar:enter
    if (avatar.body.coords) {
        avatar.visits[avatar.body.coords.world.id] = cpCoords(avatar.body.coords);
    }
    removeArtifact(avatar.body);
    if (!avatar.visits[world.id]) {
        avatar.visits[world.id] = { position: cpPosition(spawnPosition), world: world };
     }
    placeArtifact(avatar.body, avatar.visits[world.id]);
}

export function removeArtifact(artifact: Artifact) {
    if (!artifact.coords) return;
    // EVENT: world:remove_artifact / artifact: remove
    artifact.coords.world.artifacts[artifact.id] = null;
    artifact.coords = null;
}

export function placeArtifact(artifact: Artifact, coords: Coordinates) {
    // EVENT: world:place_artifact / artifact: place
    artifact.coords = coords;
    artifact.coords.world.artifacts[artifact.id] = artifact;
}

