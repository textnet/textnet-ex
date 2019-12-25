import { Position, Coordinates, Dir } from "./interfaces"
import { DIR } from "./const"

/**
 * Miscellaneous utility function.
 */

/**
 * Simplest ID generator; should be replaced with something better.
 * @param {string} prefix
 * @returns {string} like 'artifact:23'.
 */
export function numerate(prefix: string) { return prefix + ":" + ++_num; }
let _num = 0;

/**
 * Make a copy of a Position. Uses `deepcopy`.
 * @param {Position} position
 * @returns {Position}
 **/
export function cpPosition(position: Position) {
    return deepCopy(position);
}

/**
 * Make a copy of a Coordinates object.
 * Can't use `deepcopy`, because we shouldn't copy worlds.
 * @param {Coordinates} coords
 * @returns {Coordinates}
 */
export function cpCoords(coords: Coordinates) {
    return {
        world: coords.world,
        position: cpPosition(coords.position)
    } as Coordinates;
}

/**
 * Threshold for standartisation of directions.
 */
const THRESHOLD = 0.0001;

/**
 * Adds two directions into one.
 * Fills the right name in if the direction matches a standard one within a threshold.
 * @param {Dir} dir1
 * @param {Dir} dir2
 * @returns {Dir}
 */
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


/** 
 * Helper function to convert Base64 strings into Blob objects.
 * @param {string} b64Data - input
 * @param {string} contentType - kind of data, e.g. image
 * @param {number} sliceSize - speed optimisation
 * @returns {Blob}
 */
export const b64toBlob = (b64Data, contentType='image/png', sliceSize=512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
}