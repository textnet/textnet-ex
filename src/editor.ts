import * as jquery from "jquery";
import * as ex from "excalibur"
import { worldWidth } from "./universe/const"
import { visualBounds } from "./plane"
import { Game } from "./index"
import { ArtifactActor } from "./actor"
import { PlaneScene } from "./plane"

/**
 * TODO: REWRITE FROM SCRATCH!
 */



const prependRows   = 1000;
const rowHeight     = 16;

export function initEditor() {
    let $textarea = jquery("textarea#editor");
    if ($textarea.length == 0) {
        jquery("head").append('<link href="https://fonts.googleapis.com/css?family=Nanum Gothic Coding&display=swap" rel="stylesheet">');
        jquery("body").append([
            "<style>",
            "body {padding:0; margin:0; background:#888888}",
            "#editor-wrapper { position:absolute; left:0; top:0 } ",
            "textarea { display: none} ",
            "textarea#editor { border:0; padding: 0;",
                "resize:none; outline:none; margin:0; display:block; ",
                "font-family: Nanum Gothic Coding, monospace; ",
                "line-height: "+rowHeight+"px; ",
                "font-size: "+rowHeight+"px;   ",
                "letter-spacing: 0; ",
                "overflow: hidden;  ",
                "background: rgba(0,0,0,0); color:#ffffff }",
            "</style>",
            "<div id=editor-wrapper><textarea id=editor>There is TXT code!</textarea></div>"
            ].join(""));
        $textarea = jquery("textarea#editor");
    }
    let $wrapper = jquery("#editor-wrapper");
    let $canvas = jquery("canvas");
    $wrapper.offset({ top: $canvas.offset().top, left: $canvas.offset().left })
    $wrapper.css({
        paddingTop:   0,
        paddingLeft:  visualBounds.left,
        paddingRight: visualBounds.right,
        zIndex: 5,
    })
    $canvas.css({
        zIndex: 10,
        position: "absolute",
        background: "none",
    })
    $textarea.css({
        width: worldWidth,
        height: visualBounds.height + 2*visualBounds.margin,
    })
    let line = "";
    for (let i=0; i<prependRows*2; i++) {
        line+="------------------------ "+(i-prependRows);
        line+="\n";
    }
    $textarea.val(line)
    $textarea.data("prepend", prependRows)
    return $textarea;
}


export function adjustEditor($textarea, focus: ex.Vector) {
    let home = visualBounds.height / 2 + visualBounds.margin;
    let camera = focus.y;
    let distance = camera-home;
    distance += calculatePrepend($textarea);
    if (distance - $textarea.scrollTop() != 0) {
        $textarea.scrollTop(distance)
    }
}

function calculatePrepend($textarea) {
    let rows = $textarea.data('prepend');
    return rowHeight*rows;
}

