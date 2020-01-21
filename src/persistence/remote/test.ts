
import { existsSync } from "fs"
import { app, BrowserWindow } from 'electron'

import { DEBUG, worldWidth, visualBounds, mundaneWorldName } from "../../const"
import { Persistence } from "../persist"
import { Artifact, World } from "../../interfaces"
import { deepCopy } from "../../utils"

import { artifactDefault } from "../startup"


export async function init(local: Persistence) {
    const P = new Persistence("test_");
    P.isSilent = true;
    await local.init();
    await P.init();

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
}


const ww = {
"Chair 1": `This is Chair No.1.

    local self = get_myself{}
    local prefix = self.name.." >"
    --
    local upper = get_artifacts{ world="upper" }
    for i=0,upper.length-1 do 
        print(prefix, "Upper: "..upper[i].name)
    end
    --
    local chair2 = get_artifact{ world="upper", name="Chair 2"}
    if chair2 then
        place_at{ artifact=chair2, x=310, y=40 }
        move_by{ artifact=chair2, x=-300 }
    end    
    --
    print(prefix, "Done")
`,

"Chair 2": `This is Chair No.2.
`,

"Host": `This is the hosting world.

    local self = get_myself{}
    local prefix = self.name.." >"
    --
    local inner = get_artifacts{}
    for i=0,inner.length-1 do 
        print(prefix, "Inner: "..inner[i].name)
    end
    --
    local chair1 = get_artifact{ name="Chair 1"}
    if chair1 then
        place_at{ artifact=chair1, x=10, y=10 }
        move_by{ artifact=chair1, x=300 }
    end
    --
    print(prefix, "Done")
`,

"P1": `This is myself.

    local self = get_myself{}
    local prefix = self.name.." >"
    --
    local inner = get_artifacts{}
    for i=0,inner.length-1 do 
        print(prefix, "Inner: "..inner[i].name)
    end
    --
    local upper = get_artifacts{ world="upper" }
    for i=0,upper.length-1 do 
        print(prefix, "Upper: "..upper[i].name)
    end    
    --
    print(prefix, "Done")
`,

}
