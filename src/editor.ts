import * as jquery from "jquery";
import * as ex from "excalibur"
import { worldWidth } from "./universe/const"
import { visualBounds } from "./plane"
import { Game } from "./index"
import { ArtifactActor } from "./actor"
import { PlaneScene } from "./plane"
import * as ace from "brace"
import * as luaMode from "brace/mode/lua"

/**
 * TODO: REWRITE FROM SCRATCH!
 */


export interface Editor {
    focus() 
}


const fontSize      = "15px";
const prependRows   = 1000;
const rowHeight     = 16;

export function initEditor() {
    require('brace/mode/markdown');
    require('brace/mode/lua');
    require('brace/theme/monokai');
    
    jquery("body").append([
        "<style>body{padding:0; margin:0}</style>",
        "<div id=editor-wrapper style='width:"+worldWidth+"px; background:red'>&nbsp;",
        "<div id=editor style='position:absolute; top:10px; left:0; width:"+worldWidth+"px; bottom:0'>There \nis TXT\n code!</div>",
        "</div>"
        ].join(""));

    // let textarea;
    // jquery("textarea").each(function() { textarea = this; })
    // let editor = cm.fromTextArea(textarea, {
    //     lineNumbers: true
    // });
    // console.log(editor.getTextArea())
    //editor.focus()
    var editor = ace.edit('editor');
    editor.setFontSize(fontSize);
    editor.setOption("printMargin", false);
    editor.setOption("fixedWidthGutter", true);
    editor.getSession().setUseWrapMode(true);
    editor.getSession().setTabSize(4);
    editor.getSession().setUseSoftTabs(true);
    editor.getSession().setMode('ace/mode/markdown');
    let md = editor.session.getMode();
    console.log(md)
    // md.createModeDelegates({ lua: Mode });
    editor.setTheme('ace/theme/monokai');
    // editor.setReadOnly(true);
    console.log(editor);
    let s = "```lua\na=10\n```\n\n";
    editor.setValue(s)

    // editor.setValue("1102001\n1102001\n1102001\n1102001\n1102001\n1102001\n1102001\n")
    // editor.focus();
    // console.log(editor.getValue())
    // customizeEditor()
    // return editor as Editor;
}

export function customizeEditor() {
    let $textarea = jquery("#editor");
    let $wrapper = jquery("#editor-wrapper");
    let $canvas = jquery("canvas");
    // $wrapper.offset({ top: $canvas.offset().top, left: $canvas.offset().left })
    // $wrapper.css({
    //     paddingTop:   0,
    //     paddingLeft:  visualBounds.left,
    //     paddingRight: visualBounds.right,
    //     width: worldWidth,
    //     height: visualBounds.height,
    //     zIndex: 5,
    // })   
    // $canvas.css({
    //     zIndex: 10,
    //     position: "absolute",
    //     background: "none",
    //     display: "none"
    // })
}


export function adjustEditor($textarea, focus: ex.Vector) {
    // let home = visualBounds.height / 2 + visualBounds.margin;
    // let camera = focus.y;
    // let distance = camera-home;
    // distance += calculatePrepend($textarea);
    // if (distance - $textarea.scrollTop() != 0) {
    //     $textarea.scrollTop(distance)
    // }
}

function calculatePrepend($textarea) {
    // let rows = $textarea.data('prepend');
    // return rowHeight*rows;
}

