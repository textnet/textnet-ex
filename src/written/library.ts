
import { get_artifacts, get_artifact, 
         get_myself, get_closest, get_next } from "./library/get"
import { update } from "./library/properties"
import { move_to, move_by, place_at, fit_at } from "./library/spatial"

export const supportedFunctions = {

    "get_artifacts": { signature: ["world", "id", "name"], f: get_artifacts },
    "get_artifact":  { signature: ["world", "id", "name"], f: get_artifact  },
    "get_myself":    { signature: [],                      f: get_myself    },
    "get_next":      { signature: ["direction"],           f: get_next      },
    "get_closest":   { signature: ["name"],                f: get_closest   },

    "update":        { signature: false,                   f: update        },
    "self":          { signature: false,                   f: update        },

//     "get_text":    { signature: ["artifact", "line", "anchor"         ], f: get_text    },
//     "update_text": { signature: ["artifact", "text",                  ], f: update_text },
//     "update_line": { signature: ["artifact", "line", "anchor", "text" ], f: update_line },
//     "insert_line": { signature: ["artifact", "line", "anchor", "text" ], f: insert_line },
//     "delete_line": { signature: ["artifact", "line", "anchor"         ], f: delete_line },

    "move_to":  { signature: ["artifact", "x", "y", "direction" ], f: move_to  },
    "move_by":  { signature: ["artifact", "x", "y", "direction", "distance" ], 
                                                                   f: move_by  },
    "turn_to":  { signature: ["artifact", "directon"            ], f: move_by  },
    "place_at": { signature: ["artifact", "x", "y", "direction" ], f: place_at },
    "fit_at":   { signature: ["artifact", "x", "y", "direction" ], f: fit_at },

//     "on":  { signature: false, f: event_on }, // artifact, event, handler
//     "off": { signature: ["artifact", "event", "key",     ], f: event_off },
}
