// import SignInWithEthereum  from  './services/sign-in.service';
import FluenceService from './services/fluence.service';
import NetworkGraph from './datavis/graphs/network.graph';
import ChordDiagramGraph from './datavis/graphs/chord-diagram.graph';

import { GraphNode, GraphLink, NetworkData} from "./interfaces"
import { FluencePeer } from '@fluencelabs/fluence';

import { DataStore } from './data.store';

export class MainController {

    // signInWithEthereum;
    signInButton: HTMLButtonElement;
    fluence;
    graph;
    dataStore;

    constructor() {

        // this.signInWithEthereum = new SignInWithEthereum();
   //     this.signInButton = document.getElementById("sign-in-ethereum") as HTMLButtonElement;
        // we make graph first .. so it can be injected in datastore to call update after data changes
        this.graph = new ChordDiagramGraph(this,"network-graph-container");
      //  this.graph = new NetworkGraph(this,"network-graph-container");
        this.dataStore = new DataStore(this.graph);
        this.fluence = new FluenceService(this.dataStore);

        this.init();
    }

    async init() {

      let keyinputEl = document.getElementById("secret-key") as HTMLInputElement;
      

      let relayEls = [].slice.call(document.getElementsByClassName("relay-tab"));

      for (let el of relayEls) {

        el.addEventListener("click", async (event: any) => {

          
          document.getElementById("relay_peer_info").style.display = "none";

          let key = keyinputEl.value;
          let peerId = parseInt(event.target.getAttribute("data-peer-id"));

          console.log(key);

          await this.fluence.init(key, peerId);
          keyinputEl.value = "";
          this.dataLoop();

        });
      }
      
      
    }

    async dataLoop() {

    //   let networkData = this.network.empty();
      //  this.signInWithEthereum
      
      this.graph.init();

      // await this.fluence.pushNodes([this.fluence.peerId,this.fluence.relayPeerId], this.fluence.peerId);
      // this.fluence.pushLinks([this.fluence.peerId,this.fluence.relayPeerId], this.fluence.peerId);  
      // zonder local peer want die wil je ontdekken als JS-peer via de relayPeer

      await this.fluence.pushNodes([this.fluence.relayPeerId], this.fluence.peerId);
      this.fluence.pushLinks([this.fluence.relayPeerId], this.fluence.peerId);  

      await this.fluence.addLocalPeer(this.fluence.peerId,this.fluence.relayPeerId)

   //   this.signInButton.style.display = "flex";

      // while (true) {
        
        console.log("new dataloop")
       // first ring
        await this.fluence.explore(this.fluence.relayPeerId);  // .filter(p => p !== 'timeout');

        for (let node of this.dataStore.nodes.filter( n => n.peerId != this.fluence.peerId  && n.name != this.fluence.relayPeerId)) {
        
          try {  
              if (node.connected) await this.fluence.explore(node.peerId);
          } catch {
              console.log("explore call timed out for " + node.peerId)
          }
        }

        for (let node of this.dataStore.nodes.filter( n => n.peerId != this.fluence.peerId  && n.name != this.fluence.relayPeerId)) {
        
          try {  
              if (node.connected) await this.fluence.getPeerInfo(node.peerId);
          } catch {
              console.log("augment calls timed out for " + node.peerId)
          }
        }

        for (let node of this.dataStore.nodes.filter( n => n.peerId != this.fluence.peerId  && n.name != this.fluence.relayPeerId)) {
        
          try {  
              if (node.connected) await this.fluence.getPeerServices(node.peerId);
          } catch {
              console.log("augment calls timed out for " + node.peerId)
          }
        }

        // await setTimeout( () => {},5000);
      }
    // }

    select(peerId: any) {
      this.dataStore.selectNode(peerId)
    }

    openPanel(peerId: string) {

      let page_container = document.querySelector("section.small-container") as HTMLElement;

      page_container.style.marginRight = "500px" 
      
      let panel = document.getElementById("panel");

      panel.innerHTML = "";
    
      let container = document.createElement("div"); 

    

      // container.innerText = JSON.stringify(peerData);

      
      panel.appendChild(container);

      if (!panel.classList.contains("in_view")) {
        panel.classList.add("in_view");
      }

      
    }

    // async explorePeer(localPeer: FluencePeer, relay: string) {

    //     let peers = await getNeighborhood(localPeer, relay);

    //     for (let peer of peers) {

    //         this.data.pushPeer({
    //             id: this.data.peers.length,
    //             peerId: peer,
    //             connected: await isConnected(localPeer, peer) 
    //         });

    //     }
    // }
}

let main = new MainController();