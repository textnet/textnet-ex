import { ipcMain } from "electron";

import { Persistence } from "../persist"
import { getOwnerId } from "../identity"

import { enterWorld } from "./enter"
import { placeArtifact } from "./place"

const supportedChannels = [
    // "enter", "leave",
    // "pickup", "putdown",
    // "push",
    "position",
    // "place", "remove",

    "askToStart"
]

export function interopSetup(P: Persistence) {
    for (let c of supportedChannels) {
        ipcMain.on(c, (event, args) => {
            console.log(`OUTEROP: ${c}`, args)
        } )
    } 

    ipcMain.on("askToStart", (event, args) => {
        enterWorld(P).then(data => {event.reply("enter", data) });
    })
    
    ipcMain.on("position", (event, args) => {
        placeArtifact(P, args).then(data => { if (data) event.reply("position", data) });
    })

}
