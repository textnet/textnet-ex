import { lua, lauxlib, ldebug, lualib, to_luastring, to_jsstring, LuaState } from "fengari-web"
import { push, luaopen_js, wrap, jscall } from "./interop"
import { supportedFunctions } from "./library"

export interface FengariMap {
    get(key),
    set(key, value),
    has(key)
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

function log(L: LuaState, call:string, callResult:string) {
    const _log = (text) => {
        console.log(call+":", text);
        console.log("Error message:", to_jsstring(lauxlib.luaL_tolstring(L, -1)))
    };
    switch (callResult) {
        case lua.LUA_OK:        return;
        case lua.LUA_ERRMEM:    return _log("Out of memory");
        case lua.LUA_ERRERR:    return _log("WTF: Error of error");
        case lua.LUA_ERRGCMM:   return _log("Garbage issue");
        case lua.LUA_ERRSYNTAX: return _log("Syntax error" );
        case lua.LUA_ERRRUN:    return _log("Runtime error" );
    }
    return _log("Unknown Error")
}

function fengari_register_function(CTX, L: LuaState, name: string, signature: string[], f)  {
    const fWrapper = function() {
        const argCout = lua.lua_gettop(L);
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
        fengari_register_function(CTX, L, i, supportedFunctions[i].signature, 
                                             supportedFunctions[i].f)
    }
    return L;
}

export function fengari_free(L: LuaState) {
    lua.lua_close(L)
}