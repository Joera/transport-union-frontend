// takes peers from peer store and makes data structure for chord diagram
// plus interactions between graph and application

export default class GraphInteractionService {

    constructor(
        private graphCtrlr: any) {

    }

    // update(restartSimulation: boolean){

    //     this._graphService.update({
    //         nodes: this._nodes,
    //         links: this._links
    //     }, restartSimulation)
    // }

    // recalculate() {

    //     for (let node of this._nodes) {

    //         node.incoming = this._links.filter( (l) => l.target === node.id).length;
    //         node.outgoing = this._links.filter( (l) => l.source === node.id).length;
    //     }

    //     this.update(true);
    // }

    // selectNode(peerId: string) {

    //     this._nodes.forEach( n => n.selected = false);

    //     this._nodes.find( (p) => p.peerId == peerId).selected = true;
    //     this.update(true);
    // }

    // unSelectNode(peerId: string) {

    //     console.log("unselect " + peerId);

    //     this._nodes.find( (p) => p.peerId == peerId).selected = false;
    //     this.update(true);
    // }

}