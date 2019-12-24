/**
 * Entrance to the Written Word.
 */


import { getChunks } from "./parser"
import { fengari_init, fengari_load, fengari_call, fengari_free } from "./api"

/*

*/

export interface WrittenEnvironment {
    id: string; // useful for debugging.
    L: any; // internal LUA state. You should not think about it at all.
}

export function initWrittenWord(id: string, text: string) {
    const chunks = getChunks(text);
    const env: WrittenEnvironment = {
        id: id,
        L: fengari_init()
    }
    for (let chunk of chunks) {
        let success = fengari_load(env.L, chunk.data) && fengari_call(env.L);
        if (!success) return;
    }
    console.log("<Written Word>", env);
    return env;
}

export function freeWrittenWord(env: WrittenEnvironment) {
    fengari_free(env.L)
}


