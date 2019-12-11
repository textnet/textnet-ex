import { Artifact } from "./universe/interfaces"
import * as ex from 'excalibur';

const states: string[] = [
    "idle:left", "idle:right", "idle:up", "idle:down",
    "move:left", "move:right", "move:up", "move:down",
]
const spriteSequence:string[] = ['up', 'left', 'down', 'right']
const spriteSpeed:number = 60;

export class ArtifactSprite {
    artifact: Artifact;
    move: ex.SpriteSheet;
    idle: ex.SpriteSheet;
    cols: number = 1;
    rows: number = 1;
    animations: Record<string, ex.Animation>;
    constructor(artifact: Artifact) {
        let that = this;
        this.artifact = artifact;
        if (artifact.sprite.moving)  this.cols = 9;
        if (artifact.sprite.turning) this.rows = 4;

        let mainTexture = new ex.Texture("");
        mainTexture.setData(b64toBlob(artifact.sprite.base64, "image/png"))
        mainTexture.load()
        this.move = new ex.SpriteSheet(mainTexture, 
                this.cols, this.rows, 
                this.artifact.sprite.size[0], this.artifact.sprite.size[1]);
        if (this.artifact.sprite.idleBase64 != "") {
            let idleTexture = new ex.Texture("");
            idleTexture.setData(b64toBlob(artifact.sprite.idleBase64, "image/png"))
            idleTexture.load()
            this.move = new ex.SpriteSheet(idleTexture, 
                    this.cols, this.rows, 
                    this.artifact.sprite.size[0], this.artifact.sprite.size[1]);

        } else {
            this.idle = this.move;
        }
    }
    makeAnimations(engine: ex.Engine) {
        // create all animations
        this.animations = {};
        for (let sheetName of ["idle", "move"]) {
            var idx=0;
            for (let i of spriteSequence) {
                let start = idx*this.cols;
                let end = start+this.cols;
                idx++;
                this.animations[sheetName+":"+i]=
                    this[sheetName].getAnimationBetween( 
                        engine,
                        start, end,
                        spriteSpeed
                    );
                if (sheetName == "idle" && this.artifact.sprite.idleBase64 == "") {
                    this.animations[sheetName+":"+i].loop = false;
                    this.animations[sheetName+":"+i].speed = 100000;
                }
            }
        }        
    }
    animation(name:string) {
        return this.animations[name];
    }
}


// --------- helper function to work with blobs ----------
const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
}