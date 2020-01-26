/**
 * Routing of the INTEROP events between renderer <=> main processes.
 */
import { ipcRenderer } from "electron";

import { Game                         } from "../game"
import { prepareWorld, updateText     } from "./world"
import { positionArtifact             } from "./position"
import { enterArtifact, leaveArtifact } from "./enter"
import { inventoryArtifact            } from "./inventory"
import { propertiesArtifact, propertiesWorld } from "./properties"
import { startMovingArtifact, stopMovingArtifact } from "./dynamics"

/**
 * Set up all event listeners.
 */
export function interopSetup(game: Game) {
    ipcRenderer.on("world",      (event, args) => { prepareWorld       (game, args) });
    ipcRenderer.on("position",   (event, args) => { positionArtifact   (game, args) });
    ipcRenderer.on("enter",      (event, args) => { enterArtifact      (game, args) });
    ipcRenderer.on("leave",      (event, args) => { leaveArtifact      (game, args) });
    ipcRenderer.on("inventory",  (event, args) => { inventoryArtifact  (game, args) });
    ipcRenderer.on("text",       (event, args) => { updateText         (game, args) });
    ipcRenderer.on("properties", (event, args) => { propertiesArtifact (game, args) });
    ipcRenderer.on("environment",(event, args) => { propertiesWorld    (game, args) });

    ipcRenderer.on("startMoving",(event, args) => { startMovingArtifact(game, args) });
    ipcRenderer.on("stopMoving", (event, args) => { stopMovingArtifact (game, args) });
}
