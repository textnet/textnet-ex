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

// Key map reminder
// 17=Ctrl, 18=Alt,
const KEY = {
    CTRL: 17,
    ALT:  18,
    ESC:  ex.Input.Keys.Esc,
}
export function getPlayerCommand(game: Game) {
    let dir = getPlayerDirection(game)
    // ENTER
    if (game.input.keyboard.isHeld(KEY.CTRL) && dir.name != DIR.NONE.name)
        return COMMAND.ENTER;
    // LEAVE
    if (game.input.keyboard.isHeld(KEY.ESC))
        return COMMAND.LEAVE;
    // TODO: KNEEL
    // TODO: STAND
    // TODO: PICKUP
    // TODO: PUTDOWN
    // TODO: PUSH
    return COMMAND.NONE
}

