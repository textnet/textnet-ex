
import { existsSync } from "fs"
import { app, BrowserWindow } from 'electron'

import { DEBUG, DEBUG_LOCAL, DEBUG_REMOTE,
         worldWidth, visualBounds, mundaneWorldName } from "../../const"
import { Persistence } from "../persist"
import { Artifact, World } from "../../interfaces"
import { deepCopy } from "../../utils"

import { artifactDefault } from "../startup"



export async function usual(local: Persistence) {
    await local.init();
    return { free: function(){} }
}

export async function localInit(local: Persistence) {
    await local.init();
    // inject WW.
    const playerArtifact = await local.artifacts.load(local.account.bodyId);
    const playerWorld = await local.worlds.load(playerArtifact.worldIds[mundaneWorldName]);
    playerWorld.text = ww["P1"];
    await local.worlds.save(playerWorld);    
    await local.observers[playerArtifact.id].attempt();
    const artifactIds = await local.artifacts.local();
    let portalTarget = "<none>"
    for (let id in artifactIds) {
        const artifact = await local.artifacts.load(id);
        if (ww[artifact.name]) {
            // console.log(`Custom WW for "${artifact.name}"`)
            const artifactWorld = await local.worlds.load(artifact.worldIds[mundaneWorldName]);
            artifactWorld.text = ww[artifact.name];
            if (artifact.name == "Chair 1") {
                portalTarget = artifact.id;
            }
            if (artifact.name == "Portal") {
                artifactWorld.text = "#teleport/target "+portalTarget+"\n"+artifactWorld.text;
            }
            await local.worlds.save(artifactWorld);
            await local.observers[id].attempt();
        }
    }
    //    
    return { free: function(){} }
}


export async function init(local: Persistence) {
    if (DEBUG_LOCAL) return localInit(local);
    if (!DEBUG_REMOTE) return usual(local);

    const P = new Persistence("test_");
    P.isSilent = true;
    await P.init();
    await local.init();

    // delete chairs from local
    const allArtifacts = await local.artifacts.all();    
    for (let id in allArtifacts) {
        if (id != local.account.bodyId) {
            const hostWorld = await local.worlds.load(allArtifacts[id].hostId);
            delete hostWorld.artifactPositions[id];
            await local.worlds.save(hostWorld)
            await local.artifacts.remove(id);
        }
    }
    // switching hosting world player to a default sprite.
    const pArtifact = await P.artifacts.load(P.account.bodyId);
    pArtifact.name = "Host"
    pArtifact.sprite = deepCopy(artifactDefault.sprite);
    pArtifact.body   = deepCopy(artifactDefault.body);
    await P.artifacts.save(pArtifact)

    // sending player to visit;
    const playerArtifact = await local.artifacts.load(local.account.bodyId);
    const worldArtifact  = await P.artifacts.load(P.account.bodyId);
    playerArtifact.visitsStack.push(worldArtifact.worldIds[mundaneWorldName]);
    await local.artifacts.save(playerArtifact);

    // inject WW.
    const playerWorld = await local.worlds.load(playerArtifact.worldIds[mundaneWorldName]);
    playerWorld.text = ww["P1"];
    await local.worlds.save(playerWorld);    
    await local.observers[playerArtifact.id].attempt();
    const artifactIds = await P.artifacts.local();
    for (let id in artifactIds) {
        const artifact = await P.artifacts.load(id);
        if (ww[artifact.name]) {
            console.log(`Custom WW for "${artifact.name}"\n`)
            const artifactWorld = await P.worlds.load(artifact.worldIds[mundaneWorldName]);
            artifactWorld.text = ww[artifact.name];
            if (artifact.name == "Portal") {
                artifactWorld.text = "#teleport/target "+playerArtifact.id+"\n"+artifactWorld.text;
            }
            await P.worlds.save(artifactWorld);
            await P.observers[id].attempt();
        }
    }


    // set up world (copy from main)
    {
        const width  = worldWidth + visualBounds.left + visualBounds.right;
        let height;
        if (DEBUG) {
            height = 250;
        } else {
            height = visualBounds.height + 2*visualBounds.margin + 24;
        }
        visualBounds.height = height - 2*visualBounds.margin;
        const mainWindow = new BrowserWindow({
            x: width, y: 0,
            width:  width,
            height: height,
            resizable: false,
            fullscreen: false,
            maximizable: false,
            webPreferences: {
                nodeIntegration: true,
            }
        })
        P.attachWindow(mainWindow);
        // mainWindow.webContents.openDevTools({ mode:"detach" })
        mainWindow.loadFile("dist/index.html")    
    }
    return P;
}


const ww = {
"Portal" :`
    function do_teleport(event)
        local target_id = get_line{ anchor="teleport/target" }
        if (target_id ~= "") then
            teleport{ artifact=event.subject, target_id=target_id }
        end
    end
    self{ pushable=false }
    on{ event="push", role="object", handler=do_teleport }
`,
"Chair 1": `This is Chair No.1.
    local myself = get_myself{}
    local prefix = myself.name.." >"
    update_line{ anchor="teleport/here", text=myself.id }

#teleport/here    
`,

"Chair 2": `This is Chair No.2.

    function next()
        move_by{ x= 300 }
        move_by{ y= 300 }
        move_by{ x=-300 }
        move_by{ y=-300 }
    end
    on{ event="move_stop", role="subject", handler=next}
    -- next()

`,

"Host": `This is the hosting world.
#teleport/here

    local myself = get_myself{}
    local prefix = myself.name.." >"
    self{ name="Host (updated)" }
    --
    update_line{ anchor="teleport/here", text=myself.id }
    --
    function tell_me_about_it(event)
        if event.object then
            print(prefix, event.event, event.role, "Object-> ", event.object.name)
        end
        if event.subject then
            print(prefix, event.event, event.role, "Subject->",event.subject.name)
        end
    end
    local chair1 = get_artifact{ name="Chair 1" }
    local chair2 = get_artifact{ name="Chair 2" }
    -- on{ artifact=chair1, event="move", handler=tell_me_about_it }
    -- on{ event="enter", role="world", handler=tell_me_about_it }
    -- on{ event="leave", role="world", handler=tell_me_about_it }
    -- on{ event="move_start", role="world", handler=tell_me_about_it }
    -- on{ event="move_stop",  role="world", handler=tell_me_about_it }
    -- on{ event="move", role="world", handler=tell_me_about_it }

`,

"P1": `This is myself.
`,

}



/**

@timer
    roles: world
    event: 
        .event
        .role
        .data: observerEvents.TimeEvent 
            .delta

*/
