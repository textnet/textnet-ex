
import { Artifact } from "../../interfaces"
import { PersistenceObserver } from "../../persistence/observe/observer"
import * as mutateTeleport from "../../persistence/mutate/teleport"
import { getArtifactFromData } from "./tools"


export function teleport( O: PersistenceObserver,
                          artifactData?: object,
                          targetData?: object,
                          targetId?: string) {
    const artifact = getArtifactFromData(O, artifactData);
    if (targetData) {
        targetId = targetData["id"];
    }
    console.log(`(P${O.P.account.id}) teleporting`, artifactData["name"], targetId)
    if (targetId) {
        O.P.artifacts.load(targetId).then(function(data: Artifact) {
            if (data) {
                mutateTeleport.teleport(O.P, artifact, data)
            }
        });
    }    
}
