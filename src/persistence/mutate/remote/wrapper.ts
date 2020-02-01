import { getRemotePersistenceById } from "../../remote/persistence"
import { Persistence } from "../../persist"

export async function wrapper(P: Persistence, event: string, id: string, data) {
    const RP = getRemotePersistenceById(id);
    if (RP && RP.id != P.account.id) {
        // if (event=="worldStartMoving") {
        //     console.log(`remote<${P.account.bodyId} => ${RP.id}>: moving start`)
        // }
        // if (event=="worldStopMoving") {
        //     console.log(`remote<${P.account.bodyId} => ${RP.id}>: moving stop`)
        // }
        await RP.send(P, event, data);
        return true;
    } else {
        return false;
    }
}