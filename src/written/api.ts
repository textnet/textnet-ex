import { lua, lauxlib, lualib, to_luastring, LuaState } from "fengari-web"
import { push, luaopen_js, wrap, jscall } from "./interop"


export function fengari_load(L: LuaState, code:string) {
    const loadResult = lauxlib.luaL_loadstring(L, to_luastring(code));
    if (loadResult != lua.LUA_OK) {
        console.log("luaL_loadstring: ", loadResult, 
            lua.LUA_OK, 
            lua.LUA_ERRSYNTAX, lua.LUA_ERRMEM, lua.ERRGCMM,
        );
    }
    return loadResult == lua.LUA_OK;
}

export function fengari_call(L: LuaState) {
    const callResult = lua.lua_pcall(L, 0, 1, 0)
        if (callResult != lua.LUA_OK) {
            console.log("lua_pcall: ", callResult, 
                lua.LUA_OK,
                lua.LUA_ERRRUN, lua.LUA_ERRMEM, lua.LUA_ERRERR, lua.ERRGCMM,
                )
        }    
    return callResult == lua.LUA_OK;
}

export function fengari_init() {
    // init ----------------------------------------------------------------
    const L = lauxlib.luaL_newstate();
    if (!L) {
        console.log("luaL_newstate: out of memory")
        return;
    }
    lualib.luaL_openlibs(L);
    lauxlib.luaL_requiref(L, to_luastring("js"), luaopen_js, 1);
    lua.lua_pop(L, 1);
    // data ----------------------------------------------------------------
    // ?
    return L
}

export function fengari_free(L: LuaState) {
    lua.lua_close(L)
}