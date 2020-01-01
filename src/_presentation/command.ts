// import * as ex from "excalibur";

// import { Dir } from "../universe/interfaces"
// import { DIR, COMMAND } from "../universe/const"
// import { deepCopy } from "../universe/utils"

// import { Game } from "./index";

// /**
//  * Module that interprets input from the player and converts it
//  * into commands that will be taking into account by ArtifactActor.
//  *
//  * Moved into a separate file to provide more observability.
//  */


// /**
//  * Returns a direction of the player input.
//  * E.g. if player tries to move right, returns `DIR.LEFT` copy.
//  * Returns DIR.NONE if there is no input that defines direction.
//  * @param {Game} game - Excalibur engine
//  */
// export function getPlayerDirection(game: Game) {
//     let result: Dir = deepCopy(DIR.NONE)
//     // keys
//     if (game.input.keyboard.isHeld(ex.Input.Keys.Left))  {
//         result.x = -1;
//         result.name = DIR.LEFT.name;
//     }
//     if (game.input.keyboard.isHeld(ex.Input.Keys.Right)) {
//         result.x = +1;
//         result.name = DIR.RIGHT.name;
//     }
//     if (game.input.keyboard.isHeld(ex.Input.Keys.Up))    {
//         result.y = -1;
//         result.name = DIR.UP.name;
//     }
//     if (game.input.keyboard.isHeld(ex.Input.Keys.Down))  {
//         result.y = +1;
//         result.name = DIR.DOWN.name;
//     }
//     // No direction: return
//     if (result.name == DIR.NONE.name) return result;
//     // Normalise direction
//     let dist = Math.sqrt(result.x*result.x + result.y*result.y);
//     result.x = result.x / dist;
//     result.y = result.y / dist;
//     return result;
// }

// /**
//  * Internal mapping of command keys.
//  */
// const KEY = {
//     ENTER:   17, // CTRL=17 (alt=18)
//     PICKUP:  18, // 
//     LEAVE:   ex.Input.Keys.Esc,
//     PUSH:    ex.Input.Keys.Shift,
//     TEXT:    13,
// }

// /**
//  * Returns the command that player is trying to give.
//  * E.g. COMMAND.ENTER to enter an artifact nearby.
//  * Some of the commands require also direction to be provided.
//  *
//  * Doesn't check if the command could be possibly executed,
//  * it merely recognises the intent.
//  *
//  * @param {Game} game - Excalibur engine
//  */
// export function getPlayerCommand(game: Game) {
//     let dir = getPlayerDirection(game)
//     // ENTER
//     if (game.input.keyboard.isHeld(KEY.ENTER) && dir.name != DIR.NONE.name)
//         return COMMAND.ENTER;
//     // LEAVE
//     if (game.input.keyboard.isHeld(KEY.LEAVE))
//         return COMMAND.LEAVE;
//     // PUSH
//     if (game.input.keyboard.isHeld(KEY.PUSH) && dir.name != DIR.NONE.name) 
//         return COMMAND.PUSH;
//     // PICKUP/PUTDOWN
//     if (game.input.keyboard.isHeld(KEY.PICKUP) && dir.name != DIR.NONE.name) 
//         return COMMAND.PICKUP;
//     // KNEEL
//     if (game.input.keyboard.isHeld(KEY.ENTER) && dir.name == DIR.NONE.name &&
//         game.input.keyboard.isHeld(KEY.TEXT)) 
//         return COMMAND.KNEEL;
//     // TODO: STAND
//     // ----
//     return COMMAND.NONE
// }

