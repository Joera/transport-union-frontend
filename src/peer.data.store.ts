import { KeyPair } from "@fluencelabs/fluence";
import { IMainController } from "./controllers/main.controller";
import { matchPeerSlug } from "./datavis/helpers/peers";
import { GraphLink, GraphNode, NetworkData, Peer, PeerInfo, Service, Satelite } from "./interfaces";

interface PeersList {
    [key: string]: Peer;
  }


export interface IPeerStore {

    peers: Peer[];
    findPeer: (peerId: string) => Peer;
    addPeer: (peer: Peer) => void;
    expandNeighborhood: (source: string, neighbors: string[]) => void;
    addConnection: (source: string, target: string) => void
    // exists: (peerId: string) => boolean;

}

export default class PeerStore implements IPeerStore {


    private _peers: PeersList;
    private  _jsPeers: PeersList;

    constructor(
        private main: IMainController
    ) {
        this._peers  = {};
        this._jsPeers = {};
    }


    // by index? 

    findPeer(peerId: string) : Peer {

        return this._peers[peerId]; // .find( (p) => p.peerId === peerId)
    }

    addPeer(peer: Peer) {

        this._peers[peer.peerId] = peer;
    
        this.main.update(true);
    }

    // set peers(peers: Peer[]) {

    //     for (let peer of peers) {
    //         this._peers.push(peer);
    //     }
    //   //  this.update(true);
    // }

    get peers() {

        return Object.values(this._peers);
    }

    expandNeighborhood(source: string, neighbors: string[]) {

        for (const n of neighbors) {
            if (this._peers[source].kademlia_neighbors.indexOf(n) < 0) {
                this._peers[source].kademlia_neighbors.push(n);
            }
        }

        this.main.update(true);
    }

    addConnection(source: string, target: string) {
      
        this._peers[source].tested_connections.push(target);
       // this.main.graphData.addConnection(source, target);
        this.main.update(true);
    }

    // exists(peerId: string) :boolean {

    //     return this._peers.map( (p: Peer) => p.peerId).indexOf(peerId) < 0 ? false : true;
    // }

    // addServicesToPeer(peerId: string, services: Service[], localPeerId: string) {
        
    //     let peer = this._peers.find( (p) => p.peerId == peerId);
    //     peer.services = services;

    //     // if (peer.services) {
    //     //     for (let s of peer.services) {
    //     //         s.peer_id = peerId;
    //     //     }
    //     // }

    //     peer.myServices = services.filter( (s) => s.owner_id === localPeerId) 

    //     // here i want to add circles inside the circle for services / scripts owned by me 
    //     this.update(false); 
    // }

    // addInfoToPeer(peerId: string, info: PeerInfo) {

    //     let peer = this._peers.find( (p) => p.peerId == peerId);
    //     peer.info = info;

    //     this.update(false);
    // }

    // // nodeByIndex(index: number) {
    // //     return this._nodes[index];
    // // }



   

   

    // addLocalPeer(localPeer: string, relay: string) {

    //     if (!this._exists(localPeer)) {

    //         this._dataStore.nodes = [{
    //             id: this._dataStore.number_of_nodes,
    //             peerId: localPeer,
    //             name: localPeer,
    //             connected : true,
    //             incoming: 0,
    //             outgoing: 1,
    //             role: "js-peer",
    //             services: [],
    //             myServices: []
    //         }]

    //     }

    //     this._dataStore.links = [{
    //         source: this._dataStore.nodes.map((p: GraphNode) => p.peerId).indexOf(localPeer),
    //         target: this._dataStore.nodes.map((p: GraphNode) => p.peerId).indexOf(relay)
    //     }]

    // }


    // pushLinks(peers: string[], source: string) {

    //     let links: GraphLink[] = [];

    //     for (let peer of peers) {

    //       //  let targetNode = this._dataStore.nodes.find( (n: GraphNode) => n.peerId === peer);
            
    //         // if (targetNode.connected) {
            
    //             try {
    //                 links.push({
    //                     // dit kun je evt met ids doen .... 
    //                     source: this._dataStore.nodes.map((p: GraphNode) => p.peerId).indexOf(source),
    //                     target: this._dataStore.nodes.map((p: GraphNode) => p.peerId).indexOf(peer)
    //                 });

    //             } catch {
    //                 console.log("error pushing link for " + source + " and " + peer);  
    //             }
    //         // }
    //     }
    //     links = links.filter( (l) => {
    //         return l.source !== l.target;
    //     })

    //     this._dataStore.links = links;

    // }

    // async explore(relay: string)  {

    //     let peers;

    //     this.messageboard.innerText = "exploring neighborhood of " + relay;

    //     try {

    //         peers = await getNeighborhood(this.connection, relay);

    //         if(relay === this.relayPeerId) {
    //             let hasLocalPeer = peers.find( (p) => p === this.peerId);
    //             // console.log(hasLocalPeer)
    //             peers = peers.concat(this.peerId)
    //         }

    //     } catch {
    //         console.log(relay + " could not be reached");
    //     }

    //     const connectedPeers = [];
    //     const unconnectedPeers = [];

    //     for (const peer of peers) {
            
    //         const c = await isConnected(this.connection,relay,peer);

    //         if(c) {
    //             connectedPeers.push(peer);
    //         } else {
    //             unconnectedPeers.push(peer);
    //         }

    //     }

    //     console.log("connected: " + connectedPeers.length )
    //     console.log("unconnected: " + unconnectedPeers.length)

    //     if(connectedPeers) {

    //         try {
    //             // if is singular ..... 
    //             await this.pushNodes(connectedPeers,relay);
    //             this.pushLinks(connectedPeers,relay);
    //             this._dataStore.recalculate();
    //         } catch(error) {
    //             console.log("error pushing data for " + relay);
    //             console.log(error);
    //         }

    //     }
    // }

    // matchRole(peer: string) {

    //     switch(peer) {

    //         case this.peerId:
    //             return "localPeer"
    //         case this.relayPeerId:
    //             return "relayPeer"
    //         default:
    //             return "peer"


    //     }
    // }

    // async getPeerInfo(peer: string) {

    //     let info: PeerInfo;

    //     if(peer !== this.peerId) {
    //         try {
    //             info = await getPeerInfo(this.connection, peer);
    //         } catch {
    //             console.log("failed to get info for " + peer);
    //         }
    //     }

    //     this._dataStore.addInfoToPeer(peer,info);
    // }

    // async getPeerServices(peer: string) {

    //     let services: Service[];

    //     try {
    //         services = await listServices(this.connection, peer);
    //     } catch {
    //         console.log("failed to get services for " + peer);
    //     }

    //     this._dataStore.addServicesToPeer(peer,services, this.peerId);
    // }

    
}


