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

    print("Hello")

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

import { getChunks } from "./parser"
import { fengari_init, fengari_load, fengari_call, fengari_free } from "./api"

export function test() {
    console.log(TESTS.simplest);
    console.log("========================================================")
    const test = TESTS.simplest;
    const chunks = getChunks(test);
    let env = fengari_init();
    for (let chunk of chunks) {
        console.log(chunk);
        console.log("-------------------------------------------------------------")
        fengari_load(env, chunk.data)
        fengari_call(env)
    }
    fengari_free(env)
}
