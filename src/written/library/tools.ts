/**
 * Helper functions to simplify getting proper data structures.
 */

import { spawnPosition }       from "../../const"
import { deepCopy }            from "../../utils"
import { Artifact }            from "../../interfaces"
import { PersistenceObserver } from "../../persistence/observe/observer"


/**
 * Load an artifact from the Written Persistence.
 * If `artifactData` is provided, looks into `.id`.
 * Otherwise, gets the artifact of the observer itself.
 * @param {PersistenceObserver} O
 * @optional @param {object}    artifactData @see "get.ts"
 * @returns         {Artifact}
 */
export function getArtifactFromData(O: PersistenceObserver, artifactData?: object) {
    let artifactId;
    if (artifactData) {
        artifactId = artifactData["id"];
    } else {
        artifactId = O.ownerId;
    }
    const artifact = O.writtenP.artifacts.load(artifactId);
    return artifact;    
}

/**
 * Load an artifact from the Written Persistence.
 * If `artifactData` is provided, looks into `.id`.
 * Otherwise, gets the artifact of the observer itself.
 * @param {PersistenceObserver} O
 * @optional @param {object}    artifactData @see "get.ts"
 * @returns         {Artifact}
 */
export function getArtifactPos(O: PersistenceObserver, artifact: Artifact) {
    if (artifact.hostId) {
        const hostWorld = O.writtenP.worlds.load(artifact.hostId);
        return hostWorld.artifactPositions[artifact.id];
    } else {
        return deepCopy(spawnPosition);
    }
}