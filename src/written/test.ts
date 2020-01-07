

import { lua, lauxlib, ldebug, lualib, to_luastring, to_jsstring, LuaState } from "fengari-web"
import { push } from "./interop"
import * as api from "./api"

const text = `
print("1.")
print(test{text=25})
print("2.")
`


export function fengariTest() {
    let success;
    const L = api.fengari_init({})

    // api.fengari_register_function({}, L, "test", ["text"], function(ctx, text){
    //     return pwait(L, testAsync(text))      
    // })
    api.fengari_register_async({}, L, "test", ["text"], function(ctx, text){
        console.log("Never Show That.")
        return "Never Return That."
    })

    success = api.fengari_load(L, text);
    console.log(`FENGARI load = ${success}`)
    success = api.fengari_resume(L);
    console.log(`FENGARI resume = ${success}`)
    console.log("FENGARI: passed") 
    
}