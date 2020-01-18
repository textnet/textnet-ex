

import { persistenceId } from "../identity"
import { Persistence } from "../persist"


export async function load(P: Persistence,
                           prefix: string, id: string) {
    // temporary!
    // TODO: subscribe etc.
    let data;
    const pId = persistenceId(id);
    const idP = getRemotePersistence(pId);
    data = await idP.load(prefix, id);
    return data;
}

const localRegistry = {}; // temporary-2

export function register(P: Persistence) { // temporary-3
    const RP = new RemotePersistence(P.account.id);
    RP.linkLocal(P);
    localRegistry[RP.id] = RP;
}

export function getRemotePersistenceFromId(id: string) {
    const pId = persistenceId(id);
    const idP = getRemotePersistence(pId);
    return idP;
}

export function getRemotePersistence(pId: string) { // temporary-4
    return localRegistry[pId];
}

// Remote Persistence
export class RemotePersistence {
    localP?: Persistence; // link to local persistence (actually not needed they say)
    id: string;

    constructor(id: string) {
        this.id = id;
    }

    linkLocal(P: Persistence) {
        this.localP = P;
    }

    async load(prefix:string, id: string) {
        if (this.localP) {
            console.log(`Local:Load(${prefix}) => ${id}`)
            return await this.localP[prefix].load(id);
        } else {
            console.log(`Remote:Load(${prefix}) => ${id}`)
            // TODO call!
            // subscribe 
        }
    }

}





