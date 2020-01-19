import { Position, Artifact, World, Dir } from "../../../interfaces"


export interface RemoteEvent {}
export interface Payload {
    event: string,
    data:  RemoteEvent,
}
// --------------------------------------------------------------
export interface Load extends RemoteEvent {
    prefix: string,
    id:     string,
}
export interface ArtifactEnter extends RemoteEvent {
    artifactId: string,
    worldId:    string,
}
export interface ArtifactLeave extends RemoteEvent {
    artifactId: string,
    worldId:    string,
    disconnect: boolean;
}
export interface ArtifactPickup extends RemoteEvent {
    artifactId: string,
    objId:      string,
}
export interface ArtifactPutdown extends RemoteEvent {
    artifactId: string,
}
export interface ArtifactRemove extends RemoteEvent {
    artifactId: string,
    worldId:    string,
}
export interface ArtifactInsert extends RemoteEvent {
    artifactId: string,
    worldId:    string,
    pos:        Position,
}
export interface ArtifactProperties extends RemoteEvent {
    artifactId: string,
    properties: any,
}
// --------------------------------------------------------------
export interface WorldRemove extends RemoteEvent {
    artifactId: string,
    worldId:    string,
}
export interface WorldInsert extends RemoteEvent {
    artifactId: string,
    worldId:    string,
    pos:        Position,
}
export interface WorldUpdate extends RemoteEvent {
    artifactId: string,
    worldId:    string,
    pos:        Position,
}
export interface WorldUpdateText extends RemoteEvent {
    worldId:    string,
    text:       string,
}
