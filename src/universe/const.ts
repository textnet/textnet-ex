import { Dir, Position } from "./interfaces"

/**
 * Constants used across universe: directioms, commands, events.
 */


 export const mundaneWorldName = "mundane";

/**
 * Standard directions (structure matches [[Dir]]).
 */
export const DIR = {
    NONE:  { name: "none",  x:  0, y:  0 },
    UP:    { name: "up",    x:  0, y: -1 },
    DOWN:  { name: "down",  x:  0, y:  1 },
    LEFT:  { name: "left",  x: -1, y:  0 },
    RIGHT: { name: "right", x:  1, y:  0 },
};
/**
 * Replace a calculated direction with one of matching standard ones.
 * Uses name matching, ignores x/y coordinates.
 */
export function DIRfrom(name: Dir) {
    for (let i in DIR) {
        if (DIR[i].name == name.name) return DIR[i] as Dir;
    }
    return DIR.NONE as Dir;
}

/** 
 * World have a fixed width, this constant sets it.
 */
export const worldWidth = 634; // 938; // add some visual bounds
export const visualBounds = {
    left: 43, right: 43,
    top: 0,   height: 320-24, // 500,
    margin: 65,
};
/**
 * When an avatar enters a world in the first time, it is positioned here.
 */
export const spawnPosition: Position = { x: worldWidth/2, y: 0, dir: DIR.DOWN };

/**
 * Commands that user can give to an avatar.
 */
export const COMMAND = {
    NONE:    { description: "No command" },
    ENTER:   { description: "Attempt to enter artifact's world" },
    LEAVE:   { description: "Leave the world, return to previous visited" },
    KNEEL:   { description: "Kneel into written text to alter it" },
    STAND:   { description: "Finish editing written text and get back" },
    PICKUP:  { description: "Attempt to pick an artifact up, or to put it down" },
    PUSH:    { description: "Attempt to push an artifact in the direction of movement" },
}

/**
 * Events to update the universe are sent not often than this time.
 */
export const universeUpdateDelay       = 100; // ms
export const universeUpdateProbability = 1;

/**
 * Event registry: which events are emitted across the universe.
 * Currently not of much use, will be used as we go into 'multiplayer' phase.
 */
export const EVENT = {
    PUSH: { action: "push", },
    MOVE: { action: "move", },
    TEXT: { action: "text", },
    PROP: { action: "properties"}, 
    TIME: { action: "timer"},
    PICK: { action: "pickup"},
    DOWN: { action: "putdown" },
}



