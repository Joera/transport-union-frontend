// import SignInWithEthereum  from  './services/sign-in.service';
import { IUiController, UiController } from './ui.controller';

import FluenceService, { IFluenceService } from '../services/fluence.service';
import ChordDiagramGraph from '../datavis/graphs/chord-diagram.graph';
import Map from '../datavis/graphs/map.graph';
import PeerDataStore, { IPeerStore }  from '../peer.data.store';
import GraphDataService from '../graph.data.store';
import { ITableController, TableController } from './table.controller';
import { ExplorationController, IExplorationController } from './exploration.controller';
import { IGraphControllerV3 } from '../datavis/graphs/graph-v3';
import { MatrixGraph } from '../datavis/graphs/matrix.graph';
// import { IGraphMappingV3 } from '../datavis/types/mapping';



export interface IMainController {

  ui: IUiController;
  fluence: IFluenceService,
  exploration: IExplorationController,
  peers: IPeerStore,
  update: (newPeer: boolean) => void;
  table: ITableController;
  map: IGraphControllerV3;
  chordDiagram: IGraphControllerV3;
  matrix: IGraphControllerV3;
  graphData: any,

}

export class MainController implements IMainController  {

    ui:IUiController;
    fluence: IFluenceService;
    exploration: IExplorationController;
    peers: IPeerStore;
    table: ITableController;
    map: IGraphControllerV3;
    chordDiagram: IGraphControllerV3;
    matrix: IGraphControllerV3;
    graphData;

    constructor() {

     

        // this.signInWithEthereum = new SignInWithEthereum();
   //     this.signInButton = document.getElementById("sign-in-ethereum") as HTMLButtonElement;


        this.ui = new UiController(this);
        this.fluence = new FluenceService(this);
        this.exploration = new ExplorationController(this);
        this.peers = new PeerDataStore(this);
        this.table = new TableController(this);
        this.graphData = new GraphDataService(this);
        this.chordDiagram = new ChordDiagramGraph(this,"chords-view");
        this.matrix = new MatrixGraph(this,"matrix-view");
        

        this.init();
    }

    async init() {

      this.ui.init();
      this.map = new Map(this,"map-view");

    }

    update(newPeer: boolean) {
        this.table.update();
        this.map.update([],true);
        this.chordDiagram.update([],true);
        this.matrix.update([],true)
    }

    // select(peerId: any) {
    //   this.peerDataStore.selectNode(peerId)
    // }
}

let main = new MainController();