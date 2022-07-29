import { GraphNode, GraphLink, NetworkData} from "../../interfaces"

import * as d3 from "d3";

import { ChartObjects, ChartSVG, ChartDimensions, ChartScale, ChartAxes } from '../chart-basics/module';
import { ChordElements, NodeElements, SateliteElements, ConnectionElements } from "../svg-elements/module";
import { BaseType, SimulationLinkDatum, SimulationNodeDatum } from "d3";
import { Dimensions } from "../types/dimensions";
import { FluencePeer } from "@fluencelabs/fluence";
import { Simulation } from "../svg-elements/simulation";
import { AnyRecord } from "dns";
import { CircularThings } from "../svg-elements/circular-things";
import { matchPeerSlug } from "../helpers/peers";
import { slugify } from "../utils/slugify.utils";

import { HtmlPopup } from "../html-elements/html-popup";
import { GraphControllerV3 } from "./graph-v3";
import { GraphData } from "../types/data";

export default class ChordDiagramGraph extends GraphControllerV3 {

    // localPeer: FluencePeer;
   
    element: HTMLElement;
    // yParameter;
    dimensions: any;
    svg: any;

    chartDimensions: any;
    chartSVG: any;

    color: any;

    chord: any;
    chordElements: any;
    nodeElements: any
    sateliteElements: any;
    connectionElements: any;

    coreCircle: any;
    sateliteCircle: any;
    popup: any;

    // config = {
    //     // "graphType": "ChordDiagram",
    //     // "xScaleType" : false,
    //     // "yScaleType" : false,
    //     // "xParameter" : false,
    //     // "yParameter" : false,
    //     "padding": {
    //         "top": 0,
    //         "bottom": 0,
    //         "left": 0,
    //         "right": 0
    //     },
    //     "margin": {
    //         "top": 0,
    //         "bottom": 0,
    //         "left": 0,
    //         "right": 0
    //     },
    //     "parameters" :[],
    //     "scales" : [],
    //     "axes": []
    // }

    constructor(
        public main: any,
        public elementId: string,
    ){
        super(main,elementId)
        this.init();
    }

    init() {

        let self = this;

        super._init();

        const svgId = "svg-wrapper-chords"; // + this.mapping.slug
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'row';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        container.style.width = "100%";
        // container.style.maxWidth = "400px"
        container.style.height = "100%";
        container.id = svgId;
        this.element.appendChild(container);

        super._svg(container);

        this.coreCircle = new CircularThings(this, 70,"core");

        this.nodeElements = new NodeElements(this.main, this);
        // this.sateliteElements = new SateliteElements(this.main, this);
        // this.chordElements = new ChordElements(this.main, this);
        // this.connectionElements = new ConnectionElements(this.main, this);

        
        // this.sateliteCircle = new CircularThings(this, 0,"satelite");

   //     this.popup = new HtmlPopup(this);

    }

    prepareData()   {

     //   data.nodes = data.nodes.filter( (n) => n.peerId !== this.mainController.fluence.peerId)
      //  data.links = data.links.filter( (n) => n.source > 0 )

        // let newData : NetworkData  = {
        //     nodes: data.nodes,
        //     links: data.links
        // }

        const nodes = this.main.graphData.nodes;

        const index = new Map(nodes.map((n: any, i: number) => [n.peerId, i]));
        let matrix = Array.from(index, () => new Array(nodes.length).fill(0));

        for (const {source, target} of this.main.graphData.links) {
            
            try {
                matrix[source][target] = 1;
                matrix[target][source] = 1;
            }
            catch {
               // console.log("probleem met link " + source + " " + target)
            }
        }

        this.coreCircle.resupply(nodes);
        const coreChords = this.coreCircle.chord(matrix);

        // this.sateliteCircle.resupply(networkData);
        // const sateliteChords = this.coreCircle.chord(networkData.matrix);

        const data = { nodes, coreChords }; 

        return data;
    }

    draw(data: any) {

        this.nodeElements.draw(data.nodes, data.coreChords);
    //     this.chordElements.draw(data.networkData, data.coreChords);

    //     this.sateliteElements.draw(data.networkData, data.sateliteChords);

    //   //  this.popup.attachData(data)

    //     setTimeout( () => {
    //         this.connectionElements.draw(data.networkData, data.sateliteChords);
    //     },1000)
        
    }

    redraw(data: GraphData) {

          super.redraw(data);
          this.coreCircle.redraw();
          this.nodeElements.redraw();
        //   this.chordElements.redraw();
        //   this.sateliteElements.redraw();
    }
  
    update(data: GraphData, update: boolean) {
        super._update(data,update);
    }



    
}