import { existsSync } from "fs"
import { app, BrowserWindow } from 'electron'
import { worldWidth, visualBounds } from "../universe/const"

import { Persistence } from "../persistence/persist"
import { interopSetup } from "../persistence/interop/setup"


let mainWindow: Electron.BrowserWindow

const localPersistence     = new Persistence("app/");
const alternatePersistence = new Persistence("alt/");

function onReady() {

    // another persistence to test multiplayer.
    // alternatePersistence.init().then(()=> {
    // })
    // local game initialisation!
    localPersistence.init().then(() => { 
        const width  = worldWidth + visualBounds.left + visualBounds.right;
        // const height = visualBounds.height + 2*visualBounds.margin + 24;
        const height = 450;
        visualBounds.height = height - 2*visualBounds.margin;
        mainWindow = new BrowserWindow({
            x: 0, y: 0,
            width:  width,
            height: height,
            resizable: false,
            fullscreen: false,
            maximizable: false,
            webPreferences: {
                nodeIntegration: true,
            }
        })
        localPersistence.attachWindow(mainWindow);
        mainWindow.webContents.openDevTools({ mode:"detach" })
        mainWindow.loadFile("dist/index.html")
    })
}

function onQuit() {
    localPersistence.free()
}

app.on('ready', () => onReady())
app.on('window-all-closed', () => app.quit())
app.on("quit", () => onQuit())
