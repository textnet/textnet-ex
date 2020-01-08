import { Dir, Position, Artifact, World } from "../../universe/interfaces";
import { PersistenceObserver } from "./observer"
import { numerate, normalizeDir, lengthDir } from "../../universe/utils"
import { DIR, DIRfrom } from "../../universe/const"
import * as mutatePlace from "../mutate/place"


export enum ObserverCommand {
    None = "None",
    Move = "Move",
}
export enum ObserverEventType {
    Timer = "timer",
}

export const observerSpeed     = 0.01;
export const observerInterval  =  10; // ms
export const observerThreshold = 0.1;

export interface MoveEvent {
    artifact: string;
    x: number;
    y: number;
    dir: string;
}

export interface TimeEvent {
    delta: number;
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
        
        if (lengthDir(delta) <= observerThreshold) {
            return ObserverCommand.None;
        } else {
            const success = await mutatePlace.place(P, artifact, hostWorld, newPos);
            return ObserverCommand.Move;    
        }
        
    }
}
