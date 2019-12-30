import * as crypto from "crypto";

export function generateId(prefix) {
    if (!prefix) prefix = ""; else prefix += "//";
    return prefix + crypto.randomBytes(4).toString('hex')
}

export function registerAccountId() {
    return "(trusted)"+generateId("")
}

export function getAccountId(id) {
    const parts = id.split("--")
    if (parts.length > 1) return parts[0];
    return "";
}