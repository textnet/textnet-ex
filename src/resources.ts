import * as ex from 'excalibur';

enum SpriteType { STATIC, TURNING, MOVING }
const states: string[] = [
	"idle:left", "idle:right", "idle:up", "idle:down",
	"move:left", "move:right", "move:up", "move:down",
]
const spriteSequence:string[] = ['up', 'left', 'down', 'right']
const spriteSpeed:number = 60;
class Sprite {
	file: string;
	size: [64,64]; // sprite size;
	body: { size: [64,64], offset: [0,0] };
	type: SpriteType = SpriteType.STATIC;
	animated: boolean = false;
	move: ex.SpriteSheet;
	idle: ex.SpriteSheet;
	cols: number = 1;
	rows: number = 1;
	animations: Record<string, ex.Animation>;
	constructor(params) {
		if (params.type)     this.type = params.type;
		if (params.size)     this.size = params.size;
		if (params.body)     this.body = params.body;
		if (params.animated) this.animated = params.animated;
		if (this.type != SpriteType.STATIC) this.rows = 4;
		if (this.type == SpriteType.MOVING) this.cols = 9;
		this.file = params.file;
	}
	load(loader: ex.Loader) {
		const spriteFile  = new ex.Texture(
			require("./sprites/" + this.file + ".png")
			);
		loader.addResource(spriteFile);
		this.move = new ex.SpriteSheet(spriteFile, 
				this.cols, this.rows, this.size[0], this.size[1]);
		if (this.animated) {
			const idleSpriteFile = new ex.Texture(
				require("./sprites/" + this.file + "_idle.png")
				);
			loader.addResource(idleSpriteFile);
			this.idle = new ex.SpriteSheet(idleSpriteFile, 
				this.cols, this.rows, this.size[0], this.size[1]);
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
				if (sheetName == "idle" && !this.animated) {
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

// TBD autopickup?
const sprites : Sprite[] = [
	new Sprite({
		file: '_',
		type: SpriteType.STATIC,
		size: [64,64],
		body: { size: [32,32], offset: [8,-8] }
		}),
	new Sprite({
		file: 'human_professor',
		type: SpriteType.MOVING,
		size: [64,64],
		body: { size: [30,20], offset: [-5,-15] }
		}),
	new Sprite({
		file: 'human_fbi',
		type: SpriteType.MOVING,
		size: [64,64],
		body: { size: [30,20], offset: [-5,-15] }
		}),
	new Sprite({
		file: 'tree',
		size: [64,80],
		body: { size: [32,20], offset: [0,-30] }
		}),
	new Sprite({
		file: 'chair',
		size: [32,64],
		body: { size: [25,21], offset: [0,-12] }
		}),
]

let spritesMap : Record<string, Sprite> = {}
const loader = new ex.Loader();
loader.suppressPlayButton = true;
for (let s of sprites) {
	s.load(loader);
	spritesMap[s.file] = s;
}
// console.log(spritesMap)

function getSprite(key) {
	if (spritesMap[key]) return spritesMap[key];
	else return sprites[0];
}


export { 
	SpriteType,
	Sprite,
	getSprite,
	loader, 
	spriteSpeed
}

