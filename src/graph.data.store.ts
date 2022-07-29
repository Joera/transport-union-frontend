// takes peers from peer store and makes data structure for chord diagram
// plus interactions between graph and application

import { matchPeerSlug } from "./datavis/helpers/peers";
import { GraphNode, GraphLink, Satelite } from "./interfaces";

export default class GraphDataService {

    _nodes: GraphNode[];
    _links: GraphLink[];
    _satelites: Satelite[];
    _connections: GraphLink[];

    constructor(
        private main: any,
        
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

    // use class? 
    formatNew() {

    }


    set node(node: GraphNode) {
        this._nodes.push(node);
    }

    set link(link: GraphLink) {
        this._links.push(link);        
    }

    // set nodes(nodes: GraphNode[]) {

    //     for (let node of nodes) {
    //         this._nodes.push(node);
    //     }
    //     //  this.update(true);
    // }

    // set links(links: GraphLink[]) {

    //     for (let link of links) {
    //             this._links.push(link);
    //     }
    //     //  this.update(true);
    // }

    get nodes() {

        return this._nodes;
    }

    get links() {

        return this._links;
    }

    // get peers() {

    //     return this._nodes.filter( (n) => ["peer","relayPeer"].indexOf(n.role) > -1)
    // }

    // get satelites() {

    //     return this._nodes.filter( (n) => ["js-peer"].indexOf(n.role) > -1)
    // }

    get number_of_nodes() {
        return this.nodes.length;
    }

    trimLinks() {

        this._links = this._links.filter( (l) => {

            return l.source !== l.target;
        })
    }

    updateGraph(restartSimulation: boolean){

        this.main.chordDiagram.update({
            nodes: this._nodes,
            links: this._links
        }, restartSimulation)
    }

    recalculate() {

        // for (let node of this._nodes) {

        //     node.incoming = this._links.filter( (l) => l.target === node.id).length;
        //     node.outgoing = this._links.filter( (l) => l.source === node.id).length;
        // }

        this.updateGraph(true);
    }

    selectNode(peerId: string) {

        this._nodes.forEach( n => n.selected = false);

        this._nodes.find( (p) => p.peerId == peerId).selected = true;
        this.updateGraph(true);
    }

    unSelectNode(peerId: string) {

        console.log("unselect " + peerId);

        this._nodes.find( (p) => p.peerId == peerId).selected = false;
        this.updateGraph(true);
    }

    matchPeerSlugByIndex(index: number) {

        let node = this._nodes[index];

        return node ? matchPeerSlug(node.peerId) : ""
    }

    addNode(peer: string, source: string) {

        const sourceNode = this.findNode(source);

        const index = this.number_of_nodes;

        if (peer !== source && this.findNode(peer) == undefined) {

            this.node = {
                id: index,
                peerId: peer,
                selected: false
            };
        }

        if (sourceNode != undefined ) {

            this.link = {
                source: sourceNode.id,
                target: index
            }
            
            
            // this.updateGraph(true);
        }

    }

}