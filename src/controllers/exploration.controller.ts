
import { matchPeerName } from "../datavis/helpers/peers";
import { GraphNode, GraphLink, NetworkData, PeerInfo, Service, Peer} from "../interfaces"
import { IMainController } from "./main.controller";
import {isIP, isIPv4} from 'is-ip';
import is_ip_private from 'private-ip';



export interface IExplorationController {

    main: IMainController,
    dataLoop: () => void;
    explorer: string;
    explored: string[];
    pushToExplored: (peerId: string) => void;
    discoveredPeers: string[];
    connectedPeers:  string[];
    unconnectedPeers:  string[];
    expand: () => void;
    addPeer: (peer: Peer, sourcePeerId: string) => void;

}

export class ExplorationController implements IExplorationController  {

    _explorer: string;
    _explored: string[];
    discoveredPeers: string[];
    failedConnections: string[];
    connectedPeers:  string[];
    unconnectedPeers:  string[];

    constructor(
        public main: IMainController
    ) {
        this._explored = [];
        this.discoveredPeers = [];
        this.failedConnections = [];
        this.connectedPeers = [];
        this.unconnectedPeers = [];
    }

    set explorer(peerId: string) {
        this._explorer = peerId;
        this.main.table.signalExplorer(peerId);
    } 

    get explorer() {
        return this._explorer;
    }

    get explored() {
        return this._explored;
    }

    pushToExplored(peerId: string) {
        this._explored.push(peerId);
    }

    async dataLoop() {

        let s = await this.exploreAll(this.main.fluence.relayPeerId); 

       // while (true) {

          let t = await this.expand(); 
        //   console.log("eerste rondje is klaar")
        //   console.log(this.main.peers.peers)


        // }

      //   for (let node of this.dataStore.nodes.filter( n => n.peerId != this.fluence.peerId  && n.name != this.fluence.relayPeerId)) {
        
      //     try {  
      //         if (node.connected) await this.fluence.getPeerInfo(node.peerId);
      //     } catch {
      //         console.log("augment calls timed out for " + node.peerId)
      //     }
      //   }

      //   for (let node of this.dataStore.nodes.filter( n => n.peerId != this.fluence.peerId  && n.name != this.fluence.relayPeerId)) {
        
      //     try {  
      //         if (node.connected) await this.fluence.getPeerServices(node.peerId);
      //     } catch {
      //         console.log("augment calls timed out for " + node.peerId)
      //     }
      //   }

       // await setTimeout( () => {},120000);
     // }
    }

    addFailedConnection(peer: string) {
        this.failedConnections.push(peer);
        console.log("added failed connection for " + peer)
    }

    async exploreAll(sourcePeerId: string) : Promise<boolean> {


        // move stuff to exploration 
        this.explorer = sourcePeerId;

        let peers: any[];
        let newConnectPeers = [];

        try {
            peers = await this.main.fluence.neighborhood(sourcePeerId);
        } catch(error) {   
            console.log("nbh error for " + sourcePeerId);
            console.log(error);
            this.addFailedConnection(sourcePeerId);
            return false;
        }

        console.log(peers.length);

        for (const peer of peers) {

            if(this.discoveredPeers.indexOf(peer) < 0 && this.failedConnections.indexOf(peer) < 0) {

                let contact: any;

                try {

                    contact = await this.main.fluence.contact(sourcePeerId, peer);

                    try {
    
                        let newPeer: Peer = {
                            peerId : peer,
                            public: this.isPublic(contact.addresses[0]),
                            addresses: contact && contact.addresses ? contact.addresses : [],
                            kademlia_neighbors: [],
                            tested_connections: []
                        }
        
                        this.addPeer(newPeer, sourcePeerId)
                   
                    } catch(error) {
                        
                        console.log("error pushing data for " + sourcePeerId);
                        console.log(error);
                    }


                } catch(error) {
                    console.log("contact error for " + peer);
                    console.log(error);
                    this.addFailedConnection(sourcePeerId);
                } 
            } 
        }  
  
        this.main.peers.expandNeighborhood(sourcePeerId, peers);

        this.pushToExplored(sourcePeerId);

        return true;
    }

    async exploreConnected(sourcePeerId: string) : Promise<boolean> {


        // move stuff to exploration 
        this.explorer = sourcePeerId;

        let peers: any[];
        let newConnectPeers = [];

        try {
            peers = await this.main.fluence.neighborhood(sourcePeerId);
        } catch {   
            console.log(this.main.fluence.relayPeerId + " could not be reached");
            return false;
        }

        

        for (const peer of peers) {

            // dit is niet goed .. want alleen voor nieuwe peers worden er dingen gecheckt. 
            if(this.connectedPeers.indexOf(peer) < 0 && this.unconnectedPeers.indexOf(peer) < 0) {
            
                const c = await this.main.fluence.isConnected(sourcePeerId, peer);

                if(c) {

                    this.main.peers.addConnection(sourcePeerId, peer)
                    this.connectedPeers.push(peer);
                    newConnectPeers.push(peer);
                    

                } else {
                    this.unconnectedPeers.push(peer);
                }

            } else {

                const c = await this.main.fluence.isConnected(sourcePeerId, peer);

                if (c) {
                    this.main.peers.addConnection(sourcePeerId, peer)
                }
            }
        }

        for (let newPeerId of newConnectPeers) {

            try {

                let contact = await this.main.fluence.contact(sourcePeerId, newPeerId);

                let peer: Peer = {
                    peerId : newPeerId,
                    public: true,
                    addresses: contact && contact.addresses ? contact.addresses : [],
                    kademlia_neighbors: [],
                    tested_connections: []
                }

                this.addPeer(peer,sourcePeerId)
           
            } catch(error) {
                console.log("error pushing data for " + sourcePeerId);
                console.log(error);
            }

        }

        this.pushToExplored(sourcePeerId);

        return true;
    }

    // find new peers
    async expand() {

        for (let peer of this.main.peers.peers
                .filter( (p:any) => p.public)
                .filter( (p:any) => p.peerId != this.main.fluence.relayPeerId)
                .slice(0,0)
                
        ) {

            console.log(peer.peerId)

          //  await this.exploreAll(peer.peerId);
            
        }

    }

    addPeer(peer: Peer, sourcePeerId: string) {


        this.main.peers.addPeer(peer);
        this.discoveredPeers.push(peer.peerId);
     //   this.augment(peer);
       // this.main.graphData.addNode(peer.peerId,sourcePeerId)
    }



    // augment peers
    async augment(peer: Peer) {

        if(peer.addresses.length === 0) {
            return;
        }

        let ip;

        let ipOrDn = peer.addresses[0].split("/")[2];

        if(is_ip_private(ipOrDn)) {
            return;
        }

        if (isIPv4(ipOrDn)) {

            ip = ipOrDn;

        } else {

            var response = await fetch('https://dns.google/resolve?name=' + ipOrDn);
            var json = await response.json();
            ip = json.Answer[0].data;
        }

    

        let url = 'https://api.ipgeolocation.io/ipgeo?apiKey=058fa865d0d84183b5dab95a7d07463c&ip=' + ip

        fetch(url)
            .then(response=>response.json())
            .then(data => {  
                peer.location = data;
                this.main.peers.addPeer(peer);
            });
    }

    isPublic(address: string) : boolean {
        return is_ip_private(address.split("/")[2]) ? false : true; 
    }

}