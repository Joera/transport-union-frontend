import { GraphNode, GraphLink, NetworkData} from "../../interfaces"

import * as d3 from "d3";

import { ChartObjects, ChartSVG, ChartDimensions, ChartScale, ChartAxes } from '../chart-basics/module';
import { ChordElements, NodeElements, SateliteElements, ConnectionElements } from "../chart-elements/module";
import { BaseType, SimulationLinkDatum, SimulationNodeDatum } from "d3";
import { Dimensions } from "../types/dimensions";
import { FluencePeer } from "@fluencelabs/fluence";
import { Simulation } from "../chart-elements/simulation";
import { AnyRecord } from "dns";
import { CircularThings } from "../chart-elements/circular-things";
import { matchPeerSlug } from "../helpers/peers";
import { slugify } from "../utils/slugify.utils";

import { HtmlPopup } from "../html-elements/html-popup";

export default class ChordDiagramGraph {

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

    config = {
        "graphType": "ChordDiagram",
        "xScaleType" : false,
        "yScaleType" : false,
        "xParameter" : false,
        "yParameter" : false,
        "padding": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0
        },
        "margin": {
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0
        },
        "extra" :{}
    }

    constructor(
        private mainController: any,
        private elementID: string,
    ){
        this.element = d3.select('#' + elementID).node() as HTMLElement;
    }

    init() {

        let self = this;

        let chartObjects = ChartObjects();
        this.config = Object.assign(chartObjects.config(),this.config);
        this.dimensions = chartObjects.dimensions();
        this.svg = chartObjects.svg();

        // get dimensions from parent element
        this.chartDimensions = new ChartDimensions(this.element, this.config);
        this.dimensions = this.chartDimensions.get(this.dimensions);

        // create svg elements without data
        this.chartSVG = new ChartSVG(this.element, this.config, this.dimensions, this.svg);

        // get dimensions from parent element
        this.chartDimensions = new ChartDimensions(this.element, this.config);
        this.dimensions = this.chartDimensions.get(this.dimensions);

        this.nodeElements = new NodeElements(this.mainController, this);
        this.sateliteElements = new SateliteElements(this.mainController, this);
        this.chordElements = new ChordElements(this.mainController, this);
        this.connectionElements = new ConnectionElements(this.mainController, this);

        this.coreCircle = new CircularThings(this, 70,"core");
        this.sateliteCircle = new CircularThings(this, 0,"satelite");

        this.popup = new HtmlPopup(this);

    }

    prepareData(data: NetworkData)  {

     //   data.nodes = data.nodes.filter( (n) => n.peerId !== this.mainController.fluence.peerId)
      //  data.links = data.links.filter( (n) => n.source > 0 )

        // let newData : NetworkData  = {
        //     nodes: data.nodes,
        //     links: data.links
        // }

        const index = new Map(data.nodes.map((n, i) => [n.peerId, i]));
        data.matrix = Array.from(index, () => new Array(data.nodes.length).fill(0));

        for (const {source, target} of data.links) {
            
            try {
                data.matrix[source][target] = 1;
                data.matrix[target][source] = 1;
            }
            catch {
               // console.log("probleem met link " + source + " " + target)
            }
        }

    
        this.coreCircle.resupply(data);
        const coreChords = this.coreCircle.chord(data.matrix);

        this.sateliteCircle.resupply(data);
        const sateliteChords = this.coreCircle.chord(data.matrix);

        return { data, sateliteChords, coreChords }; 
    }

    draw(data: NetworkData, sateliteChords: any, coreChords: any) {

        this.nodeElements.draw(data, coreChords);
        this.chordElements.draw(data, coreChords);

        this.sateliteElements.draw(data, sateliteChords);

      //  this.popup.attachData(data)

        setTimeout( () => {
            this.connectionElements.draw(data, sateliteChords);
        },1000)
        
    }

    redraw(data: NetworkData) {

        this.dimensions = this.chartDimensions.get(this.dimensions);
        this.chartSVG.redraw(this.dimensions);
    }

    update(_data: NetworkData) {

        let self = this; 
        let { data, sateliteChords, coreChords } = this.prepareData(_data);
        this.draw(data, sateliteChords, coreChords );
        this.redraw(data);
        window.addEventListener("resize", () => self.redraw(data), false);
    }



    
}