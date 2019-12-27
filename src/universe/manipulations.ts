import {
    Position, Dir, Coordinates,
    Artifact, World, Avatar, 
    Account
} from "./interfaces"
import { cpCoords, cpPosition } from "./utils"
import { spawnPosition } from "./const"
import {
    ScriptMoveEvent,
    ScriptTextEvent,
    ScriptPropertiesEvent,
} from "./events"
import { isOverlap, artifactBox } from "./getters"

/**
 * Functions that manipulate the universe in a proper manner.
 * One shouldn't alter any of the structures (e.g. Artifacts or Avatar)
 * in any way except calling those functions.
 *
 * The goal of such approach is to guarantee that all dependencies
 * handled properly and all necessary messages are emitted.
 */


/**
 * Avatar enters the world that belongs to an Artifact.
 * A convenience function, uses `enterWorld` internally.
 * @param {Avatar} avatar
 * @param {Artifact} artifact
 */
export function enterArtifact(avatar:Avatar, artifact:Artifact) {
    return enterWorld(avatar, artifact.worlds[0]);
}

/**
 * Avatar enters a World.
 * It artifact is removed from the world it currently inhabits,
 * and placed into the new world.
 * Visits stack is maintainted.
 * @param {Avatar} avatar
 * @param {World} world
 */
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

/**
 * Avatar leaves the World, going up its visits stack.
 * It artifact is removed from the world it currently inhabits,
 * and placed into the topmost world from its visits.
 * @param {Avatar} avatar
 */
export function leaveWorld(avatar:Avatar) {
    // EVENT: avatar:leave
    if (avatar.visitsStack.length > 1) {
        removeArtifact(avatar.body);
        avatar.visitsStack.pop();
        let prevWorld:string = avatar.visitsStack[avatar.visitsStack.length-1];
        placeArtifact(avatar.body, avatar.visits[prevWorld]);
    }
}

/**
 * Avatar picks an Artifact.
 * The artifact is removed from the world it placed in, and added to the inventory.
 * and placed into the topmost world from its visits.
 * @param {Avatar} avatar
 * @param {Artifact} artifact
 */
export function pickupArtifact(avatar: Avatar, artifact: Artifact) {
    // EVENT: avatar:pickup
    removeArtifact(artifact);
    avatar.inventory.push(artifact);
}

/**
 * Avatar attempts to put down the artifact he has recently picked up.
 * Direction is provided.
 * The attempt fails if there is no free place for the artifact.
 * Does nothing if the inventory is empty.
 * @param {Avatar} avatar
 * @param {Dir} dir
 * @returns {Artifact} or nothing if the attempt is failed.
 */
export function putdownArtifact(avatar: Avatar, dir: Dir) {
    if (avatar.inventory.length > 0) {
        let coords: Coordinates = cpCoords(avatar.body.coords);
        let artifact: Artifact = avatar.inventory.pop();
        coords.position.x += dir.x*(
            avatar.body.body.size[0]
            + artifact.body.size[0]
            )/2
            -artifact.body.offset[0]
            +avatar.body.body.offset[0];
        coords.position.y += dir.y*(
            avatar.body.body.size[1] 
            + artifact.body.size[1]
            )/2
            -artifact.body.offset[1]
            +avatar.body.body.offset[1];
        if (isArtifactPlaceable(artifact, coords)) {
            // EVENT: avatar:putdown;
            placeArtifact(artifact, coords);
            return artifact;
        } else {
            avatar.inventory.push(artifact)
        }
    }
}

/**
 * Removes the artifact from the world it is placed in.
 * Keeps consistency of both world and artifact structures.
 * @param {Artifact} artifact
 */
export function removeArtifact(artifact: Artifact) {
    if (!artifact.coords) return;
    // EVENT: world:remove_artifact / artifact: remove
    delete artifact.coords.world.artifacts[artifact.id];
    delete artifact.coords;
}

/**
 * Forcibly puts the artifact in a world at the given coordinates.
 * Keeps consistency of both world and artifact structures.
 * @param {Artifact} artifact
 * @param {Coordinates} coords
 */
export function placeArtifact(artifact: Artifact, coords: Coordinates) {
    // EVENT: world:place_artifact / artifact: place
    artifact.coords = coords;
    if (artifact.coords && artifact.coords.world.id != coords.world.id) {
        removeArtifact(artifact);
    }
    artifact.coords.world.artifacts[artifact.id] = artifact;
}

/**
 * Forcibly puts the artifact in a world at the given coordinates.
 * Keeps consistency of both world and artifact structures.
 * @param {Artifact} artifact
 * @param {Coordinates} coords
 */
export function tryToPlaceArtifact(artifact: Artifact, coords: Coordinates) {
    if (isArtifactPlaceable(artifact, coords)) {
        placeArtifact(artifact, coords);
        return true;
    } else {
        return false;
    }
}

/**
 * Check is is is possible to place the artifact at the given coordinates.
 * @param {Artifact} artifact
 * @param {Coordinates} coords
 * @returns {boolean}
 */
export function isArtifactPlaceable(artifact: Artifact, coords: Coordinates) {
    for (let i in coords.world.artifacts) {
        let another:Artifact = coords.world.artifacts[i];
        if (another.id != artifact.id && isOverlap(artifact, another, coords)) {
            // console.log("STUCK", artifact.name, another.name)
            // console.log(artifact.name, artifactBox(artifact, coords))
            // console.log(another.name, artifactBox(another))
            return false;
        }
    }
    return true;
}

/**
 * Updates an artifact position in the world it is placed in.
 * Emits `artifact:move` event that describes the move
 * Events are currently not used.
 * @param {Artifact} artifact
 * @param {Position} newPosition
 */
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


// full text & recompile
export function updateWorldText(world: World, text?: string, compile?:boolean) {
    // update universe
    if (text != undefined) {
        world.text = text;    
    }
    // emit events
    world.owner.dispatcher.emit("script:text", 
        new ScriptTextEvent(world.owner, world.text, compile));
}


export function updateArtifactProperties(artifact: Artifact, properties) {
    // update universe
    for (let key in properties) {
        if (properties[key] != undefined) {
            artifact[key] = properties[key];
        }
    }
    // emit events
    if (artifact.dispatcher) {       
        artifact.dispatcher.emit("script:properties", 
            new ScriptPropertiesEvent(artifact, properties));
    }
}

export function updateArtifactText(artifact: Artifact, text?:string, compile?:boolean) {
    // it is just a shortcut
    updateWorldText(artifact.worlds[0], text, compile)
}

