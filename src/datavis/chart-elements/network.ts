// import { colours} from "../../_styleguide/_colours";
import * as d3 from "d3";

import { GraphLink, GraphNode, NetworkData } from "../../interfaces";
import { Dimensions } from "../types/dimensions";
import { matchPeerSlug } from "../helpers/peers";

export class Network  {

    linkGroup: any;
    nodeLayer: any;
    nodeGroups: any;
    nodeGroup: any;
    node: any;
    labelLayer: any;
    labelGroups: any;
    labelGroup: any;
    labelGroupHeader: any;
    labelGroupList: any;
    labelGroupListItem: any;
    htmlGroup: any;
    links: any;
    nodes: any;
    labels: any;
    descriptions: any;
    html: any;

    myServices: any;
   
    
    constructor(
       
        private mainController: any,
        private graphController: any

        // private dataStore: any
        // private config: any,
        // private svgLayers: any,
        // elementID: string
    ){

      //  super(elementID)
        this.linkGroup = this.graphController.svg.layers.data.append("g")
            .attr("class", "links");

        this.nodeLayer = this.graphController.svg.layers.data.append("g")
            .attr("class", "nodes");

        this.labelLayer= this.graphController.svg.layers.data.append("g")
            .attr("class","labels");

        this.htmlGroup = this.graphController.svg.layers.data.append("g")
            .attr("class","html");
    }   

    draw(data: NetworkData, dimensions: Dimensions, simulation: any) {

        let self = this;

        function dragstarted(event: any, d: any) {

            if (!event.active) simulation.s.alphaTarget(0.3).restart;
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }
      
        function dragged(event: any, d: any) {

            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }
      
        function dragended(event: any, d: any) {

            if (!event.active) simulation.s.alphaTarget(0);
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

       

        this.links = this.linkGroup.selectAll("line")
            .data(data.links, (d: GraphLink) => d)
            .join(
                (enter: any) => enter
                    .append("line")
                    .style("stroke", "#ccc")
                    .style("stroke-width", "1px")
                    .attr("class","link"),
                (exit: any) => exit.remove()
            )
            
        this.nodeGroups = this.nodeLayer
            .selectAll("g.node");

        this.nodeGroups   
            .data(data.nodes, (d: GraphNode) => d)
            .join(

                (enter: any) => { 
                    
                    let group = enter
                    .append("g")
                    .attr("class","node");

                    group
                        .append("circle")
                        .attr("class","peer")
                        .attr("r", 20)
                        .attr("id", (d:any) => d.peerId)
                        // .style("stroke", "#969696")
                        // .style("stroke-width", "0px")
                        .style("fill", (d: any) => {

                            // console.log('wie?');
                            // console.log(d);
                            // https://colorhunt.co/palette/f9ceeef9f3eeccf3ee97c4b8
                            switch(d.role) {
                                case "localPeer":
                                    return "#F9CEEE"
                                case "relayPeer":
                                    return  "#97C4B8"
                                default: 
                                    return d.connected ? "#CCF3EE" : "#F9F3EE"
                            }
                        })
                        .on('mouseover', function (event: any, d: any) {

                            d3.select(this)
                                    .style("cursor", "move")
                                    .transition()
                                    .duration(50)
                                    .attr('r', 60);

                            group.selectAll("circle.service")
                                    .style("opacity",0)
                                
                            if(!d.selected) {
                                self.mainController.dataStore.selectNode(d.peerId);
                                //    self.mainController.select(event.target.id);
                            }
                        })
                        .on('mouseout', function (event: any, d: any) {
                            d3.select(this).transition()
                                    .duration(50)
                                    .attr('r', 20)

                            group.selectAll("circle.service")
                            .style("opacity",1)
                            
                            if(d.selected) {
                                self.mainController.dataStore.unSelectNode(d.peerId);
                                //    self.mainController.select(event.target.id);
                            }
                        })
                        .on('click', function (event: any, d: any) {
                            d3.select(this).transition()
                                    .duration(50)
                                    .attr('r', 20)
            
                            self.mainController.openPanel(d.peerId);
                        })
                        .call(d3.drag()
                            .on("start", dragstarted)
                            .on("drag", dragged)
                            .on("end", dragended)
                        )
                        .transition(200)
                        .attr("r", (d:any) => {
                            return d.selected ? 60 : 20;
                        })

                    return group;
                },
                (update: any) => {
                    
                    return update

                },
                (exit: any) => exit.remove()
            )
            .selectAll("circle.service")
         //   .filter( (d: any) => d.role !== "localPeer")
            .filter( (d:any) => d.myServices != undefined)
            .data( (d: any) => d.myServices, (d: any) => d)
            .join( 
                (enter: any) => { 

                    let length = 8;
                    let parts =  360 / length;

                    

                    let radius = 16;

                    let services = enter
                        .append("circle")
                        .attr("class","service")
                        .attr("r", 3)
                        .style("stroke", (d: any) => {
                            return "#000";
                        })
                        .attr('cx', (d: any, i: number, a: any, more: any) => { 

                            

                            // let nodeCircle = this.nodeGroups.select("#" + d.peer_id);

                            // console.log(nodeCircle);
                             
                            return radius *  Math.cos((360 / a.length) * i)
                        })
                        .attr('cy', (d: any, i: number, a: any) => {
                            return radius *  Math.sin((360 / a.length) * i)
                        })


                    return services;
                }
            );
        
     
        this.labelGroups = this.labelLayer.selectAll("foreignObject.labelGroup")
            .data(data.nodes, (d: GraphNode) => d)
            .join(
                (enter: any) => { 
                    
                    let e = enter
                    .append("foreignObject")
                    .attr("class","labelGroup")
                    .attr("width","120px")
                    .attr("height","120px")
                    .style("overflow","visible")
                    .style("pointer-events","none");

                    // this.labelLayer.selectAll("foreignObject.labelGroup").each()
                    //     .append('xhtml:div');


                    return e;
                    
                },
                (update: any) => update,
                (exit: any) => exit.remove()
            );

            this.labelGroup = this.labelGroups
                .filter( (d: any) => d.role !== "localPeer")
                .append('xhtml:div')
                .attr("class","label")
                .style("with", "100%")
                .style("height", "100%")
                .style("display", "flex")
                .style("flex-direction", "column")
                .style("justify-content", "center")
                .style("align-items", "center");

            this.labelGroupHeader = this.labelGroup
                .append('h3')
                .html(  (d: any) => {    
                    let name = matchPeerSlug(d.peerId);     
                    return (name.length > 3) ? ".." + name.substr(name.length - 5) : name;
                })
                .attr("text-anchor", "middle")
                .style("text-align", "center")
                .style("font-size", (d: any) => {
                    return d.selected ? "12px" : "8px"
                })
                .style("fill", "#000")
                .style("margin", "0")
                .style("font-weight", "normal");


            this.labelGroupList = this.labelGroup
                .append('ul')
                .style("list-style", "none")
                .style("margin", "0")
                .style("padding", "0")
                .style( "display", (d: any) => {
                    return d.selected ? "block" : "none"
                });


            this.labelGroupList
                .filter( (d: any) => d.info !== undefined)
                .append('li')
                .style("font-size", "8px")
                .style("text-align", "center")
                .style("fill", "#000")
                .text( (d: any) => "node: " + d.info.node_version)
                ;

            this.labelGroupList
                .filter( (d: any) => d.info !== undefined)
                .append('li')
                .style("font-size", "8px")
                .style("text-align", "center")
                .style("fill", "#000")
                .text( (d: any) => "air: " + d.info.air_version)
                
        
                // .transition(500)
                // .attr("dy", (d:any) => {
                //     return d.selected ? "-40px" : "0";
                // });

        this.descriptions = this.labelLayer.selectAll("text.description")
            .data(data.nodes.filter( (d:any) => { 
                return d.role === "localPeer" || d.role === "relayPeer"
            }), (d: GraphNode) => d)
            .join(
                (enter: any) => enter
                    .append("text")
                    .text(  (d: any) => { 
                        
                        switch(d.role) {
                            case "localPeer": return "Local peer"
                            case "relayPeer": return "Relay peer"
                            default: return ""
                        }
                        
                        return d.role
                    })
                    .attr("class","description")
                    .style("font-size", "8px")
                    .style("fill", "#000")
                    .attr("dx", 40),
                (exit: any) => exit.remove()
            );

            // this.labelGroup.selectAll("text.label")
            //     .data(data.nodes, (d: GraphNode) => d)
            //     .join(
            //         (enter: any) => enter
            //             .insert("p")
            //             .text("kip")
            //     );

        // this.labelGroup.selectAll("text.label")
        //     .data(data.nodes.filter( (d:any) => d.info !== undefined), (d: GraphNode) => d)
        //     .join(
        //         (update: any) => update
        //             .append('<div><ul><li></li></ul></div>')
        //             .select('li')
        //             .text((d: any) => { return d.info.node_version; }),
        //         (exit: any) => exit.remove()
                    
                    
        //     );

    }



    redraw(data: NetworkData, dimensions: Dimensions) {

    }

    forceDirect() {

      //  console.log("u4 - force direct");

     //   if(this.links && this.links.length > 0 && this.nodes && this.nodes.length > 0) {

            // console.log("b");

            this.links
                .attr("x1", function(d:any) { return d.source.x; })
                .attr("y1", function(d: any) { return d.source.y; })
                .attr("x2", function(d: any) { return d.target.x; })
                .attr("y2", function(d: any) { return d.target.y; });

                this.nodeLayer.selectAll("g.node")
                .attr("transform", (d:any) => "translate(" + d.x + "," + d.y + ")");
              
                // .attr("cx", function (d:any) {
                //     return d.x;   
                // })
                // .attr("cy", function(d: any) {   
                //     return d.y;
                // })
                // ;
        
            this.labelGroups
                .attr("x", function (d:any) {
                    return d.x - 60; 
                })
                .attr("y", function(d: any) { 
                    return d.y - 60; 
                })
                ;

            this.descriptions 
                .attr("x", function (d:any) {
                    return d.x; 
                })
                .attr("y", function(d: any) { 
                    return d.y + 3; 
                })
                ;

            // this.html 
            //     .attr("x", function (d:any) {
            //         return d.x; 
            //     })
            //     .attr("y", function(d: any) { 
            //         return d.y + 9; 
            //     })
            //     ;
            
     //   }
    } 
}


