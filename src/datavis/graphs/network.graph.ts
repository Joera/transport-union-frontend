
import { GraphNode, GraphLink, NetworkData} from "../../interfaces"


import * as d3 from "d3";


import { ChartObjects, ChartSVG, ChartDimensions, ChartScale, ChartAxes } from '../chart-basics/module';
import { Network} from "../svg-elements/module";
import { BaseType, SimulationLinkDatum, SimulationNodeDatum } from "d3";
import { Dimensions } from "../types/dimensions";
import { FluencePeer } from "@fluencelabs/fluence";
import { Simulation } from "../svg-elements/simulation";
import { GraphControllerV3 } from "./graph-v3";

export default class NetworkGraph extends GraphControllerV3 { 

    // localPeer: FluencePeer;
    element: HTMLElement;
    // yParameter;
    dimensions: any;
    svg: any;

    chartDimensions: any;
    chartSVG: any;

    graphNetworkElements: any;



    simulation: any = {};

    constructor(
        public main: any,
        public elementId: string,
    ){
        super(main,elementId)
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

        this.simulation = new Simulation(); 

        // into constructor
    
        // inject this 
        this.graphNetworkElements = new Network(this.main, this)
        this.simulation.init(this.graphNetworkElements,this.dimensions);


    }

    prepareData(data: NetworkData)  {

        return this.fixNodes(data);
    }

    draw(data: NetworkData) {
      //
        this.graphNetworkElements.draw(data,this.dimensions,this.simulation); 
    }

    redraw(data: NetworkData) {

        data = this.fixNodes(data);
        this.dimensions = this.chartDimensions.get(this.dimensions);
        this.chartSVG.redraw(this.dimensions);
        this.graphNetworkElements.redraw(this.dimensions);
        // this.simulation.redraw(this.dimensions)
    }

    update(data: NetworkData, restartSimulation: boolean) {
        
        let self = this;
        data = this.prepareData(data);
      //  data = this.fixNodes(data);
        this.draw(data);
        this.redraw(data);
        if (restartSimulation) this.simulation.supply(data);
        window.addEventListener("resize", () => self.redraw(data), false);
    }

    fixNodes(data: NetworkData) {

        for (let node of data.nodes) {

            if (node.peerId === this.main.fluence.localPeerId) {
                node.fx = this.dimensions.width / 2;
                node.fy = 0;
            } else if (node.peerId === this.main.fluence.relayPeerId) {
                node.fx = this.dimensions.width / 2;
                node.fy = 60;
            }
            // } else {
            //     node.fx = this.dimensions.width / 2;
            //     node.fy = this.dimensions.height / 2
            // }
        }

        return data;
    } 

    
}