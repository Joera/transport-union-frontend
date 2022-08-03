import { InformationEvent } from "http"
import { GetPeerInfoResult } from "./_aqua/export"

export interface Peer {
    peerId: string,
    public: boolean,
    addresses?: string[],
    kademlia_neighbors?: string[],
    tested_connections?: string[],
    name?: string,
    location?: any,
    info?: PeerInfo,
    services?: Service[]
    myServices?: Service[]
}

export interface GraphNode   {
    index: number,
    peerId: string,
    fx?: number,
    fy?: number,
    cx?: number,
    cy?: number,
    selected?: boolean
}

export type Satelite = GraphNode

// export interface Satelite  {
//     id: number,
//     peerId: string,
//     addresses?: string[],
//     name?: string,
//     fx?: number,
//     fy?: number,
//     cx?: number,
//     cy?: number,
//     role?: string,
//     selected?: boolean,
//     connected?: boolean,
//     incoming?: number,
//     outgoing?: number,
//     info?: PeerInfo,
//     services?: Service[]
//     myServices?: Service[]
// }

export interface GraphLink {
    source: number,
    target: number
}

export interface NetworkData {
    nodes: GraphNode[],
    links: GraphLink[],
    matrix?: number[][]
}

export interface MatrixData {
    nodes: GraphNode[],
    matrix: number[][]
}

export interface PeerInfo {
    external_addresses: string[],
    node_version: string,
    air_version: string
}

export interface Service {
    id: string,
    blueprint_id: string,
    owner_id: string,
    peer_id?: string
}

export interface Coordinates {

    x: number,
    y: number
}

