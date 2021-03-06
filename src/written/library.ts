/**
 * Directory of all Written Word commands.
 */

import { get_artifacts, get_artifact, 
         get_myself, get_closest, get_next } from "./library/get"
import { update } from "./library/properties"
import { move_to, move_by, place_at, fit_at, halt } from "./library/spatial"
import { get_text, update_text, update_line, insert_line, delete_line } from "./library/text"
import { event_on, event_off } from "./library/events"
import { teleport } from "./library/teleport"

/**
 * Map of all commands currently supported in Written Word.
 * Read Written Word documentation.
 */
export const supportedFunctions = {
    "get_artifacts": { signature: ["world", "id", "name"], f: get_artifacts },
    "get_artifact":  { signature: ["world", "id", "name"], f: get_artifact  },
    "get_myself":    { signature: [],                      f: get_myself    },
    "get_next":      { signature: ["direction"],           f: get_next      },
    "get_closest":   { signature: ["name"],                f: get_closest   },

    "update":        { signature: false,                   f: update        },
    "self":          { signature: false,                   f: update        },

    "teleport":    { signature: ["artifact", "target", "target_id"    ], f: teleport    },

    "get_text":    { signature: ["artifact", "line", "anchor"         ], f: get_text    },
    "get_line":    { signature: ["artifact", "line", "anchor"         ], f: get_text    },
    "update_text": { signature: ["artifact", "text",                  ], f: update_text },
    "update_line": { signature: ["artifact", "line", "anchor", "text" ], f: update_line },
    "insert_line": { signature: ["artifact", "line", "anchor", "text" ], f: insert_line },
    "delete_line": { signature: ["artifact", "line", "anchor"         ], f: delete_line },

    "move_to":  { signature: ["artifact", "x", "y", "direction" ], f: move_to  },
    "move_by":  { signature: ["artifact", "x", "y", "direction", "distance" ], 
                                                                   f: move_by  },
    "turn_to":  { signature: ["artifact", "directon"            ], f: move_by  },
    "place_at": { signature: ["artifact", "x", "y", "direction" ], f: place_at },
    "fit_at":   { signature: ["artifact", "x", "y", "direction" ], f: fit_at },
    "halt":     { signature: ["artifact",                       ], f: halt },

    "on":  { signature: false, /* artifact, event, role, handler */ f: event_on }, 
    "off": { signature: ["artifact", "event", "role", "key"     ,], f: event_off },
}

export const supportedEvents = [ "timer", "move", 
                                 "pickup", "putdown", 
                                 "enter", "leave",
                                 "push", 
                                 "move_start", "move_stop",
                               ];
