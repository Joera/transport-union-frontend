"use strict";
// import { colours} from "../../_styleguide/_colours";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Network = void 0;
class Network {
    constructor(config, svgLayers) {
        this.config = config;
        this.svgLayers = svgLayers;
    }
    draw(data) {
        this.linkGroup = this.svgLayers.data.append("g")
            .selectAll("line")
            .data(data.links)
            .enter()
            .append("line");
        this.nodeGroup = this.svgLayers.data.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(data.nodes)
            .enter()
            .append("circle")
            .attr("r", 6);
        // .call(d3.drag()
        //     .on("start", dragstarted)
        //     .on("drag", dragged)
        //     .on("end", dragended));
    }
    redraw(dimensions, xScale, yScale) {
    }
}
exports.Network = Network;
//# sourceMappingURL=network.js.map