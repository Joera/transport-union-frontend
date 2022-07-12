"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartSVG = void 0;
const d3 = __importStar(require("d3"));
class ChartSVG {
    constructor(element, config, dimensions, svg) {
        this.element = element;
        this.config = config;
        this.dimensions = dimensions;
        this.svg = svg;
        this.render();
        this.layers();
    }
    render() {
        this.svg.body = d3.select(this.element)
            .append('svg')
            .style('overflow', 'visible');
    }
    redraw(dimensions) {
        this.svg.body
            .attr('height', dimensions.svgHeight)
            .attr('width', dimensions.svgWidth);
        this.svg.layers.legend
            .attr('transform', 'translate(' + this.config.padding.left + ',' + this.config.padding.top + ')');
    }
    layers() {
        this.svg.layers.underData = this.svg.body.append('g')
            .attr('class', 'under_data')
            .attr('transform', 'translate(' + this.config.padding.left + ',' + this.config.padding.top + ')');
        this.svg.layers.data = this.svg.body.append('g')
            .attr('class', 'data')
            .attr('transform', 'translate(' + (this.config.padding.left) + ',' + this.config.padding.top + ')');
        this.svg.layers.axes = this.svg.body.append('g')
            .attr('class', 'axes')
            .attr('transform', 'translate(' + this.config.padding.left + ',' + this.config.padding.top + ')');
        // separate svg?
        this.svg.layers.legend = this.svg.body.append('g')
            .attr('class', 'legend');
    }
}
exports.ChartSVG = ChartSVG;
//# sourceMappingURL=chart-svg.js.map