import { ipcRenderer } from "electron";

import { Game } from "../game"

import { prepareWorld     } from "./world"
import { positionArtifact } from "./position"
import { enterArtifact, leaveArtifact } from "./enter"
import { inventoryArtifact } from "./inventory"


export function interopSetup(game: Game) {

    // preparing new world to render
    ipcRenderer.on("world", (event, args) => { prepareWorld(game, args) });

    // artifacts are moving, entering world, leaving it
    ipcRenderer.on("position", (event, args) => { positionArtifact(game, args) });
    ipcRenderer.on("enter",    (event, args) => { enterArtifact(game, args) });
    ipcRenderer.on("leave",    (event, args) => { leaveArtifact(game, args) });
    ipcRenderer.on("inventory",(event, args) => { inventoryArtifact(game, args) });

}


