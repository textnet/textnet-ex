/**
 * Entrance to the Written Word.
 */

import { getChunks } from "./parser"
import { fengari_init, fengari_load, fengari_call, fengari_free } from "./api"

/**
 * Container that holds a state of Lua VM thus abstracting Fengari.
 */
export interface WrittenEnvironment {
    id: string; // useful for debugging.
    L: any;     // internal LUA state. You should not think about it at all.
}

/**
 * Prepare the VM, load a world's text in it and run Written Word.
 * @param   {object} CTX  - context object (for TextNet is PersistentObserver)
 * @param   {string} id   - to help with debugging
 * @param   {string} text - full text of the World, from where Written Word will be extractd.
 * @returns {WrittenEnvironment} if everything went well.
 */
export function initWrittenWord(CTX, id: string, text: string) {
    const chunks = getChunks(text);
    const env: WrittenEnvironment = {
        id: id,
        L: fengari_init(CTX)
    }
    let resultList = []
    for (let chunk of chunks) {
        resultList.push(chunk.data);
    }
    const resultText = resultList.join("\n")
    if (resultText != "") {
        let success = fengari_load(env.L, resultText);
        if (!success) return;
        success = fengari_call(env.L);
        if (!success) return;
        console.log(`\n<Written Word>(${id}) Ready.`)
        return env;
    }
}

/**
 * Shuts down the WrittenWord VM.
 * @param {WrittenEnvironment} env
 */
export function freeWrittenWord(env: WrittenEnvironment) {
    fengari_free(env.L)
}


