import * as d3 from "d3";

import { GraphLink, GraphNode, NetworkData } from "../../interfaces";
import { Dimensions } from "../types/dimensions";
import { slugify } from "../utils/slugify.utils";
import colours from "../utils/colours.utils";

// const blue = "#17becf";
// const pink = "#97C4B8"

export default class NodeElements  {

    matchPeerSlugByIndex: any;

    nodeLayer: any;
    // color: any;
    // ribbon: any;
    arc: any;
    // chord: any;

    constructor(
        private main: any,
        private ctrlr: any
    ){

        this.ctrlr.svg.layers.data
            .append("g")
            .attr("class", "nodes")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10);
     } 

    draw(nodes: GraphNode[], chords: any) {

        let self = this; 

        const matchPeerSlugByIndex = this.main.graphData.matchPeerSlugByIndex.bind(this.main.graphData);

        // const peers = chords.groups.filter( (g: any) =>  { 
        //     let n = this.main.peers.findNodeByIndex(g.index);
        //     if( n != undefined && (n.role  === "peer" || n.role === "relayPeer")) return g;
        // });

        // console.log(chords);

        this.ctrlr.svg.layers.data.select("g.nodes")
            .selectAll("path.node")
            .data(chords, (d: any) => {

                console.log(d);
                return matchPeerSlugByIndex(d.index);
            })
            .join(
                (enter : any) => {

                    enter
                        .append("path")
                        .attr("class", (d:any) =>  "node " + matchPeerSlugByIndex(d.index))
                        .attr("stroke", "#fff")
                        .attr("fill", (d: any) => {

                            try { 

                                let node = nodes.find((n:any) => n.id === d.index);

                                // if (node && node.role === "relayPeer") {
                                //     return colours.orange[0]; 
                                // } else if (node && !node.connected) {
                                //     return colours.lightGrey[0];
                                // } else {
                                    return colours.darkGrey[0]; 
                                // }
                            } catch {
                                return "#000"
                            }
                        })
                        .style("opacity", (d: any) => {
                            return 1; 
                        })
                        .on('mouseover', (event: any, d: any) => {

                            d3.select(event.target)
                                .attr("fill", (d: any) => {
                                    return colours.blue[0]; //color(names[d.index]);   
                                })

                            self.ctrlr.svg.layers.data
                                .selectAll("path.source-" + matchPeerSlugByIndex(d.index))
                                .attr("fill", (dd: any) => {
                                    return colours.blue[0]; // color(names[dd.index]);  
                                })
                                .style("opacity", 1)
                                .raise();

                            self.ctrlr.popup.pop(event, self.ctrlr.mainController.dataStore.findNodeByIndex(d.index));

                        })
                        .on('mouseout', (event: any, d: any) => {

                            self.ctrlr.popup.close();

                            d3.select(event.target)
                                .attr("fill", (dd: any) => {
                                    return "#aaa"; //color(names[d.index]);   
                                })

                            self.ctrlr.svg.layers.data
                                .selectAll("path.source-" + matchPeerSlugByIndex(d.index))
                                .attr("fill", "#ddd")
                                .style("opacity", (dd: any) => {

                                    // console.log(dd);

                                    let source = self.main.graphData.nodes.find( (n:any) => n.id === dd.source.index);
                                    let target = self.main.graphData.nodes.nodes.find( (n:any) => n.id === dd.target.index);
                                    
                                    if (source && target) {
                                    
                                        return (source.connected && target.connected) ? .333 : 0;

                                    } else {
                                        console.log("could not find source or target")
                                        console.log(dd.source, dd.target)
                                    }  
                                })
                        })
                        .on('click', function (event: any, d: any) {
                          //  let p = self.mainController.dataStore.findNodeByIndex(d.index);
                           // self.mainController.openPanel(p.peerId);
                        });
            },
                (update : any) => {

                    update
                        .attr("d", this.ctrlr.coreCircle.arc);

                }
            )
            ;

            this.ctrlr.svg.layers.data.select("g.nodes").selectAll("text")
                .data(nodes, (d: any) => {
                    return matchPeerSlugByIndex(d.index);
                })
                .join(

                    (enter: any) => {
                        
                        enter
                            .append("text")
                            .attr("dy", -3)
                            .attr("text-anchor","middle")
                            .append("textPath")
                            .attr("xlink:href", "#core-circle-path")
                            .text((d: any) => {
                                
                                let name = matchPeerSlugByIndex(d.index);  
                                
                                if(name != undefined) {
                                    return (name.length > 3) ? ".." + name.substr(name.length - 5) : name;
                                } else {
                                    return "";
                                }
                            });
                    },

                    (update: any) => {

                        update.select("textPath")
                            .attr("startOffset", (d: any, i: number, el: any) => self.ctrlr.coreCircle.labels(nodes, d));
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