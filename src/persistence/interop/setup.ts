import { ipcMain } from "electron";

import { Persistence } from "../persist"

import { playerPrepareWorld, playerEnterWorld } from "./player"
import { placeArtifact } from "./place"
import { pushFromArtifact } from "./push"
import { pickupFromArtifact } from "./pickup"
import { leaveOfArtifact, gotoOfArtifact } from "./goto"

const supportedChannels = [
    "goto", "leave",
    "push",
    "position",
    "pickup", // also putdown
    "askForPlayer",
    "askForWorld",
]

export function interopSetup(P: Persistence) {
    for (let c of supportedChannels) {
        ipcMain.on(c, (event, args) => {
            console.log(`OUTEROP: ${c}`, args)
        } )
    } 

    ipcMain.on("askForWorld",  (event, args) => {
        playerPrepareWorld(P).then(data => { event.reply("world", data) });
    })
    ipcMain.on("askForPlayer", (event, args) => { playerEnterWorld(P) })
    
    ipcMain.on("position", (event, args) => { placeArtifact(P, args) })
    ipcMain.on("push",     (event, args) => { pushFromArtifact(P, args) });
    ipcMain.on("pickup",   (event, args) => { pickupFromArtifact(P, args) });
    ipcMain.on("leave",    (event, args) => { leaveOfArtifact(P, args) });
    ipcMain.on("goto",     (event, args) => { gotoOfArtifact(P, args) });

}
