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
    position:   Position,
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
    position:   Position,
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
export interface WorldProperties extends RemoteEvent {
    artifactId: string,
    worldId:    string,
}
export interface WorldPickup extends RemoteEvent {
    artifactId: string,
    worldId:    string,
    objId:      string,
}
export interface WorldPush extends RemoteEvent {
    artifactId: string,
    worldId:    string,
    objId:      string,
}
export interface WorldPutdown extends RemoteEvent {
    artifactId: string,
    worldId:    string,
    objId:      string,
}
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
    delta?:     Position,
}
export interface WorldStartMoving extends RemoteEvent {
    artifactId: string,
    worldId:    string,
    pos?:        Position,
}
export interface WorldStopMoving extends RemoteEvent {
    artifactId: string,
    worldId:    string,
    pos?:        Position,
}
export interface WorldUpdateText extends RemoteEvent {
    worldId:     string,
    text:        string,
    skipAttempt: boolean,
}
