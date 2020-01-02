import { ipcMain } from "electron";

import { Persistence } from "../persist"
import { getOwnerId } from "../identity"

import { playerPrepareWorld, playerEnterWorld } from "./player"
import { placeArtifact } from "./place"
import { pushFromArtifact } from "./push"
import { pickupFromArtifact } from "./pickup"

const supportedChannels = [
    // "enter", "leave",
    "push",
    "position",
    // "place", "remove",

    "pickup", // also putdown
    "askToStart",
    "askForPlayer",

]

export function interopSetup(P: Persistence) {
    for (let c of supportedChannels) {
        ipcMain.on(c, (event, args) => {
            console.log(`OUTEROP: ${c}`, args)
        } )
    } 

    ipcMain.on("askToStart", (event, args) => {
        playerPrepareWorld(P).then(data => { event.reply("world", data) });
    })
    ipcMain.on("askForPlayer", (event, args) => { playerEnterWorld(P) })
    
    ipcMain.on("position", (event, args) => { placeArtifact(P, args) })
    ipcMain.on("push", (event, args) => { pushFromArtifact(P, args) });
    ipcMain.on("pickup", (event, args) => { pickupFromArtifact(P, args) });

}
