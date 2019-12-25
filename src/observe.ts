import { Artifact, Avatar, AvatarKind, World } from "./universe/interfaces"
import { initWrittenWord, freeWrittenWord, WrittenEnvironment } from "./written/word"
import { numerate } from "./universe/utils"


export class AvatarObserver {
    artifact: Artifact;
    avatar: Avatar;

    constructor(artifact: Artifact) {
        this.artifact = artifact;
        this.avatar = this.attemptAvatar();
    }

    free() {
        if (this.avatar && this.avatar._env) {
            freeWrittenWord(this.artifact.avatar._env);
            delete this.artifact.avatar._env;
        }
    }

    attemptAvatar() {
        const texts = []
        for (let i of this.artifact.worlds) {
            texts.push(i.text)
        }
        const text = texts.join("\n\n");
        const env = initWrittenWord(this.artifact.id, text);
        this.free();
        if (env) {
            if (!this.artifact.avatar) {
                this.artifact.avatar = {
                    id: numerate("avatar"),
                    body: this.artifact,
                    inventory: [],
                    kind: AvatarKind.LOCAL,
                    visits: {},
                    visitsStack: [],
                }
            }
            this.artifact.avatar._env = env;
            return this.artifact.avatar;
        }
    }
}
