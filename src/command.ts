import * as ex from "excalibur";
import { Game } from "./index";
import { Dir } from "./universe/interfaces"
import { DIR, COMMAND } from "./universe/const"
import { deepCopy } from "./universe/utils"


export function getPlayerDirection(game: Game) {
    let result: Dir = deepCopy(DIR.NONE)
    // keys
    if (game.input.keyboard.isHeld(ex.Input.Keys.Left))  {
        result.x = -1;
        result.name = DIR.LEFT.name;
    }
    if (game.input.keyboard.isHeld(ex.Input.Keys.Right)) {
        result.x = +1;
        result.name = DIR.RIGHT.name;
    }
    if (game.input.keyboard.isHeld(ex.Input.Keys.Up))    {
        result.y = -1;
        result.name = DIR.UP.name;
    }
    if (game.input.keyboard.isHeld(ex.Input.Keys.Down))  {
        result.y = +1;
        result.name = DIR.DOWN.name;
    }
    // No direction: return
    if (result.name == DIR.NONE.name) return result;
    // Normalise direction
    let dist = Math.sqrt(result.x*result.x + result.y*result.y);
    result.x = result.x / dist;
    result.y = result.y / dist;
    return result;
}

const KEY = {
    ENTER:   17, // CTRL=17 (alt=18)
    LEAVE:   ex.Input.Keys.Esc,
    PUSH:    ex.Input.Keys.Shift,
}
export function getPlayerCommand(game: Game) {
    let dir = getPlayerDirection(game)
    // ENTER
    if (game.input.keyboard.isHeld(KEY.ENTER) && dir.name != DIR.NONE.name)
        return COMMAND.ENTER;
    // LEAVE
    if (game.input.keyboard.isHeld(KEY.LEAVE))
        return COMMAND.LEAVE;
    // PUSH
    if (game.input.keyboard.isHeld(KEY.PUSH) && dir.name != DIR.NONE.name) 
        return COMMAND.PUSH;
    // TODO: PICKUP
    // TODO: PUTDOWN
    // TODO: KNEEL
    // TODO: STAND
    // ----
    return COMMAND.NONE
}

