import { NodesmithProvider } from "@ethersproject/providers";
import * as d3 from "d3";
import { stubString } from "lodash";
import { Coordinates, GraphNode, NetworkData } from "../../interfaces";
import { Dimensions } from "../types/dimensions";

export class CircularThings {

    arc: any;
    ribbon: any;
    connection: any;
    chord: any;
    innerRadius: number;
    outerRadius: number;
    circlePath: any;


    constructor(
        private ctrlr: any, 
        private radiusOffset: number,
        private slug: string
    ) {
        this.init();
        this.redraw();
        this.resupply({ nodes: [], links: []});
    }

    init() {

        this.circlePath = this.ctrlr.svg.layers.data
            .attr("transform","translate(" + this.ctrlr.dimensions.width / 2 + "," + this.ctrlr.dimensions.height / 2 + ")")
            .append("path")
            .attr("id", this.slug + "-circle-path")
            .attr("fill","none");
    }

    resupply(data: NetworkData) {
        this.arcRedraw(data);
        this.ribbonRedraw(data);
        this.chordReassign();
    }

    redraw() {

        this.innerRadius = Math.min(this.ctrlr.dimensions.width, this.ctrlr.dimensions.height) * .4 - this.radiusOffset;
        this.outerRadius = this.innerRadius + 16

        let innerRadius = this.innerRadius;
        let outerRadius = this.outerRadius;

        this.circlePath
            .attr("d", d3.arc()({
                innerRadius, 
                outerRadius, 
                startAngle: 0, 
                endAngle: 2 * Math.PI
            }));
    }

    arcRedraw(data: NetworkData) {

        let self = this;
        let  { items, minItems } = this._filterNodes();

        function arcStartAngle(d: any) {

            let index = items.map ( i => i.index).indexOf(d.index); // d.index > 0 ? d.index - 1 : 0; // 
            let division = minItems > 0 ? (2 * Math.PI) / minItems : 0
            let angle = division * (index - 0.5);

            return angle;
        }
    
        function arcEndAngle(d: any) {

            let index = items.map ( i => i.index).indexOf(d.index); //d.index > 0 ? d.index - 1 : 0;
            let division = minItems > 0 ? (2 * Math.PI) / minItems : 0
            let angle = division * (index + 0.5);

            return angle;
        }

        // console.log(this);
   
        this.arc = d3.arc()
            .innerRadius((d: any) => this.innerRadius)
            .outerRadius((d: any) => this.outerRadius)
            .startAngle(arcStartAngle)
            .endAngle(arcEndAngle);
    }

    ribbonRedraw(data: NetworkData) { 

        let self = this;
        let  { items, minItems } = this._filterNodes();

        function startAngle(d: any, i: number, arr: any) {
            
            let index = items.map ( i => i.index).indexOf(d.index); // d.index > 0 ? d.index - 1 : 0; // 
            let division = minItems > 0 ? (2 * Math.PI) / minItems : 0
            let angle = division * (index - 0.5);

            return angle; d.startAngle;
        }

        function endAngle(d: any) {

            let index = items.map ( i => i.index).indexOf(d.index); // d.index > 0 ? d.index - 1 : 0; // 
            let division = minItems > 0 ? (2 * Math.PI) / minItems : 0
            let angle = division * (index + 0.5);

            return angle; d.endAngle;
        }

        this.ribbon = d3.ribbonArrow()
            .radius((d: any) => this.innerRadius)
            .padAngle((d: any) => 12 / this.innerRadius)
            .startAngle(startAngle)
            .endAngle(endAngle);
    }

    connectionPath(d: any, el: any) {

        let satL: Coordinates;
        let satR: Coordinates;
        let peerL: Coordinates;
        let peerR: Coordinates;

      if (el && el.classList.item(1)) {

        let sats : any = d3.select("path.satelite.id-" + el.classList.item(1).substring(7));

        if (sats.node() != null ) {

            const bbox = sats.node().getBBox();
            satL = { x: bbox.x + 2, y: bbox.y + bbox.height}
            satR = { x: bbox.x + bbox.width - 2, y: bbox.y + bbox.height}
        }
      }

      if (el.classList.item(2) && el.classList.item(2).substring(7,8) != "1") {

        let peers: any = d3.select("path.node." + el.classList.item(2).substring(7));

          if (peers.node() != null ) {
    
                const bbox = peers.node().getBBox();
                peerL = { x: bbox.x + 2, y: bbox.y}
                peerR = { x: bbox.x - 2 + bbox.width, y: bbox.y }
          }
      }

      if (satL && satR && peerL && peerR) {

        return 'M' + satL.x + ' ' + satL.y +
        ' L' + satR.x + ' ' + satR.y +
        ' L' + peerR.x + ' ' + (peerR.y - 16) +
        ' L' + (peerL.x + (peerR.x - peerL.x) / 2)  + ' ' + (peerR.y - 1) +
        ' L' + peerL.x + ' ' + (peerL.y - 16) +
        ' L' + satL.x + ' ' + satL.y +
        ' Z';
      }
    }

    chordReassign() {

        let self = this;

        this.chord = d3.chordDirected()
            .padAngle(12 / this.innerRadius)
            .sortSubgroups(d3.descending)
            .sortChords(d3.descending);
    }

    labels(data: NetworkData, d: any) {

        let  { items, minItems } = this._filterNodes();
        let index = items.map ( i => i.index).indexOf(d.index);

        let division = minItems > 0 ? (2 * Math.PI) / minItems : 0
        let angle = division * index;
        return angle * this.outerRadius;
    }

    findNode(data: NetworkData, index: number) : GraphNode {
        return data.nodes[index];
    }

    nrOfNodes(data: NetworkData) {
        return data.nodes.length;
    }

    _filterNodes() {

        let items: any[] = [];
        let minItems: number;

        // switch (this.slug) {

        //     case "core": 
                items = this.ctrlr.main.graphData.nodes;
                minItems = items.length - 1;
            //     break;
            // case "satelite":
            //     items = this.ctrlr.mainController.dataStore.satelites;
            //     minItems = 40
            //     break;
        //}

        return { items, minItems}
    }
}