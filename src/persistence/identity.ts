/**
 * Identity abstraction.
 * Temporary, currently uses short random IDs. 
 */
import * as crypto from "crypto";

/**
 * Generate a random ID under the given prefix.
 * Used by Persistence to create distinguishable ids for all items
 * created within an account.
 * @param   {string} prefix - account ID.
 * @returns {string}
 */
export function generateId(prefix: string) {
    if (!prefix) {
        prefix = "" 
    } else {
        prefix += ".";
    }
    return prefix + crypto.randomBytes(2).toString('hex')
}

export function persistenceId(id: string) {
    const parts = id.split(".");
    return parts[0];
}

/**
 * Create unique and discoverable account ID.
 * While we don't have any distributed identity, it is just another random ID.
 * @returns {string}
 */
export function registerAccountId() {
    return "*"+generateId("")
}


