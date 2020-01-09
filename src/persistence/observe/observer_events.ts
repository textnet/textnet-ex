import { Dir, Position, Artifact, World } from "../../universe/interfaces";
import { PersistenceObserver } from "./observer"
import { numerate, normalizeDir, lengthDir } from "../../universe/utils"
import { DIR, DIRfrom } from "../../universe/const"
import * as mutatePlace from "../mutate/place"


export enum ObserverCommand {
    Next = "->",
    None = "None",
    Move = "Move",
    Place = "Place",
    Halt = "Halt",
}


export const observerSpeed     = 0.01;
export const observerInterval  =  10; // ms
export const observerThreshold = 0.1;

export interface MoveEvent {
    artifact: string;
    x: number;
    y: number;
    dir: string;
    isDelta: boolean;
}

export interface PlaceEvent {
    artifact: string;
    x: number;
    y: number;
    dir: string;
    isFit: boolean;
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
        if (event.isDelta) {
            event.isDelta = false;
            event.x = pos.x+event.x;
            event.y = pos.y+event.y;
        }
        let delta: Dir = {
            x: event.x-pos.x,
            y: event.y-pos.y,
            name: DIR.NONE.name,
        };
        let newPos: Position;
        if (lengthDir(delta) > stepSize) {
            delta = normalizeDir({
                x: event.x-pos.x,
                y: event.y-pos.y,
                name: DIR.NONE.name,
            }, stepSize);
        }
        newPos = {
            x: pos.x+delta.x,
            y: pos.y+delta.y,
            dir: delta,
        }
        if (event.dir && event.dir != DIR.NONE.name) {
            newPos.dir = DIRfrom({x:0, y:0, name: event.dir});
        }
        if (lengthDir(delta) > observerThreshold) {
            const success = await mutatePlace.place(P, artifact, hostWorld, newPos);
            return true; // repeat
        }
    }
}

export async function placeAction(O: PersistenceObserver, event: PlaceEvent) {
    const P = O.P;
    return async function() {
        const artifactId = event.artifact;
        const artifact  = await P.artifacts.load(artifactId);
        const hostWorld = await P.worlds.load(artifact.hostId);
        const newPos: Position = {
            x: event.x,
            y: event.y,
            dir: DIRfrom({x:0, y:0, name: event.dir})
        }
        if (event.isFit) {
            await mutatePlace.place(P, artifact, hostWorld, newPos);
        } else {
            await mutatePlace.fit(P, artifact, hostWorld, newPos);
        }
    }
}
