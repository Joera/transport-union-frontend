import * as d3 from "d3";
import { NetworkData } from "../../interfaces";
import { BaseType, SimulationLinkDatum, SimulationNodeDatum } from "d3";
import { Dimensions } from "../types/dimensions";

export class Simulation {

    s: any;
    graphNetworkElements: any;

    constructor() {

    }

    init(network: any, dimensions: Dimensions) {

        this.graphNetworkElements = network;

        this.s = d3.forceSimulation();
        
        this.s
            .force("center", d3.forceCenter(dimensions.width / 2, dimensions.height / 2))

            
    }

    supply(data: NetworkData) {

        let self = this;
            
        this.s   
            .nodes(data.nodes as SimulationNodeDatum[])
            .force("link", d3.forceLink(data.links))  
            // .alpha(1)
            .force("charge", d3.forceManyBody().strength(-600))
            .force('collision', d3.forceCollide().radius(function(d: any) {
                return d.selected ? 70 : 30 
            }))
            .on("tick", (d:any) => {
                self.graphNetworkElements.forceDirect()
            }); 
            
        this.s.alphaTarget(.3).restart;
    }

    restart() {

        // console.log("mo checks");
    
        this.s.alphaTarget(.3).restart;
    }

    redraw(dimensions: Dimensions) {

        this.s
            .force("center", d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
    }










}