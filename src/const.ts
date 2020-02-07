import { Dir, Position } from "./interfaces"

/**
 * Constants used across universe: directioms, commands, events.
 */

export const DEBUG = true;
export const DEBUG_LOCAL  = true;   // no network connections whatsoever.
export const DEBUG_REMOTE = false;   // set up two persistences (local & test)
export const version = "1";

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
export let worldWidth = 938; // add some visual bounds
export let visualBounds = {
    left: 43, right: 43,
    top: 0,   height: 500,
    margin: 65,
};
if (DEBUG) {
    worldWidth = 634;
    visualBounds.height = 320-24-200; // 320-24-100;
}

export const spatialProximity = 3; // how far is 'NEXT'
export const spatialThreshold = 0.0001; // for dirrection

/**
 * When an avatar enters a world in the first time, it is positioned here.
 */
export const spawnPosition: Position = { x: worldWidth/2, y: 0, dir: DIR.DOWN };

export const mundaneWorldName = "mundane";
export const possibleWorlds = [ mundaneWorldName ];

export const supportedTextFormats = ["lua", "markdown", "text" ]

export const uiSettings = {
    titleHeight:   24, // height of the world title
    labelFontSize: 16, // font size for the title
    fontFamily:    "Nanum Gothic Coding, monospace",
}
export const editorSettings = {
    fontSize:       15, 
    lineHeight:     20, 
    characterWidth: 9,
}

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


export const messagingChannelPrefix = `above/r&d/textnet/${version}/`;

