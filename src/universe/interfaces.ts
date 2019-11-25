import * as ex from 'excalibur';

export enum AvatarKind {
    PLAYER, LOCAL, PROXY
}

export interface Dir {
    name: string;
    angle: number;
    x: number;
    y: number;
}

export interface Position {
    x: number;
    y: number;
    dir: Dir;
}

export interface Coordinates {
    world: World;
    position: Position;
}

export interface Account {
    id: string;
    avatar?: Avatar;
}

export interface Avatar {
    id: string;
    body: Artifact;
    kind: AvatarKind;
    visits: Record<string,Coordinates>;
    visitsStack: string[];
}

export interface World {
    id: string;
    owner: Artifact;
    artifacts: Record<string,Artifact>;
}

export interface Artifact {
    id: string;
    name: string;
    spriteName: string;
    avatar?: Avatar;
    worlds: World[];
    coords?: Coordinates;
    dispatcher?: ex.EventDispatcher;
}






