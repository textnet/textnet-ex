import {lua, lauxlib, lualib, to_luastring} from "fengari-web"

import { TESTS } from "./written"

import { push, luaopen_js } from "./written_interop"

// int luaL_dostring (lua_State *L, const char *str);

export function testFengari() {
    const s = `
        a = "world";
        -- js = require "js"
        -- print(js.global)
        -- local window = js.global
        -- local document = window.document
        -- print(js.global.document.title)
        -- js.global.data.success = 12
        b.success=15
        `;
    console.log(s)
    const data = {
        success: 0
    }

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
    push(L, data);
    lua.lua_setglobal(L, to_luastring("b"));
    // func ----------------------------------------------------------------
    // !!!
    // load ----------------------------------------------------------------
    const loadResult = lauxlib.luaL_loadstring(L, to_luastring(s));
    if (loadResult != lua.LUA_OK) {
        console.log("luaL_loadstring: ", loadResult, 
            lua.LUA_OK, 
            lua.LUA_ERRSYNTAX, lua.LUA_ERRMEM, lua.ERRGCMM,
        );
        return loadResult;
    }
    // call ----------------------------------------------------------------
    const callResult = lua.lua_pcall(L, 0, 1, 0)
    if (callResult != lua.LUA_OK) {
        console.log("lua_pcall: ", callResult, 
            lua.LUA_OK,
            lua.LUA_ERRRUN, lua.LUA_ERRMEM, lua.LUA_ERRERR, lua.ERRGCMM,
            )
        return callResult
    }
    // log. ----------------------------------------------------------------
    console.log("data", data)
    // done ----------------------------------------------------------------
    lua.lua_close(L)
}
