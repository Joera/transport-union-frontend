import { FluencePeer, KeyPair } from "@fluencelabs/fluence";
import { krasnodar } from "@fluencelabs/fluence-network-environment";
import { IMainController } from "../controllers/main.controller";
import { matchPeerName } from "../datavis/helpers/peers";
import { GraphNode, GraphLink, NetworkData, PeerInfo, Service, Peer} from "../interfaces"
import { getNeighborhood, isConnected, listServices, getPeerInfo, getContact } from '../_aqua/export';
import {isIP, isIPv4} from 'is-ip';
import is_ip_private from 'private-ip';
import { dnsEncode } from "ethers/lib/utils";


interface PeerObject {
    multiaddr: string,
    peerId: string
}

export interface IFluenceService {

    _localPeer: KeyPair;
    localPeer: KeyPair;
    _relayPeer: PeerObject;
    localPeerId: string;
    relayPeerId: string;
    status: any;
    setRelayPeerbyIndex: (index: number) => void;
    connection: FluencePeer;
    makeKeyPair: (sk: string) => Promise<KeyPair>;
    connectToRelay: () => Promise<boolean>;
    explore: (peerId: string) => Promise<boolean>;
    connectedPeers:  string[];
    unconnectedPeers:  string[];
}

export default class FluenceService implements IFluenceService {

    _localPeer: KeyPair;
    _relayPeer: PeerObject;
    connection: FluencePeer;
    connectedPeers:  string[];
    unconnectedPeers:  string[];

    constructor(
        private main: IMainController
    ) {
        
        this.connectedPeers = [];
        this.unconnectedPeers = [];
    }

    async makeKeyPair(sk: string) : Promise<KeyPair> {
        const uint8array = new TextEncoder().encode(sk).slice(0,32);
        return await KeyPair.fromEd25519SK(uint8array);
    }

    set localPeer(keyPair: any) {
        this._localPeer = keyPair
    } 

    get localPeerId() : any {
        return this._localPeer.toB58String();
    }
    
    setRelayPeerbyIndex(index: number) {
        this._relayPeer = this._selectRelay(index);
    }

    get relayPeerId() : string {
        return this._relayPeer ? this._relayPeer.peerId : "";
    }

    async connectToRelay() {

        this.connection = new FluencePeer();
        await this.connection.start({
            KeyPair: this._localPeer,
            connectTo: this._relayPeer
        }); 

        await this._addPeer({ peerId : this.relayPeerId, addresses : [] },this.localPeerId)

        return true; 
    }

    get status() {
        return this.connection ? this.connection.getStatus() : {}
    }

    _selectRelay(index: number)  {

        if(index == 5) {

            return {
                multiaddr: '/ip4/143.176.14.172/tcp/7770/p2p/12D3KooWSsWDsonjEnJcqFp7WwfTYCbYKG43dGw9xd97eVKVHsEM',
                peerId: '12D3KooWSsWDsonjEnJcqFp7WwfTYCbYKG43dGw9xd97eVKVHsEM',
            }

        } else {
            return krasnodar[index];
        }    
    }

    async explore(sourcePeerId: string) : Promise<boolean> {

        let peers: any[];
        let newConnectPeers = [];

        try {
            peers = await getNeighborhood(this.connection, sourcePeerId);
        } catch {   
            console.log(this.relayPeerId + " could not be reached");
            return false;
        }

        for (const peer of peers) {

            if(this.connectedPeers.indexOf(peer) < 0 && this.connectedPeers.indexOf(peer) < 0) {
            
                const c = await isConnected(this.connection,sourcePeerId, peer);

                if(c) {
                    this.connectedPeers.push(peer);
                    newConnectPeers.push(peer);
                } else {
                    this.unconnectedPeers.push(peer);
                }

            } else {

            }
        }

        for (let newPeerId of newConnectPeers) {

            try {

                let contact = await getContact(this.connection, sourcePeerId, newPeerId);

                let peer: Peer = {
                    peerId : newPeerId,
                    addresses: contact && contact.addresses ? contact.addresses : []
                }

                this._addPeer(peer,sourcePeerId)
           
            } catch(error) {
                console.log("error pushing data for " + sourcePeerId);
                console.log(error);
            }

        }


        return true;
    }

    _addPeer(peer: Peer, sourcePeerId: string) {


        this.main.peers.addPeer(peer);
        this.augment(peer);
        this.main.graphData.addNode(peer.peerId,sourcePeerId)
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

    // find new peers
    async expand() {

        for (let peer of this.main.peers.peers) {
            await this.explore(peer.peerId);
        }

    }

    
;
    
} 