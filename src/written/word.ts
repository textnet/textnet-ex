/**
 * Entrance to the Written Word.
 */


import { getChunks } from "./parser"
import { fengari_init, fengari_load, fengari_call, fengari_free } from "./api"

/*

Ideas on how to implement the thing.

1. `observer.ts`, when created?
2. written environments are created by observer and put into avatars
3. successful avatars are created by observer
4. observer listens to events and routes them to written environment
5. observer updates universe
6. none of actors is updated directly.

*/

export interface WrittenEnvironment {
    id: string; // useful for debugging.
    L: any; // internal LUA state. You should not think about it at all.
}

export function initWrittenWord(CTX, id: string, text: string) {
    const chunks = getChunks(text);
    const env: WrittenEnvironment = {
        id: id,
        L: fengari_init(CTX)
    }
    for (let chunk of chunks) {
        let success = fengari_load(env.L, chunk.data) && fengari_call(env.L);
        if (!success) return;
    }
    // console.log("<Written Word>", env, text);
    return env;
}

export function freeWrittenWord(env: WrittenEnvironment) {
    fengari_free(env.L)
}


