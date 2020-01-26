/**
 * Host process of the Electron.
 * Responsible for persistence, networking, data manipulation.
 * Commands the renderer process, opens windows, etc.
 */
import { existsSync } from "fs"
import { app, BrowserWindow } from 'electron'

// Constants
import { DEBUG, worldWidth, visualBounds } from "../const"
// Persistence
import { Persistence } from "../persistence/persist"
import { interopSetup } from "../persistence/interop/setup"

import * as remoteTest from "../persistence/remote/test"

/**
 * Persistence that contains all the account data for this instance of the game.
 */
const localPersistence = new Persistence("app_");
let testPersistence;


/**
 * As soon as Electron is ready, we set up Persistence, open a window,
 * and load the `index.html` file generated from `gui.ts`.
 */
function onReady() {
    remoteTest.init(localPersistence).then((testP) => { 
        testPersistence = testP;

        const width  = worldWidth + visualBounds.left + visualBounds.right;
        let height;
        if (DEBUG) {
            height = 250;
        } else {
            height = visualBounds.height + 2*visualBounds.margin + 24;
        }
        visualBounds.height = height - 2*visualBounds.margin;
        const mainWindow = new BrowserWindow({
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
        // mainWindow.webContents.openDevTools({ mode:"detach" })
        mainWindow.loadFile("dist/index.html")
    })

}

/**
 * When the app is closed, we MUST signal to the local Persistence to shut down.
 * Local Persistence is responsible for keeping persistences across TextNet
 * aware of the app being online.
 */
function onQuit() {
    if (testPersistence) {
        testPersistence.free();
    }
    localPersistence.free()
}

app.on('ready', () => onReady())
app.on('window-all-closed', () => app.quit())
app.on("quit", () => onQuit())
