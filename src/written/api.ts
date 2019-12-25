import { lua, lauxlib, lualib, to_luastring, LuaState } from "fengari-web"
import { push, luaopen_js, wrap, jscall } from "./interop"
import { supportedFunctions } from "./library"


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

function fengari_register_function(CTX, L: LuaState, name: string, signature: string[], f)  {
    const fWrapper = function() {
        const argCout = lua.lua_gettop(L);
        const args    = wrap(L, lua.lua_toproxy(L, 2));        
        const params = [CTX];
        for (let paramName of signature) {
            params.push(args["get"](paramName));    
        } 
        // console.log("FUNCTION:", name, 'with params', params)
        return f.apply(null, params);
    }
    // console.log("registered function: "+name+"("+signature.join(", ")+")")
    push(L, fWrapper);
    lua.lua_setglobal(L, to_luastring(name));
}

export function fengari_init(CTX) {
    // init ----------------------------------------------------------------
    const L = lauxlib.luaL_newstate();
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
    // fengari_register_function(CTX, L, "test", [], 
    //     function(CTX){
    //         console.log("testing function....")
    //         const o1 = { id:12, name: "N1"}
    //         const o2 = { id:34, name: "N2"}
    //         const o3 = { id:56, name: "N3"}
    //         return [o1, o2, o3]
    //     })
    return L;
}

export function fengari_free(L: LuaState) {
    lua.lua_close(L)
}