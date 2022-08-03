import * as d3 from "d3";

import { GraphLink, GraphNode, NetworkData } from "../../interfaces";
import { Dimensions } from "../types/dimensions";
import { slugify } from "../utils/slugify.utils";
import colours from "../utils/colours.utils";
import { ContainerElement, EnterElement } from "d3";
import { parseWithoutProcessing } from "handlebars";

// const blue = "#17becf";
// const pink = "#97C4B8"

export default class HeatmapElements  {

    rows: any;
    cells: any;
    cellSize = 4;

    constructor(
        private main: any,
        private ctrlr: any
    ){
        
     } 

    draw(nodes: any[], matrix: any) {

        let self = this; 
        let j = 0;
    

        const matchPeerSlugByIndex = this.main.graphData.matchPeerSlugByIndex.bind(this.main.graphData);

        this.rows = this.ctrlr.svg.layers.data
            .selectAll("g.row")
            .data(nodes,(d: any) => {
                return matchPeerSlugByIndex(d.index);
            })
            .join("g")
            .attr("id", (d: GraphNode) => "id_" + d.peerId)
            .attr("class", (d:any) =>  "row " + matchPeerSlugByIndex(d.index))
            ;

        // console.log(this.rows);

        this.cells = this.rows
            .selectAll("rect")
            .data(nodes,(d: any) => {
                return matchPeerSlugByIndex(d.index);
            })
            .join("rect")
            .style("fill", (d: GraphNode, i: number, p: any) => {

                // console.log(d);
                // console.log(j);

                // klopt geen fuck van 
                // een kleur voor kademlia (heen en terug?)
                // een kleur voor geteste verbinding

                // en zekerheid over indexen


                let bc = "#efefef"

                // should this be so complicated?              
                let row = p[i].parentNode;
                let rowPeerId = row.id.substring(3);
                let rowIndex = nodes.map( (n) => n.peerId).indexOf(rowPeerId);

                if( d.peerId === rowPeerId) {

                    bc = "white";

                } else if (matrix[d.index][rowIndex] > 0) {

                    bc = "#dedede";

                } 

                if(j < nodes.length) {
                 j++;
                } else {
                    j = 0;
                }

                return bc;
            })
            // .on 
            // .attr("y", (d: any, i: number, j: number) => {
            //     return j * cellSize;
            // })
            // .attr("rx", 4)
            // .attr("ry", 4)
            // .attr("class", (d: any, i: number, j: number) => {
            //     return "cell bordered cr" + j + " cc" + i;
            // })
            // .attr("row", (d: any, i: number, j: number) => {
            //     return j;
            // })
            // .attr("col", (d: any, i: number, j: number) => {
            //     return i;
            // })
         

    }


    redraw(nodes: any[], matrix: any) {

        const self = this;

        const cellSize = this.ctrlr.dimensions.width / (nodes.length)

        this.rows
            .attr("transform", (d: GraphNode, i: number) => { 
                
                return "translate(0," + this.ctrlr.scales.y.scale(d.peerId) + ")" 
            });

        this.cells
            .attr("x", (d: any, i: number) => {
                //  console.log(d);
                  return this.ctrlr.scales.x.scale(d.peerId);
              })
            .attr("width", cellSize)
            .attr("height", cellSize);

    

        // this.innerRadius = Math.min(dimensions.width, dimensions.height) * 0.5 - 20;
        // this.outerRadius = this.innerRadius + 6
    }

}