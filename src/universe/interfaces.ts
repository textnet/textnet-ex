import * as ex from 'excalibur';
import { WrittenEnvironment } from "../written/word"

/**
 * Proper structures for all TextNet universe objects.
 *
 * As the project takes the structural/functional approach,
 * the universe is not described with classes, but with objects
 * instead.
 * 
 * It should allow for simple artifact duplication and transition
 * between different accounts of the universe.
 */


/**
 * Direction vector; not only functions as a vector, but also 
 * describes where a certain artifact is facing.
 * There are standard directions provided in constants, e.g. DIR.UP.
 * @see "const.ts"
 */
export interface Dir {
    name: string;
    x: number;
    y: number;
}

/**
 * Position of an artifact, relative to the world it is placed in.
 * Not only coordinates, but also the direction where the artifact is facing.
 */
export interface Position {
    x: number;
    y: number;
    dir: Dir;
}

/**
 * Absolute and definitieve coordinates of an artifact.
 * Include its position and the world it is placed in.
 */
export interface Coordinates {
    world: World;
    position: Position;
}

/**
 * Structure that describes a user account.
 * Currently very basic.
 */
export interface Account {
    id: string;
    // ex-avatar
    local: boolean;
    body: Artifact;
}


/**
 * World is a 2D plane where artifacts are placed.
 * It has fixed width and endless height.
 * World must belong to an artifact: avatars can enter the world through it.
 * World contain all artifacts that are placed into it.
 * Artifacts care of their own position within the world.
 * World also have floor, which holds the text (with Written Word on it).
 */
export interface World {
    id: string;
    owner: Artifact;
    artifacts: Record<string,Artifact>;
    text: string;
}

/**
 * Artifact is the most central entity.
 *
 * It is an object that has 
 * - visual representation (sprite) that can be animated
 *    artifacts can have animation of movement and of staing put
 *    artifacts can have different visualisations for different directions
 * - spatial representation (body) that defines with other artifacts
 *    artifacts can't usually overlap
 * - colour representation: used to draw HUD frames 
 *
 * Artifact may be made 'alive' and provided with an Avatar structure.
 *
 * Artifact contains Worlds (currently only one is created by default).
 * Avatars may enter the artifact thus reaching the world that belongs to the artifact.
 *
 * Artifact may be placed into a world in a certain position (=coordinates).
 * 
 * At some moment an Artifact might become 'alive'. It is entitled to 
 * have an inventory of artifacts it picks up, and to travel between worlds.
 *
 * There are also connections of avatar structure with game engine:
 * `actor` and `_dispatcher`. 
 * These connections shouldn't be copied.
 */

export const defaultsArtifact = {
    passable: false,
    pushable: true,
    pickable: true,
    locked:   false,
    speed:    100,
    power:    100,
    weight:   100,
    format:   "markdown",
    API:      [ "id", "name", 
                "passable", "pushable", "pickable", "locked", 
                "format",
                "speed", "power", "weight"],
}

export interface Artifact {
    id: string;

    name: string;   
    passable?: boolean;
    pushable?: boolean;
    pickable?: boolean;
    locked?:   boolean;
    speed?:    number;
    power?:    number;
    weight?:   number; 
    format?:   string;
    API?:      string[];

    sprite: { 
        base64: string;
        idleBase64: string;
        size:   number[]; // [32,32]
        turning:  boolean;
        moving:   boolean;
    }
    body: { 
        offset: number[]; // [0,0]
        size:   number[]; // [30,20]
    }
    colors: {
        world: { fg: string, bg: string };
        title: { fg: string, bg: string };
    }

    worlds: World[];
    coords?: Coordinates;

    dispatcher?: ex.EventDispatcher;
    actor?: ex.Actor;

    // ex-avatar
    local?: boolean;
    player?: Account;
    // TODO: proxy/local/etc.
    inventory: Artifact[];
    visits: Record<string,Coordinates>;
    visitsStack: string[];
    _env?: WrittenEnvironment;
    _eventTarget?: EventTarget;

}






