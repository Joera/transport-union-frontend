import * as d3 from "d3";
import { chord } from "d3";
import { find } from "lodash";

import { GraphLink, GraphNode, NetworkData } from "../../interfaces";
import { Dimensions } from "../types/dimensions";
import { slugify } from "../utils/slugify.utils";
import colours from "../utils/colours.utils";


export default class SateliteElements  {

    matchPeerSlugByIndex: any;

    nodeLayer: any;
    // color: any;
    // ribbon: any;
    arc: any;
    // chord: any;

    constructor(
        private mainController: any,
        private ctrlr: any
    ){
        this.ctrlr.svg.layers.data
            .append("g")
            .attr("class", "satelites")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10);
     } 

    draw(data: NetworkData, chords: any) {

        let self = this; 

        const jsPeers = chords.groups.filter( (g: any) =>  { 
            let n = this.mainController.dataStore.findNodeByIndex(g.index);
            if( n != undefined && n.role  === "js-peer") return g;
        });

        const matchPeerSlugByIndex = this.mainController.dataStore.matchPeerSlugByIndex.bind(this.mainController.dataStore);

        this.ctrlr.svg.layers.data.select("g.satelites")
            .selectAll("path.satelite")
            .data(jsPeers, (d: any) => {
                return matchPeerSlugByIndex(d.index);
            })
            .join(
                (enter : any) => {

                    enter
                        .append("path")
                        .attr("class", (d:any) =>  "satelite id-" + matchPeerSlugByIndex(d.index))
                        .attr("stroke", "#fff")
                        .attr("fill", (d: any) => {

                            try { 

                                let node = data.nodes.find((n:any) => n.id === d.index);

                                if (node && node.role === "js-peer") {
                                    return colours.orange[0]; 
                                } else if (node && !node.connected) {
                                    return colours.lightGrey[0]; 
                                } else {
                                    return colours.orange[0]; ; 
                                }
                            } catch {
                                return "#000"
                            }
                        })
                        .style("opacity", (d: any) => {
                            return 1; 
                        })
                        .on('mouseover', (event: any, d: any) => {

                
                            d3.select(event.target)
                                .style("cursor", "pointer")
                                .attr("fill", (d: any) => {
                                    return colours.orange[2];  //color(names[d.index]);   
                                })

                            self.ctrlr.svg.layers.data
                                .selectAll("path.chord.source-" + matchPeerSlugByIndex(d.index))
                                .attr("fill", (dd: any) => {
                                    return colours.orange[0]; // color(names[dd.index]);  
                                })
                                .style("opacity", 1)
                                .raise();



                        })
                        .on('mouseout', (event: any, d: any) => {

                            d3.select(event.target)
                                .style("cursor", "pointer")
                                .attr("fill", (d: any) => {
                                    return colours.orange[0];  //color(names[d.index]);   
                                })

                            self.ctrlr.svg.layers.data
                                .selectAll("path.chord.source-" + matchPeerSlugByIndex(d.index))
                                .attr("fill", (dd: any) => {
                                    return colours.lightGrey[0]; // color(names[dd.index]);  
                                })
                                .style("opacity", .33)
                                .raise();
                        })
                        .on("click", (event: any, d:  any) => {

                            self.ctrlr.popup.pop(event, self.ctrlr.mainController.dataStore.findNodeByIndex(d.index));

                        })
            },
                (update : any) => {

                    update
                        .attr("d", this.ctrlr.sateliteCircle.arc);

                }
            )
            ;

            this.ctrlr.svg.layers.data.select("g.satelites")
                .selectAll("text")
                .data(jsPeers, (d: any) => {
                    return matchPeerSlugByIndex(d.index);
                })
                .join(

                    (enter: any) => {
                        
                        enter
                            .append("text")
                            .attr("y", (d: any) => -this.ctrlr.dimensions.height / 2 + 60 )
                            .attr("text-anchor","middle")
                            // .append("textPath")
                            // .attr("xlink:href", "#satelite-circle-path")
                            .text((d: any) => {
                                
                                let name = matchPeerSlugByIndex(d.index);  
                                
                                if(name != undefined) {
                                    return name // (name.length > 3) ? ".." + name.substr(name.length - 5) : name;
                                } else {
                                    return "";
                                }
                            });
                    },

                    (update: any) => {

                        // update.select("textPath")
                        //     .attr("startOffset", (d: any, i: number, el: any) => self.ctrlr.sateliteCircle.labels(data, d));
                    }

                );
                
                // this.graphController.svg.layers.data.selectAll("path.node.k0")
                //     .attr("fill", pink)

    }


    redraw(dimensions: Dimensions) {

        // this.innerRadius = Math.min(dimensions.width, dimensions.height) * 0.5 - 20;
        // this.outerRadius = this.innerRadius + 6
    }

}