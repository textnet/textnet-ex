
import { Dir, Position } from "../../universe/interfaces";
import { ArtifactStructure } from "../data_structures";

export interface PositionEvent {
    artifactId: string;
    worldId: string;
    position: Position;
}

export interface PushEvent {
    artifactId: string;
    direction: Dir;
}

export interface EnterEvent {
    artifactStructure: ArtifactStructure;
    position: Position;    
}

export interface LeaveEvent {
    artifactId: string;
}
