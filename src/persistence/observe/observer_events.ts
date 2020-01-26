import { Dir, Position, Artifact, World } from "../../interfaces";
import { PersistenceObserver } from "./observer"
import { normalizeDir, lengthDir } from "../../utils"
import { DIR, DIRfrom } from "../../const"
import * as mutatePlace from "../mutate/place"


// TODO should be renamed/refactored into `observer_commands`

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

export interface MoveCommand {
    artifact: string;
    x: number;
    y: number;
    dir: string;
    isDelta: boolean;
}

export interface HaltCommand {
    artifact: string;
}

export interface PlaceCommand {
    artifact: string;
    x: number;
    y: number;
    dir: string;
    isFit: boolean;
}

export interface TimeEvent {
    delta: number;
}

export async function moveAction(O: PersistenceObserver, command: MoveCommand) {
    const P = O.P;
    return async function() {
        const artifactId = command.artifact;
        const artifact  = await P.artifacts.load(artifactId);
        const hostWorld = await P.worlds.load(artifact.hostId);
        const pos = hostWorld.artifactPositions[artifact.id]
        const stepSize  = artifact.speed * observerSpeed;
        if (command.isDelta) {
            command.isDelta = false;
            command.x = pos.x+command.x;
            command.y = pos.y+command.y;
        }
        let delta: Dir = {
            x: command.x-pos.x,
            y: command.y-pos.y,
            name: DIR.NONE.name,
        };
        let newPos: Position;
        if (lengthDir(delta) > stepSize) {
            delta = normalizeDir({
                x: command.x-pos.x,
                y: command.y-pos.y,
                name: DIR.NONE.name,
            }, stepSize);
        }
        newPos = {
            x: pos.x+delta.x,
            y: pos.y+delta.y,
            dir: delta,
        }
        if (command.dir && command.dir != DIR.NONE.name) {
            newPos.dir = DIRfrom({x:0, y:0, name: command.dir});
        }
        if (lengthDir(delta) > observerThreshold) {
            const success = await mutatePlace.place(P, artifact, hostWorld, newPos);
            return true; // repeat
        } else {
            // stop?
        }
    }
}

export async function haltAction(O: PersistenceObserver, command: PlaceCommand) {
    const P = O.P;
    return async function() {
        const artifactId = command.artifact;
        const artifact  = await P.artifacts.load(artifactId);
        const hostWorld = await P.worlds.load(artifact.hostId);
        const newPos: Position = {
            x: command.x,
            y: command.y,
            dir: DIRfrom({x:0, y:0, name: command.dir})
        }
        if (!command.isFit) {
            await mutatePlace.place(P, artifact, hostWorld, newPos);
        } else {
            await mutatePlace.fit(P, artifact, hostWorld, newPos);
        }
    }
}

export async function placeAction(O: PersistenceObserver, command: PlaceCommand) {
    const P = O.P;
    return async function() {
        const artifactId = command.artifact;
        const artifact  = await P.artifacts.load(artifactId);
        const hostWorld = await P.worlds.load(artifact.hostId);
        const newPos: Position = {
            x: command.x,
            y: command.y,
            dir: DIRfrom({x:0, y:0, name: command.dir})
        }
        if (!command.isFit) {
            await mutatePlace.place(P, artifact, hostWorld, newPos);
        } else {
            await mutatePlace.fit(P, artifact, hostWorld, newPos);
        }
    }
}
