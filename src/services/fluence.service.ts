import { FluencePeer, KeyPair } from "@fluencelabs/fluence";
import { krasnodar } from "@fluencelabs/fluence-network-environment";
import { IMainController } from "../controllers/main.controller";

import { getNeighborhood, isConnected, listServices, getPeerInfo, getContact } from '../_aqua/export';



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
    //explore: (peerId: string) => Promise<boolean>;
    neighborhood: (sourcePeerId: string) => Promise<string[]>
    contact: (source: string, target: string) => Promise<any>
    isConnected: (source: string, target: string) => Promise<any>
}

export default class FluenceService implements IFluenceService {

    _localPeer: KeyPair;
    _relayPeer: PeerObject;
    connection: FluencePeer;

    constructor(
        private main: IMainController
    ) {
        
        
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

        this.main.exploration.addPeer({ peerId : this.relayPeerId, public: true, addresses : [], kademlia_neighbors: [], tested_connections: [] },this.localPeerId)

        return true; 
    }

    get status() {
        return this.connection ? this.connection.getStatus() : {}
    }

    _selectRelay(index: number)  {

        // if(index == 5) {

        //     return {
        //         multiaddr: '/ip4/143.176.14.172/tcp/7770/p2p/12D3KooWSsWDsonjEnJcqFp7WwfTYCbYKG43dGw9xd97eVKVHsEM',
        //         peerId: '12D3KooWSsWDsonjEnJcqFp7WwfTYCbYKG43dGw9xd97eVKVHsEM',
        //     }

        // } else {
            return krasnodar[index];
       // }    
    }

    async neighborhood(sourcePeerId: string) {

        return await getNeighborhood(this.connection, sourcePeerId);
    }

    async contact(source: string, target: string) {

        return await getContact(this.connection, source, target)
    }

    async isConnected(source: string, target: string) {

        return await isConnected(this.connection,source, target)

    }

    

    

    
;
    
} 