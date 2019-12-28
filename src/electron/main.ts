import { existsSync } from "fs"
import { app, BrowserWindow } from 'electron'
import { worldWidth, visualBounds } from "../universe/const"
let mainWindow: Electron.BrowserWindow


function onReady() {

    const width  = worldWidth + visualBounds.left + visualBounds.right;
    // const height = visualBounds.height + 2*visualBounds.margin + 24;

    const height = 900;
    visualBounds.height = height - 2*visualBounds.margin;

    mainWindow = new BrowserWindow({
        x: 0, y: 0,
        width:  width,
        height: height,
        resizable: false,
        fullscreen: false,
        maximizable: false,
    })

    mainWindow.webContents.openDevTools({ mode:"detach" })

    mainWindow.loadFile("dist/index.html")

    mainWindow.on('close', () => app.quit())
}

app.on('ready', () => onReady())
app.on('window-all-closed', () => app.quit())
