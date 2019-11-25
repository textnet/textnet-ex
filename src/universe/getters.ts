import { 
    Account, Avatar, Artifact, World, 
    Coordinates, Position, Dir,
} from "./interfaces"


export function getWorld(account: Account) {
    return account.avatar.body.coords.world;
}