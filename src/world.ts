let _num = 0;
function numerate(prefix: string) { return prefix+":"+(++_num) }

interface Dir {
    name: string;
    angle: number;
    x: number;
    y: number;
}
const Direction = {
    UP:    {name:"up", angle:0, x:0, y:-1},
    DOWN:  {name:"down", angle:0, x:0, y:1},
    LEFT:  {name:"left", angle:0, x:-1, y:0},
    RIGHT: {name:"right", angle:0, x:1, y:0},
}
const planeWidth = 1000; // add some visual bounds



interface Position {
  x: number;
  y: number;
  dir: Dir;
}
const spawnPosition: Position = {x:50, y:50, dir:Direction.DOWN};

export {
  Dir,
  Direction,
  Position,
  spawnPosition,
  planeWidth,
}

