import { Dir, Position, Artifact, World } from "../../universe/interfaces";
import { PersistenceObserver } from "./observer"
import { numerate, normalizeDir, lengthDir } from "../../universe/utils"
import { DIR, DIRfrom } from "../../universe/const"
import * as mutatePlace from "../mutate/place"


export enum ObserverCommand {
    None = "None",
    Move = "Move",
}

const observerSpeed     = 0.01;
const observerThreshold = 0.01;
const observerInterval =  10; // ms

export interface MoveEvent {
    artifact: string;
    x: number;
    y: number;
    dir: string;
}

export async function moveAction(O: PersistenceObserver, event: MoveEvent) {
    const P = O.P;
    return async function() {
        const artifactId = event.artifact;
        const artifact  = await P.artifacts.load(artifactId);
        const hostWorld = await P.worlds.load(artifact.hostId);
        const pos = hostWorld.artifactPositions[artifact.id]
        const stepSize  = artifact.speed * observerSpeed;
        let delta: Dir = {
            x: event.x-pos.x,
            y: event.y-pos.y,
            name: DIR.NONE.name,
        };
        if (lengthDir(delta) > stepSize) {
            delta = normalizeDir({
                x: event.x-pos.x,
                y: event.y-pos.y,
                name: DIR.NONE.name,
            }, stepSize);
        }
        const newPos: Position = {
            x: pos.x+delta.x,
            y: pos.y+delta.y,
            dir: delta,
        }
        if (event.dir && event.dir != DIR.NONE.name) {
            newPos.dir = DIRfrom({x:0, y:0, name: event.dir});
        }
        if (lengthDir(delta) >= observerThreshold) {
            const success = await mutatePlace.place(P, artifact, hostWorld, newPos);
            return;
        }
        return ObserverCommand.Move;
    }
}
