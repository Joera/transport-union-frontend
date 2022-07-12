import { FluencePeer } from "@fluencelabs/fluence";
import { matchPeerName } from "../datavis/helpers/peers";
import { GraphNode, GraphLink, NetworkData, PeerInfo, Service} from "../interfaces"
import { getNeighborhood, isConnected, listServices, getPeerInfo } from '../_aqua/export'
import LocalPeer from './local-peer.service';

export default class FluenceService {

    connection: FluencePeer;
    peerId: string;
    relayPeerId: string;
    localPeerService;
    messageboard: HTMLElement;

    constructor(
        private _dataStore: any
    ) {
        this.localPeerService = new LocalPeer();
        this.messageboard = document.getElementById("messageboard");
    }

    async init(key: string, relay: number) {
        
        this.connection = await this.localPeerService.init(key, relay);
        
        this.peerId = this.connection.getStatus().peerId;
        this.relayPeerId = this.connection.getStatus().relayPeerId;
    }

    async pushNodes(peers: string[], source: string) {

        let nodes: GraphNode[] = [];

        let index = this._dataStore.number_of_nodes;

        for (let peer of peers) {

            if (!this._exists(peer)) {

                let connected = await isConnected(this.connection, peer);

                let role = this.matchRole(peer);
                let name = matchPeerName(peer)

                nodes.push({
                    id: index,
                    peerId: peer,
                    name,
                    connected,
                    incoming: 0,
                    outgoing: 0,
                    role,
                    services: [],
                    myServices: []
                });
                index++;
            }
        }

        this._dataStore.nodes = nodes;
    }

    addLocalPeer(localPeer: string, relay: string) {

        if (!this._exists(localPeer)) {

            this._dataStore.nodes = [{
                id: this._dataStore.number_of_nodes,
                peerId: localPeer,
                name: localPeer,
                connected : true,
                incoming: 0,
                outgoing: 1,
                role: "js-peer",
                services: [],
                myServices: []
            }]

        }

        this._dataStore.links = [{
            source: this._dataStore.nodes.map((p: GraphNode) => p.peerId).indexOf(localPeer),
            target: this._dataStore.nodes.map((p: GraphNode) => p.peerId).indexOf(relay)
        }]

    }


    pushLinks(peers: string[], source: string) {

        let links: GraphLink[] = [];

        for (let peer of peers) {

          //  let targetNode = this._dataStore.nodes.find( (n: GraphNode) => n.peerId === peer);
            
            // if (targetNode.connected) {
            
                try {
                    links.push({
                        // dit kun je evt met ids doen .... 
                        source: this._dataStore.nodes.map((p: GraphNode) => p.peerId).indexOf(source),
                        target: this._dataStore.nodes.map((p: GraphNode) => p.peerId).indexOf(peer)
                    });

                } catch {
                    console.log("error pushing link for " + source + " and " + peer);  
                }
            // }
        }
        links = links.filter( (l) => {
            return l.source !== l.target;
        })

        this._dataStore.links = links;

    }

    async explore(relay: string)  {

        let peers;

        this.messageboard.innerText = "exploring neighborhood of " + relay;

        try {

            peers = await getNeighborhood(this.connection, relay);

            if(relay === this.relayPeerId) {
                let hasLocalPeer = peers.find( (p) => p === this.peerId);
                // console.log(hasLocalPeer)
                peers = peers.concat(this.peerId)
            }

        } catch {
            console.log(relay + " could not be reached");
        }

        if(peers) {

            try {
                await this.pushNodes(peers,relay);
                this.pushLinks(peers,relay);
                this._dataStore.recalculate();
            } catch(error) {
                console.log("error pushing data for " + relay);
                console.log(error);
            }

        }
    }

    matchRole(peer: string) {

        switch(peer) {

            case this.peerId:
                return "localPeer"
            case this.relayPeerId:
                return "relayPeer"
            default:
                return "peer"


        }
    }

    async getPeerInfo(peer: string) {

        let info: PeerInfo;

        if(peer !== this.peerId) {
            try {
                info = await getPeerInfo(this.connection, peer);
            } catch {
                console.log("failed to get info for " + peer);
            }
        }

        this._dataStore.addInfoToPeer(peer,info);
    }

    async getPeerServices(peer: string) {

        let services: Service[];

        try {
            services = await listServices(this.connection, peer);
        } catch {
            console.log("failed to get services for " + peer);
        }

        this._dataStore.addServicesToPeer(peer,services, this.peerId);
    }

    _exists(peer: string) {

        return this._dataStore.nodes.map( (p: GraphNode) => p.peerId).indexOf(peer) < 0 ? false : true;
    }

    
} 