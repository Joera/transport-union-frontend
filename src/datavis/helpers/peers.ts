import { krasnodar, testNet, stage} from "@fluencelabs/fluence-network-environment"
import { NetworkData } from "../../interfaces";
import { slugify } from "./_helpers";


export function matchPeerSlug(peerId: string) {
    
    let k = krasnodar.map( p => p.peerId).indexOf(peerId);
    let t = testNet.map( p => p.peerId).indexOf(peerId);
    let s = stage.map( p => p.peerId).indexOf(peerId);

    let shortName: string;

    
    if ( k > -1) {
        shortName = "K" + k
    } else if (t > -1) {
        shortName = "T" + t
    } else if (s > -1) {
        shortName = "S" + s
    } else if (peerId === '12D3KooWExAfK61mSetGMrym1439zrXUS9eSTz5szGzVnKyxgkaL') {
        shortName = 'AMS1'
    } else if(peerId === '12D3KooWAQRWaqSAEwU1RsNVLXnX3J899wkyifZQxBjCLW8dLTPe') {
        shortName = 'AMS2'
    } else if(peerId === '12D3KooWHE3EgDJa3WbPprnPqKAUUdj95FbAqeM7WKd9WEudMuAg') {
        shortName = 'AMS3'
    } else {
        shortName = peerId
    }

    return shortName ? slugify(shortName) : peerId;
}

export function matchPeerName(id: string) {

    let k = krasnodar.map( p => p.peerId).indexOf(id);
    let t = testNet.map( p => p.peerId).indexOf(id);
    let s = stage.map( p => p.peerId).indexOf(id);

    if ( k > -1) {
        return "Krasnodar " + k
    } else if (t > -1) {
        return "Testnet " + t
    } else if (s > -1) {
        return "Stage " + s
    } else {
        return undefined
    }

   
}

