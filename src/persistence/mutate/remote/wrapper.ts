import { getRemotePersistenceById } from "../../remote/persistence"
import { persistenceId } from "../../identity"
import { Persistence } from "../../persist"

export async function wrapper(P: Persistence, event: string, id: string, data) {
    if (persistenceId(P.account.id) == persistenceId(id)) {
        return false;
    }
    const RP = getRemotePersistenceById(id);
    if (RP) {
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