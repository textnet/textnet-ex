import {lua, lauxlib, lualib, to_luastring} from "fengari-web"

import { TESTS } from "./written"

import { push, luaopen_js, wrap, jscall } from "./written_interop"

// int luaL_dostring (lua_State *L, const char *str);

export function testFengari() {
    const s = `
        function on_move(artifact, x,y)
            print("ARTIFACT.id", artifact.id)
            print("ARTIFACT.name", artifact.name)
            print("MOVE(" .. x ..", ".. y ..")")
            return true
        end
        b.result = b.log{
            id=87,
            name="Ni",
            passable=false,
            artifact = {
                id=12,
                name="Chair",
            },
            handler = on_move,
        }
        `;
    console.log(s)
    function ll(p, k, prefix?) {
        if (!prefix) prefix = ""
        let value = p["get"](k);
        if (typeof value == "function") {
            console.log(value["has"])
            if (value["has"]("id")) {
                console.log("-> "+k+" -> TABLE")
                ll(value, "id", k);
                ll(value, "name", k);
            } else {
                console.log("function!")
            }
        } else {
            console.log(prefix+"-> "+k, value);
        }
    }
    const data = {
        success: 0,
        log: function() {
            const n = lua.lua_gettop(L);
            const p = wrap(L, lua.lua_toproxy(L, 2));
            ll(p, "id")           
            ll(p, "name")
            ll(p, "artifact")
            ll(p, "passable")
            // how to work with handlers
            let handler = p["get"]("handler");
            push(L, handler);
            push(L, {id:100, name:"New artifact"});
            push(L, 66);
            push(L, 88);
            let result = jscall(L,3);
            console.log("handler result:", result);
            // put return value
            return {id:200, name:"Result Artifact"};
        }
    }
    /*
        What's possible:
        + call JS functions out of Lua:
            + pass table structure
            + pass numbers/string
            + pass table in table
            + pass function in table
            + detect parameters
            + return tables and other types
        + call Lua functions out of JS
            + subscribe on function
            + call it later
            + pass tables
            + pass other types
            + get return value
    */

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
