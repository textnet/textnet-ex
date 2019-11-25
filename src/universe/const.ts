import { Position } from "./interfaces"

export const DIR = {
    UP: { name: "up", angle: 0, x: 0, y: -1 },
    DOWN: { name: "down", angle: 0, x: 0, y: 1 },
    LEFT: { name: "left", angle: 0, x: -1, y: 0 },
    RIGHT: { name: "right", angle: 0, x: 1, y: 0 }
};
export const worldWidth = 1000; // add some visual bounds
export const spawnPosition: Position = { x: 0, y: 0, dir: DIR.DOWN };

// event registry
export const universeUpdateFrequency = 100; // ms
export const EVENT = {
    MOVE: { action: "move", },
}

