
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
            await local.artifacts.remove(id);
        }
    }
    const allWorlds = await local.worlds.all();
    for (let id in allWorlds) {
        if (allWorlds[id].ownerId != local.account.bodyId) {
            await local.worlds.remove(id);
        } else {
            allWorlds[id].artifactPositions = {};
            allWorlds[id].text = "The Hollow World. There is only one way from here."
            await local.worlds.save(allWorlds[id]);
        }
    } 
    // switching hosting world player to a default sprite.
    const pArtifact = await P.artifacts.load(P.account.bodyId);
    pArtifact.name = "I am your host, Luke."
    pArtifact.sprite = deepCopy(artifactDefault.sprite);
    pArtifact.body   = deepCopy(artifactDefault.body);
    await P.artifacts.save(pArtifact)

    // sending player to visit;
    const playerArtifact = await local.artifacts.load(local.account.bodyId);
    const worldArtifact  = await P.artifacts.load(P.account.bodyId);
    playerArtifact.visitsStack.push(worldArtifact.worldIds[mundaneWorldName]);
    await local.artifacts.save(playerArtifact);

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
        mainWindow.webContents.openDevTools({ mode:"detach" })
        mainWindow.loadFile("dist/index.html")    
    }
}