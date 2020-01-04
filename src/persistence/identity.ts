import * as crypto from "crypto";

export function generateId(prefix) {
    if (!prefix) prefix = ""; else prefix += ".";
    return prefix + crypto.randomBytes(2).toString('hex')
}

export function registerAccountId() {
    return "";
    return "(trusted)"+generateId("")
}


