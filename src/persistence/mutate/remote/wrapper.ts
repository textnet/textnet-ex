import { getRemotePersistenceFromId } from "../../remote/persistence"
import { Persistence } from "../../persist"

export async function wrapper(P: Persistence, event: string, id: string, data) {
    const RP = getRemotePersistenceFromId(id);
    if (RP && RP.id != P.account.id) {
        await RP.send(P, event, data);
        return true;
    } else {
        return false;
    }
}