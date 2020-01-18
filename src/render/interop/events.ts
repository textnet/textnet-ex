/**
 * INTEROP: All events that happen between Renderer and Main processes.
 */
import { Dir, Position       } from "../../interfaces";
import { ArtifactStructure, 
         WorldStructure, 
         AccountStructure    } from "../data_structures";

export interface ArtifactPropertiesEvent {
    artifactStructure: ArtifactStructure;
}

export interface WorldPropertiesEvent {
    worldStructure: WorldStructure;
}

export interface PositionEvent {
    artifactId: string;
    worldId: string;
    position: Position;
}

export interface PushEvent {
    artifactId: string;
    direction: Dir;
}

export interface PickupEvent {
    artifactId: string;
    direction: Dir;
}

export interface StandEvent {
    artifactId: string;
    text: string;
    position: Position;
}

export interface TextEvent {
    worldId: string;
    text: string;
}

export interface GotoEvent {
    artifactId: string;
    worldName?: string;
    direction: Dir;
}

export interface InventoryEvent {
    artifactId: string;
    inventoryStructure?: ArtifactStructure;
}

export interface WorldEvent {
    account:   AccountStructure,
    world:     WorldStructure,
    artifacts: Record<string,ArtifactStructure>,
    inventoryEvents: InventoryEvent[], 
}

export interface EnterEvent {
    artifactStructure: ArtifactStructure;
    inventoryStructure?: ArtifactStructure;
    worldId: string;
    position: Position;    
}

export interface LeaveEvent {
    artifactId: string;
    worldId: string;
}

