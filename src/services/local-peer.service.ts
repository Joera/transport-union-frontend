// import fetch from "fetch";
import { FluencePeer, KeyPair } from "@fluencelabs/fluence";
import { krasnodar } from "@fluencelabs/fluence-network-environment";
import * as bs58 from 'bs58';
import { isBrowser, isNode, isWebWorker, isJsDom, isDeno } from "browser-or-node";


const rustSK = '51h9mC4fkAoZmeQznhtL6NwT6C5xTemmPwX7eeQUyWa7ohW8GezWsqDFitn';

export default class LocalPeer {

    local_peer: any;

    constructor() {

    }

    async makeKeyPair(sk: string)  {
        const uint8array = new TextEncoder().encode(sk).slice(0,32);
        return await KeyPair.fromEd25519SK(uint8array);
    }
    
    selectRelay(index: number)  {
    
        return krasnodar[index];
    }
    
    async init(key: string, relayIndex: number) {
    
        const relay = this.selectRelay(relayIndex); 
        const keyPair  = await this.makeKeyPair(key);
    
        this.local_peer = new FluencePeer();
        await this.local_peer.start({
            KeyPair: keyPair,
            connectTo: relay
        }); 

        let status = this.getStatus()
    
        return this.local_peer
    }

    getStatus() {

        let status = this.local_peer.getStatus();
        console.log(status);

        return status;
    }

    

}



