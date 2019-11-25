import {
    Position, Dir, Coordinates,
    Artifact, World, Avatar, AvatarKind,
    Account
} from "./interfaces"
import { numerate, cpPosition, cpCoords } from "./utils"
import {
    enterWorld,
    placeArtifact
} from "./manipulations"
import { spawnPosition, DIR } from "./const"


export function createArtifact(name:string, spriteName:string, coords?:Coordinates) {
    let artifact: Artifact = {
        id: numerate("artifact"),
        name: name,
        spriteName: spriteName,
        worlds: [],
        coords: coords,
    }
    let world: World = {
        id: numerate("world"),
        owner: artifact,
        artifacts: {},
    }
    artifact.worlds.push(world)
    return artifact;
}

export function createPlayerAvatar(name:string, spriteName:string) {
    let avatar: Avatar = {
        id: numerate("avatar"),
        body: createArtifact(name, spriteName),
        kind: AvatarKind.PLAYER,
        visits: {},
        visitsStack: []
    }
    avatar.body.avatar = avatar;
    enterWorld(avatar, avatar.body.worlds[0])
    return avatar;
}

export function createAccount(name, spriteName) {
    let world: Account = { 
        id: numerate("account"),
        avatar: createPlayerAvatar(name, spriteName),
    }
    let chair: Artifact = createArtifact('chair', 'chair');
    placeArtifact(chair, {
        position: { x:100, y:100, dir: DIR.DOWN },
        world:    world.avatar.body.worlds[0]
    })
    return world;
}



