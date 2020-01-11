// import * as jquery from "jquery";
// import * as $ from "jquery";
// import * as ex from "excalibur"
// import * as ace from "brace"

// import { visualBounds, worldWidth } from "../const"
// import { World } from "../interfaces"

// import { Game } from "./index"
// import { ArtifactActor } from "./actor"
// import { PlaneScene } from "./plane"
// import { updateWorldText } from "./manipulations"



// export const FORMATS = ["lua", "markdown", "text" ]

// export interface Editor extends ace.Editor {}

// const fontSize      = "15px";
// const prependRows   = 1000;
// const rowHeight     = 16;

// export function updateEditor(scene: PlaneScene) {
//     if (!scene.editor) return;
//     if (scene.editor.getValue() != scene.world.text) {
//         scene.editor.setValue(scene.world.text,-1) 
//     }
// }

// export function focusEditor(actor: ArtifactActor) {
//     updateEditor(actor.scene as PlaneScene);
//     const editor = (actor.scene as PlaneScene).editor;
//     // TODO: ser cursor position
//     editor.setReadOnly(false);
//     editor.setOption("showGutter", true);   
//     editor.renderer["$cursorLayer"].element.style.display = "block"
//     editor.focus();
//     $("canvas").css({  opacity: 0.2 })
//     $("#editor").css({ opacity: 1 })
//     $("#editor").find(".ace_gutter").css({ opacity: 1 })
// }
// export function blurEditor(editor) {
//     editor.setReadOnly(true);
//     editor.blur();
//     $("canvas").css({  opacity: 1 })
//     $("#editor").css({ opacity: 0.7, 
//         width: worldWidth+visualBounds.left+visualBounds.right, 
//     })
//     $("#editor").find(".ace_gutter").css({ opacity: 0 })
//     editor.renderer.$cursorLayer.element.style.display = "none"
// }

// export function initEditor(engine: Game) {
//     for (let format of FORMATS) {
//         require('brace/mode/'+format);    
//     }
//     require('brace/theme/monokai');
//     jquery("head").prepend([
//         '<meta name="viewport" content="width=500, initial-scale=2">'
//         ].join(""))
//     jquery("body").prepend([
//         "<div id=editor-wrapper>",
//         "<div id=editor></div>",
//         "</div>"
//         ].join(""));
//     customizeEditor()
//     var editor: Editor = ace.edit('editor');
//     editor.setFontSize(fontSize);
//     editor.setOption("printMargin", false);
//     editor.setOption("fixedWidthGutter", true);
//     editor.setOption("highlightActiveLine", false);

//     editor.getSession().setUseWrapMode(true);
//     editor.getSession().setTabSize(4);
//     editor.getSession().setUseSoftTabs(true);
//     function standup(editor: Editor) {
//         blurEditor(editor);
//         const world = (engine.currentScene as PlaneScene).world;
//         updateWorldText(world, editor.getValue(), true)
//         engine.start();
//     }
//     editor.commands.addCommand({
//         name: "textnetStandup",
//         bindKey: {win: 'Ctrl-Enter',  mac: 'Ctrl-Enter'},
//         exec: standup,
//         readOnly: false
//     });
//     editor.commands.addCommand({
//         name: "textnetStandup2",
//         bindKey: {win: 'Escape',  mac: 'Escape'},
//         exec: standup,
//         readOnly: false
//     });

//     editor.getSession().setMode('ace/mode/markdown');
//     editor.setTheme('ace/theme/monokai');
//     blurEditor(editor)
//     return editor as Editor;
// }

// export function customizeEditor() {
//     $("body").css({ padding: 0, margin: 0, background:"#24251F" });
//     $("#editor").css({
//         zIndex: 1000,
//         width: worldWidth+visualBounds.left+visualBounds.right,
//         left: 0,
//         top: 24, // TODO: labelHeight
//         bottom: 0,
//         position:"absolute"
//     })
//     $("#wrapper").css({
//         left:0, right:0, top: 0, bottom: 0,
//         position: "absolute"
//     })
//     $("canvas").css({
//         zIndex: 1000,
//         position: "absolute",
//     })
// }


// export function adjustEditorFocus(editor: Editor, focus: ex.Vector) {
//     let home = visualBounds.height / 2 + visualBounds.margin;
//     let camera = focus.y;
//     let distance = camera-home;
//     distance += visualBounds.margin;
//     if (distance - editor["renderer"].getScrollTop() != 0) {
//         editor["renderer"].scrollToY(distance)
//     }
// }

