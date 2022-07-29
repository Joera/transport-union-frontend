// import SignInWithEthereum  from  './services/sign-in.service';
import { IUiController, UiController } from './ui.controller';

import FluenceService, { IFluenceService } from '../services/fluence.service';
import ChordDiagramGraph from '../datavis/graphs/chord-diagram.graph';
import Map from '../datavis/graphs/map.graph';
import PeerDataStore, { IPeerStore }  from '../peer.data.store';
import GraphDataService from '../graph.data.store';
import { ITableController, TableController } from './table.controller';
import { IGraphMappingV3 } from '../datavis/types/mapping';
import { runInThisContext } from 'vm';


export interface IMainController {

  ui: IUiController;
  fluence: IFluenceService,
  peers: IPeerStore,
  dataLoop: () => void;
  update: (newPeer: boolean) => void;
  table: ITableController;
  map: any;
  chordDiagram: any;
  graphData: any,

}

export class MainController implements IMainController  {

    ui:IUiController;
    fluence: any;
    peers: any;
    table: ITableController;
    map: any;
    chordDiagram: any;
    graphData;

    constructor() {

     

        // this.signInWithEthereum = new SignInWithEthereum();
   //     this.signInButton = document.getElementById("sign-in-ethereum") as HTMLButtonElement;


        this.ui = new UiController(this);
        this.fluence = new FluenceService(this);
        this.peers = new PeerDataStore(this);
        this.table = new TableController(this);
        this.graphData = new GraphDataService(this);
        this.chordDiagram = new ChordDiagramGraph(this,"chords-view");
        

        this.init();
    }

    find() {

    }

    // various tasks . init localPeer + relay 
    // first ring
    // finding connected nodes
    // augmenting nodes - info, services, registry

    async init() {

      this.ui.init();
      this.map = new Map(this,"map-view");
      

    }

    async dataLoop() {

        let s = await this.fluence.explore(this.fluence.relayPeerId); 

        while (true) {

          let t = await this.fluence.expand(); 

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
      }
    }

    update(newPeer: boolean) {

      // meerdere dingen doen hier 
      // of vervangen door observable 
        this.table.update();
        this.map.update();
        this.chordDiagram.update([],true);

     
    }

    // select(peerId: any) {
    //   this.peerDataStore.selectNode(peerId)
    // }
}

let main = new MainController();