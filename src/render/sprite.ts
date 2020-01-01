import * as ex from 'excalibur';

import { b64toBlob } from "../universe/utils"

import { BaseActor } from "./actors/base"
import { ArtifactStructure } from "./data_structures"
import { Game } from "./game"

/** 
 * Module for sprite rendering.
 * Uses `sprite` part of the Artifact structure to create Excalibur sprites.
 */

/**
 * Recognised names for animations: move/idle and 4 directions
 */
const states: string[] = [
    "idle:left", "idle:right", "idle:up", "idle:down",
    "move:left", "move:right", "move:up", "move:down",
]

/**
 * Sequence of directions in the sprite image.
 */
const spriteSequence:string[] = ['up', 'left', 'down', 'right'];

/**
 * Speed of the sprite animation.
 */
const spriteSpeed:number = 60;

/**
 * Helper class that embed all animations generated for the artifact.
 */
export class ArtifactSprite {
    artifact: ArtifactStructure;
    move: ex.SpriteSheet;
    idle: ex.SpriteSheet;
    cols: number = 1;
    rows: number = 1;
    animations: Record<string, ex.Animation>;

    /**
     * Build the helper from the artifact.
     */
    constructor(artifact: ArtifactStructure) {
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

    /**
     * Make 'mode/idle' animations out of the artifact structure.
     * Used internally, don't call separately!
     */
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

    /**
     * Get Excalibur-format animation by the states.
     * Direction is always provided, even if the sprite is not movable/turnable.
     * @param {string} name - e.g. 'move:right' or 'idle:up'
     */
    animation(name:string) {
        return this.animations[name];
    }
}

