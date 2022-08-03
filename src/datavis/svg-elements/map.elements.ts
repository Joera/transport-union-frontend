import * as d3 from "d3";
import { slugify } from '../helpers/_helpers';
import {breakpoints} from "../helpers/_breakpoints";
import { GraphControllerV3 } from "../graphs/graph-v3";
import { GraphData } from "../types/data";

export default class MapElements   {
    projection: any;
    path: any;

    constructor(
        private ctrlr: GraphControllerV3,
    ) {
        this.init();
    }


    init() {

        this.projection = d3.geoMercator();
        this.path = d3.geoPath()
            .projection(this.projection);

        var s = 105, // .15 / Math.max((b[1][0] - b[0][0]) / this.ctrlr.dimensions.svgWidth, (b[1][1] - b[0][1]) / this.ctrlr.dimensions.height),
            t = [this.ctrlr.dimensions.width / 2, this.ctrlr.dimensions.height / 1.5] // [((this.ctrlr.dimensions.svgWidth - s * (b[1][0] + b[0][0])) / 2) + 100, ((this.ctrlr.dimensions.height - s * (b[1][1] + b[0][1])) / 2)  - 60];

        this.projection
            .scale(s)
            .translate(t)
        ;
    }


    draw(data: GraphData) {
        let self = this;

        this.ctrlr.svg.map = this.ctrlr.svg.layers.data.selectAll("path")
            .data(data.backgroundFeatures)
            .join("path")
            // .attr("class", (d: any, i: number) => slugify(d.properties.gemeentenaam))
            .attr("d", this.path)
            .attr("fill", "#eee")
            // .attr("stroke", "#fff")
            ;

        this.ctrlr.svg.nodes = this.ctrlr.svg.layers.data.selectAll("circle")
            .data(data.features)
            .join("circle")
            // .attr("class", (d: any, i: number) => slugify(d.properties.gemeentenaam))
            .attr("r", 2)
            .attr("fill", "#000")
            // .attr("stroke", "#fff")
            ;


    }

    redraw() {

        let self = this;

        this.ctrlr.svg.nodes
            .attr("transform", (d: any) => {
                return "translate(" + this.projection([
                d.geometry.coordinates[0],
                d.geometry.coordinates[1]
                ]) + ")";
            })


    }

}
