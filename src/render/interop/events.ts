
import { Position } from "../../universe/interfaces";
import { ArtifactStructure } from "../data_structures";

export interface PositionEvent {
    artifactId: string;
    worldId: string;
    position: Position;
}

export interface EnterEvent {
    artifactStructure: ArtifactStructure;
    position: Position;    
}

export interface LeaveEvent {
    artifactId: string;
}
