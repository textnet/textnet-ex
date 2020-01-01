import { Position } from "../universe/interfaces"


export interface WorldStructure {
    id: string;
    ownerId: string;
    name: string;
    text: string;
    colors: {
        world: { fg: string, bg: string };
        title: { fg: string, bg: string };
    }
}

export interface AccountStructure {
    id: string;
    artefactId: string;
    isLocal: boolean;
}

export interface ArtifactStructure {
    id: string;
    name: string;
    position: Position;
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