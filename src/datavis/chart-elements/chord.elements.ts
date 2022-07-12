import * as d3 from "d3";

import { GraphLink, GraphNode, NetworkData } from "../../interfaces";
import { Dimensions } from "../types/dimensions";
import colours from "../utils/colours.utils";



export default class ChordElements  {

    matchPeerSlugByIndex: any;

    nodeLayer: any;
    color: any;
    ribbon: any;
    chord: any;

    constructor(
        private mainController: any,
        private ctrlr: any
    ){

        this.ctrlr.svg.layers.data
            .append("g")
            .attr("class", "chords")
            .attr("fill-opacity", 0.75);
     } 

    draw(data: NetworkData, chords: any) {

        const sats = this.mainController.dataStore.satelites.map(  (s: any) => s.id);

        let peerChords = chords.filter( (chord: any) => {
            return sats.indexOf(chord.source.index) < 0 && sats.indexOf(chord.target.index) < 0
        })

        let self = this; 
        const matchPeerSlugByIndex = this.mainController.dataStore.matchPeerSlugByIndex.bind(this.mainController.dataStore);

        this.ctrlr.svg.layers.data.select("g.chords")
            .selectAll("path.chord")
            .data(peerChords, (d:any) => "s-" + matchPeerSlugByIndex(d.source.index) + "_t-" + matchPeerSlugByIndex(d.target.index))
            .join( 
                (enter: any) => 
                    
                    // deze mist dus nodes[1]
                    enter
                        .append("path")
                        .attr("d", this.ctrlr.coreCircle.ribbon)
                        .attr("class", (d:any) =>  "chord source-" + matchPeerSlugByIndex(d.source.index) + " target-" + matchPeerSlugByIndex(d.target.index))                    
                        .style("mix-blend-mode", "multiply")
                        .attr("fill", (d: any) => {
                
                            let node = self.mainController.dataStore.nodes[d.source.index];

                            if (node && node.role === "relayPeer") {
                                return colours.orange[0]; 
                            } else {
                                return colours.lightGrey[0]; 
                            }   
                        })
                        .style("opacity", (d: any) => {

                            // wat is de index van deze chords 
                           //  is dat de this.chord.group  of de data store ? 
                                              
                           // onderstaand is sowieso verkeerd
                            let source = self.mainController.dataStore.nodes[d.source.index];
                            let target = self.mainController.dataStore.nodes[d.target.index];
                                
                            if (source && target) {
                                return (source.connected && target.connected) ? .333 : 0;
                            }
                        })
                ,
                (update: any) => {

                        update
                            .attr("d", this.ctrlr.coreCircle.ribbon);
                }
            );

            // this.graphController.svg.layers.data.selectAll("path.chord.source-k0")
            //     .attr("fill", pink)

    }


    redraw(dimensions: Dimensions) {

        // this.innerRadius = Math.min(dimensions.width, dimensions.height) * 0.5 - 20;
        // this.outerRadius = this.innerRadius + 6
    }

}