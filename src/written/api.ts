import { lua, lauxlib, ldebug, lualib, to_luastring, to_jsstring, LuaState } from "fengari-web"
import { push, luaopen_js, wrap, jscall } from "./interop"
import { supportedFunctions } from "./library"

import { defaultsArtifact } from "../universe/interfaces"
import { deepCopy } from "../universe/utils"

export interface FengariMap {
    get(key),
    set(key, value),
    has(key),
    ownKeys()
}


export function fengari_load(L: LuaState, code:string) {
    const loadResult = lauxlib.luaL_loadstring(L, to_luastring(code));
    log(L, "luaL_loadstring", loadResult);
    return loadResult == lua.LUA_OK;
}

export function fengari_call(L: LuaState) {
    const callResult = lua.lua_pcall(L, 0, 1, 0)
    log(L, "lua_pcall", callResult);
    return callResult == lua.LUA_OK;
}

export function fengari_resume(L: LuaState) {
    const callResult = lua.lua_resume(L, null, 0);
    log(L, "lua_resume", callResult);
    return callResult == lua.LUA_YIELD || callResult == lua.LUA_OK;
}

export function fengari_yield(L: LuaState) {
    const callResult = lua.lua_yield(L, 0);
    log(L, "lua_yield", callResult);
    return callResult == lua.LUA_YIELD || callResult == lua.LUA_OK;
}

function log(L: LuaState, call:string, callResult:string) {
    const _log = (text) => {
        console.log(call+":", text);
        console.log("Error message:", to_jsstring(lauxlib.luaL_tolstring(L, -1)))
    };
    switch (callResult) {
        case lua.LUA_OK:        return;
        case lua.LUA_YIELD:     return;
        case lua.LUA_ERRMEM:    return _log("Out of memory");
        case lua.LUA_ERRERR:    return _log("WTF: Error of error");
        case lua.LUA_ERRGCMM:   return _log("Garbage issue");
        case lua.LUA_ERRSYNTAX: return _log("Syntax error" );
        case lua.LUA_ERRRUN:    return _log("Runtime error" );
    }
    return _log("Unknown Error")
}

function extract_no_signature_params(args) {
    const params = {}
    let API = defaultsArtifact.API;
    if (args.has("API")) {
        API = args.get("API")
        params["API"] = deepCopy(API);
    }
    for (let item of API) {
        if (args.has(item) && item != "id") {
            params[item] = args.get(item);
        }
    }
    return params;

}

export function fengari_register_async(CTX, L: LuaState, name: string, signature: string[], f)  {
    const fWrapper = function() {
        const argCount = lua.lua_gettop(L);
        const args = wrap(L, lua.lua_toproxy(L, 2));
        const params = [CTX];
        if (signature) {
            for (let paramName of signature) {
                params.push(args["get"](paramName));
            } 
        } else {
            params.push(extract_no_signature_params(args));
            if (args["has"]("artifact")) {
                params[params.length-1]["artifact"] = args["get"]("artifact");
            }
        }
        const promise = f.apply(null, params);
        promise.then(res => {
            push(L, res)
            lua.lua_resume(L, null, 1)
        }).catch(err => {
            console.log("ERROR!", err)
            lua.lua_pushnil(L)
            lua.lua_pushliteral(L, '' + err)
            lua.lua_resume(L, null, 2)
        })
        return lua.lua_yield(L, 0)        
    }
    // console.log("registered function: "+name+"("+signature.join(", ")+")")
    push(L, fWrapper);
    lua.lua_setglobal(L, to_luastring(name));
}

export function fengari_register_function(CTX, L: LuaState, name: string, signature: string[], f)  {
    const fWrapper = function() {
        const argCount = lua.lua_gettop(L);
        const args = wrap(L, lua.lua_toproxy(L, 2));
        const params = [CTX];
        if (signature) {
            for (let paramName of signature) {
                params.push(args["get"](paramName));
            } 
        } else {
            params.push(args)
        }
        return f.apply(null, params);
    }
    // console.log("registered function: "+name+"("+signature.join(", ")+")")
    push(L, fWrapper);
    lua.lua_setglobal(L, to_luastring(name));
}

export function fengari_init(CTX) {
    // init ----------------------------------------------------------------
    const L = lauxlib.luaL_newstate();
    // lua.lua_atnativeerror(L, function (l) {
    //     lua.lua_pushstring(l, to_luastring(''+lua.lua_touserdata(l, -1)));
    // });
    if (!L) {
        console.log("luaL_newstate: out of memory")
        return;
    }
    lualib.luaL_openlibs(L);
    lauxlib.luaL_requiref(L, to_luastring("js"), luaopen_js, 1);
    lua.lua_pop(L, 1);
    // register functions ---------------------------------------------------
    for (let i in supportedFunctions) {
        fengari_register_async(CTX, L, i, supportedFunctions[i].signature, 
                                             supportedFunctions[i].f)
    }
    return L;
}

export function fengari_free(L: LuaState) {
    lua.lua_close(L)
}