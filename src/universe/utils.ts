import { Position, Coordinates } from "./interfaces"

let _num = 0;
export function numerate(prefix: string) {
    return prefix + ":" + ++_num;
}

export function cpPosition(position: Position) {
    return {
        x: position.x, 
        y: position.y,
        dir: position.dir,
    }
}

export function cpCoords(coords: Coordinates) {
    return {
        position: cpPosition(coords.position),
        world: coords.world,
    }
}

