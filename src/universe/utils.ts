import { Position, Coordinates, Dir } from "./interfaces"
import { DIR } from "./const"

let _num = 0;
export function numerate(prefix: string) {
    return prefix + ":" + ++_num;
}

export function cpPosition(position: Position) {
    return deepCopy(position);
}

export function cpCoords(coords: Coordinates) {
    return {
        world: coords.world,
        position: cpPosition(coords.position)
    } as Coordinates;
}


const THRESHOLD = 0.0001
export function addDir(dir1: Dir, dir2: Dir) {
    let dir: Dir = deepCopy(DIR.NONE)
    dir.x = dir1.x + dir2.x;
    dir.y = dir1.y + dir2.y;
    // establish direction.
    if (Math.abs(dir.x) <= THRESHOLD && Math.abs(dir.y) <= THRESHOLD) {
        dir.name = DIR.NONE.name;
    } else {
        if (Math.abs(dir.x) > Math.abs(dir.y)) {
            if (dir.x > 0) dir.name = DIR.RIGHT.name;
            else dir.name = DIR.LEFT.name;
        } else {
            if (dir.y > 0) dir.name = DIR.DOWN.name;
            else dir.name = DIR.UP.name;
        }
    }
    return dir;
}

/**
 * Deep copy function for TypeScript.
 * @param T Generic type of target/copied value.
 * @param target Target value to be copied.
 * @see Source project, ts-deepcopy https://github.com/ykdr2017/ts-deepcopy
 * @see Code pen https://codepen.io/erikvullings/pen/ejyBYg
 */
export const deepCopy = <T>(target: T): T => {
  if (target === null) {
    return target;
  }
  if (target instanceof Date) {
    return new Date(target.getTime()) as any;
  }
  if (target instanceof Array) {
    const cp = [] as any[];
    (target as any[]).forEach((v) => { cp.push(v); });
    return cp.map((n: any) => deepCopy<any>(n)) as any;
  }
  if (typeof target === 'object' && target !== {}) {
    const cp = { ...(target as { [key: string]: any }) } as { [key: string]: any };
    Object.keys(cp).forEach(k => {
      cp[k] = deepCopy<any>(cp[k]);
    });
    return cp as T;
  }
  return target;
};