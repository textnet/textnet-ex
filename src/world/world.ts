let _num = 0;
function numerate(prefix: string) { return prefix+":"+(++_num) }

class Map {}

enum SoulType { PLAYER, PROXY, MIND, EMPTY }

// Soul: anything that can control avatars
// - PLAYER = controlled by keypad
// - PROXY  = controlled remotely (either player or mind)
// - MIND   = local programmed mind
interface Soul {
  type: SoulType;
  avatar: Avatar;
}

class EmptySoul implements Soul {
  type: SoulType = SoulType.EMPTY
  avatar: Avatar; 
}

export class Player implements Soul {
  type: SoulType = SoulType.PLAYER
  avatar: Avatar; 
  account: Account;
  constructor() {
  }
  bind(account) {
    this.account = account;
    this.account.avatar.bind(this);
  }
}

// account: information of the user. e.g. name; also storage for the Realm?
export class Account {
  name: string; // readable name
  uid:  string; // unique player id (TBD figure out)
  avatar: Avatar;

  constructor(name: string, uid:string) {
    this.name = name;
    this.uid  = uid;
  }
  spawn() {
    this.avatar = new Avatar();
    this.avatar.enter(this.avatar);
  }
}

class Position {
  x: number;
  y: number;
}
const spawnPosition: Position = {x:0, y:0};

export class Avatar {
  soul: Soul;
  artifact: Artifact;
  planes: Plane[];
  visits: Map;
  uid: string;

  constructor() {
    this.soul = new EmptySoul();    
    this.artifact = new Artifact();
    this.planes = [];
    this.visits = {};
    this.uid = numerate("avatar");
  }
  bind(soul: Soul) {
    this.soul = soul;
    this.soul.avatar = this;
  }
  enter(to: Avatar) {
    let plane = to.getPlane();
    if (!(plane.uid in this.visits)) {
      this.visits[plane.uid] = plane.getSpawnPosition();
    } 
    this.artifact.detach();
    this.artifact.attach(plane, this.visits[plane.uid]);
  }
  leave() {
    this.enter(this.artifact.plane.owner);
  }
  getPlane() {
    if (this.planes.length == 0) {
      this.planes[0] = new Plane(this);
    } 
    return this.planes[0];
  }
}

export class Plane {
  owner: Avatar;
  uid: string;
  spawnPosition: Position = { x:0, y: 0 };
  artifacts: Map;
  constructor(owner: Avatar) {
    this.uid = numerate("plane")
    this.owner = owner;
    this.artifacts = {};
  }
  getSpawnPosition() {
    return this.spawnPosition;
  }
  deregister(artifact: Artifact) {
    if (artifact.uid in this.artifacts) 
      this.artifacts[artifact.uid] = null;
  }
  register(artifact: Artifact, pos: Position) {
    // TODO: find nearest non-colliding spot
    artifact.plane = this;
    this.artifacts[artifact.uid] = {
      artifact: artifact,
      position: pos
    }
  }
}

export class Artifact {
  uid: string;
  plane: Plane;
  constructor() {
    this.uid = numerate("artifact")
  }
  // convenience functions
  detach() {
    if (this.plane) this.plane.deregister(this)
  }
  attach(plane, position) {
    plane.register(this, position);
  }
}


// temporary: creates a brand new world;
export function tempSetup() {
  let account = new Account('Ni', "player:makiwara");
  account.spawn();
  let player = new Player();
  player.bind(account);
  console.log(player)
  return player;
}



