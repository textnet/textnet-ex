import { ipcMain } from "electron";

import { Persistence } from "../persist"
import { getOwnerId } from "../identity"

import { playerPrepareWorld, playerEnterWorld } from "./player"
import { placeArtifact } from "./place"

const supportedChannels = [
    // "enter", "leave",
    // "pickup", "putdown",
    // "push",
    "position",
    // "place", "remove",

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

    ipcMain.on("askForPlayer", (event, args) => {
        playerEnterWorld(P).then(data => {});
    })
    
    ipcMain.on("position", (event, args) => {
        placeArtifact(P, args).then(data => {});
    })

}
