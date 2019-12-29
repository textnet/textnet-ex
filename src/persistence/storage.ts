// const storage = require('node-persist');

// export class Storage {
//     s;
//     constructor(kind: string) {
//         this.s = storage.create({ dir: "./.persistence/"+kind });
//     }
//     async init() {
//         await this.s.init();
//     }
//     async set( key: string, value: any) {
//         return await this.s.setItem(key, value)
//     }
//     async get( key: string ) {
//         return await this.s.getItem(key);
//     }
//     async remove( key: string ) {
//         return await this.s.removeItem(key);
//     }
//     async clear() {
//         return await storage.clear();
//     }
//     async all() {
//         return await storage.values();
//     }
// }
