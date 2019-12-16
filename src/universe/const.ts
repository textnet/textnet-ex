import { Dir, Position } from "./interfaces"

export const DIR = {
    NONE:  { name: "none",  x:  0, y:  0 },
    UP:    { name: "up",    x:  0, y: -1 },
    DOWN:  { name: "down",  x:  0, y:  1 },
    LEFT:  { name: "left",  x: -1, y:  0 },
    RIGHT: { name: "right", x:  1, y:  0 },
};
export function DIRfrom(name: Dir) {
    for (let i in DIR) {
        if (DIR[i].name == name.name) return DIR[i] as Dir;
    }
    return DIR.NONE;
}
export const worldWidth = 1000; // add some visual bounds
export const spawnPosition: Position = { x: 0, y: 0, dir: DIR.DOWN };

// player actions
export const COMMAND = {
    NONE:    { description: "No command" },
    ENTER:   { description: "Attempt to enter artifact's world" },
    LEAVE:   { description: "Leave the world, return to previous visited" },
    KNEEL:   { description: "Kneel into written text to alter it" },
    STAND:   { description: "Finish editing written text and get back" },
    PICKUP:  { description: "Attempt to pick an artifact up" },
    PUTDOWN: { description: "Attempt to put the holded artifact down" },
    PUSH:    { description: "Attempt to push an artifact in the direction of movement" },
}

// event registry
export const universeUpdateFrequency = 100; // ms
export const EVENT = {
    MOVE: { action: "move", },
}



