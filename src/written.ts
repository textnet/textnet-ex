export const TESTS = {
    empty: ``,
    lua: `
local d=10;
return "Result";
`,
    text:`
----------------------------------
This is an example of text.
It is just text, no written word here.
No written word here at all.

This is just a simple text file.
----------------------------------`,
   simplest:`
----------------------------------
This is an example of simple embedding of Written Word.

    js = require "js";
    return js.global.data.f();

Simple?
----------------------------------`,
   fragments:`
----------------------------------
This is an example where we have multiple fragments of Written Word here and there.

    local a = 10;
    local b = "Hello, my love!";

Another example goes here:

    local c = b .. " I am dreaming of you."

None of it connects to TextNet universe, yet.

\`\`\`
function factorial(n) 
    if n == 0 then
        return 1
    end
    return n*factorial(n-1)
end
\`\`\`

Now the function is defined, and we can run it.

    local N = factorial(10)

Fine?
----------------------------------`,
}
// https://github.com/fiatjaf/glua
// https://github.com/mherkender/lua.js 

import * as fengariWeb from "fengari-web";
import { testFengari } from "./written_fengari"

export function test(log) {
    log(TESTS.simplest);
    log("========================================================")
    const test = TESTS.simplest;
    const chunks = getChunks(test);

    // return testFengari()


    window["data"] = { t: 100, m: ["tooo", false],
        f: function(t) { return t+"-test" }
     };
    for (let chunk of chunks) {
        const func = fengariWeb.load(chunk.data);
        const result = func();
        console.log(func())
    }
    // const luaconf  = fengari.luaconf;
    // const lua      = fengari.lua;
    // const lauxlib  = fengari.lauxlib;
    // const lualib   = fengari.lualib;

    // const L = lauxlib.luaL_newstate();

    // lualib.luaL_openlibs(L);

    // lua.lua_pushliteral(L, "hello world!");

}

function isCode(line: string) {
    return line.match(/^[ ]{2,}[^+\-*>].*$/i)
}
function isCodeDelimiter(line: string) {
    return line.match(/^\s*```.*$/i)
}

export function getChunks(input) {
    let lines = input.split("\n");
    lines.push("");
    let inCode = false;
    let pushChunk = false;
    let chunks = [];
    let chunk  = [];
    let lineNo = 0;
    for (let line of lines) {
        pushChunk = true;
        if (inCode && isCodeDelimiter(line)) {
            inCode = false;
        } else 
        if (!inCode && isCodeDelimiter(line)) {
            inCode = true;
        } else
        if (inCode || isCode(line)) {
            chunk.push(line);
            pushChunk = false;
        }
        if (pushChunk && chunk.length > 0) {
            chunks.push({
                data: chunk.join("\n"),
                endsAt: lineNo,
            });
            chunk = [];            
        }
        lineNo++;
    }
    if (chunk.length > 0) {
        chunks.push({
            data: chunk.join("\n"),
            endsAt: lineNo,
        });
    }
    return chunks;
}


