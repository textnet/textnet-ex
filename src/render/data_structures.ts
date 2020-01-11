/**
 * Specific structures are used to exchange data between renderer 
 * and main processes of the Electron app.
 *
 * They differ from the ones that Persistence and all other guys are
 * using. They only contain data required for rendering, and in the 
 * way that is convenient for the purpose.
 */
import { Position } from "../interfaces"


/**
 * Structure to describe World for rendering: colors, format, text, name.
 * Built from both {Artefact} and {World} content.
 */
export interface WorldStructure {
    id: string;
    ownerId: string;
    name: string;
    text: string;
    format: string;
    colors: {
        world: { fg: string, bg: string };
        title: { fg: string, bg: string };
    }
}

/**
 * {Account} structure is very basic.
 */
export interface AccountStructure {
    id: string;
    artefactId: string;
    isLocal: boolean;
}

/**
 * When updating properties of the artifact actor, those pieces
 * of data structure are ignored.
 */
export const artifactPrivateProperties = [ "isInventory", "isLocal", "isPlayer", 
                                           "sprite", "body", "id", "position", ];


/**
 * Data structure for {Artifact} is focused on sprites and parameters of
 * actor like `speed` and `passable`.
 */
export interface ArtifactStructure {
    id: string;
    name: string;
    position?: Position;
    speed: number;
    passable: boolean;
    sprite: { 
        base64: string;
        idleBase64: string;
        size:   number[]; // [32,32]
        turning:  boolean;
        moving:   boolean;
    }
    body: { 
        offset: number[]; // [0,0]
        size:   number[]; // [30,20]
    }
    isInventory: boolean; // ?
    isLocal: boolean;
    isPlayer: boolean;
}