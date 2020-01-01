import { ipcRenderer } from "electron";

import { Game } from "../game"

import { enterWorld } from "./enter"
import { positionArtifact } from "./position"


export function interopSetup(game: Game) {

    // switching world
    ipcRenderer.on("enter", (event, args) => { enterWorld(game, args) });

    // artifacts are moving 
    ipcRenderer.on("position", (event, args) => { positionArtifact(game, args) });


}


