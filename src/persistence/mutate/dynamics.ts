// not changing the persistence, but reflecting its dynamics:
// all those quasi-mutations are about subjects doing something.
// - something starts to move
// - something stops
// - something is *pushed* by someone

import { Persistence } from "../persist"
import { Artifact, World } from "../../interfaces"
import { worldPush, worldStartMoving, worldStopMoving } from "./local/world";

export async function push(P: Persistence,
                      artifact: Artifact, obj: Artifact) {
    const hostWorld = await P.worlds.load(obj.hostId);
    await worldPush(P, hostWorld, artifact.id, obj.id);
}

export async function startMoving(P: Persistence, artifact: Artifact, subject: Artifact) {
    if (artifact.hostId) {
        const hostWorld = await P.worlds.load(artifact.hostId);
        await worldStartMoving(P, hostWorld, artifact.id, subject.id);
    }
}

export async function stopMoving(P: Persistence, artifact: Artifact, subject: Artifact) {
    if (artifact.hostId) {
        const hostWorld = await P.worlds.load(artifact.hostId);
        await worldStopMoving(P, hostWorld, artifact.id, subject.id);       
    }
}
