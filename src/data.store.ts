import { matchPeerSlug } from "./datavis/helpers/peers";
import { GraphLink, GraphNode, NetworkData, PeerInfo, Service, Satelite } from "./interfaces";

export class DataStore {

    _nodes: GraphNode[];
    _links: GraphLink[];
    _satelites: Satelite[];
    _connections: GraphLink[];


    constructor(
        private _graphService: any
    ) {

        this._nodes  = [];
        this._links = [];
    }


    findNode(peerId: string) {

        return this._nodes.find( (p) => p.peerId === peerId)
    }

    findNodeByIndex(index: number) {

        return this._nodes[index];
    }


    set node(peer: GraphNode) {

        this._nodes.push(peer);
        this.update(true);
    }

    set link(link: GraphLink) {
        this._links.push(link);
        this.update(true);
        
    }

    set nodes(nodes: GraphNode[]) {

        for (let node of nodes) {
            this._nodes.push(node);
        }
      //  this.update(true);
    }

    set links(links: GraphLink[]) {

        for (let link of links) {
                this._links.push(link);
        }
      //  this.update(true);
    }

    get nodes() {

        return this._nodes;
    }

    get links() {

        return this._links;
    }

    get peers() {

        return this._nodes.filter( (n) => ["peer","relayPeer"].indexOf(n.role) > -1)
    }

    get satelites() {

        return this._nodes.filter( (n) => ["js-peer"].indexOf(n.role) > -1)
    }

    get number_of_nodes() {
        return this.nodes.length;
    }

    trimLinks() {

        this._links = this._links.filter( (l) => {

            return l.source !== l.target;
        })
    }

    update(restartSimulation: boolean){

        this._graphService.update({
            nodes: this._nodes,
            links: this._links
        }, restartSimulation)
    }

    recalculate() {

        for (let node of this._nodes) {

            node.incoming = this._links.filter( (l) => l.target === node.id).length;
            node.outgoing = this._links.filter( (l) => l.source === node.id).length;
        }

        this.update(true);
    }

    selectNode(peerId: string) {

        this._nodes.forEach( n => n.selected = false);

        this._nodes.find( (p) => p.peerId == peerId).selected = true;
        this.update(true);
    }

    unSelectNode(peerId: string) {

        console.log("unselect " + peerId);

        this._nodes.find( (p) => p.peerId == peerId).selected = false;
        this.update(true);
    }

    addServicesToPeer(peerId: string, services: Service[], localPeerId: string) {
        
        let peer = this._nodes.find( (p) => p.peerId == peerId);
        peer.services = services;

        // if (peer.services) {
        //     for (let s of peer.services) {
        //         s.peer_id = peerId;
        //     }
        // }

        peer.myServices = services.filter( (s) => s.owner_id === localPeerId) 

        // here i want to add circles inside the circle for services / scripts owned by me 
        this.update(false); 
    }

    addInfoToPeer(peerId: string, info: PeerInfo) {
        let peer = this._nodes.find( (p) => p.peerId == peerId);
        peer.info = info;

        this.update(false);
    }

    // nodeByIndex(index: number) {
    //     return this._nodes[index];
    // }

    matchPeerSlugByIndex(index: number) {

        let node = this._nodes[index];

        return node ? matchPeerSlug(node.peerId) : ""
    }
}


