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
exports.ChartAxes = void 0;
const d3 = __importStar(require("d3"));
// import {getMonth, getMonthFromNumber} from "../utils/date-object.utils";
class ChartAxes {
    constructor(config, svg, position, scale) {
        this.config = config;
        this.svg = svg;
        this.position = position;
        this.scale = scale;
        this.draw();
    }
    draw() {
        this.axisGroup = this.svg.layers.axes.append("g");
        switch (this.position) {
            case 'bottom':
                this.axisGroup
                    .attr('class', 'x-axis');
                this.axis = d3.axisBottom(this.scale);
                break;
            case 'center':
                this.axisGroup
                    .attr('class', 'x-axis');
                this.axis = d3.axisBottom(this.scale);
                break;
            case 'top':
                this.axisGroup
                    .attr('class', 'x-axis');
                this.axis = d3.axisTop(this.scale);
                break;
            case 'left':
                this.axisGroup
                    .attr('class', 'y-axis');
                this.axis = d3.axisLeft(this.scale);
                break;
            case 'right':
                this.axisGroup
                    .attr('class', 'y-axis');
                this.axis = d3.axisRight(this.scale);
                break;
            default:
                return false;
        }
    }
    redraw(type, dimensions, scale) {
        switch (type) {
            case 'band':
                this.axis
                    .tickFormat((d, i) => {
                    // return (window.innerWidth < 640) ? (i + 1) : d;
                    return d;
                });
                break;
            case 'linear':
                this.axis
                    .ticks(4);
                break;
            //    case 'time' :
            //        let tickOrder: number, tickSpread;
            //        if(this.config.extra.xScaleTicks === 'quarterly') {
            //            tickOrder = 'timeMonth';
            //            tickSpread = 3
            //        } else {
            //            tickOrder = this.config.extra.xScaleTicks;
            //            tickSpread = (window.innerWidth > 700) ? 1 : 3;
            //        }
            //        this.axis
            //            .ticks(d3[tickOrder].every(tickSpread))
            //            .tickFormat( date => (d3.timeYear(date) < date) ? localTime.format('%b')(date) : localTime.format('%Y')(date));
            //        break;
            //    case 'bandTime' :
            //        this.axis
            //            .ticks(d3[this.config.extra.xScaleTicks].every(1))
            //            .tickFormat( date => localTime.format('%d %b')(new Date(date)));
            //        break;
            case 'stacked':
                this.axis
                    .ticks(10, "%");
                break;
            case 'stackedNormalized':
                this.axis
                    .ticks(10, "%");
                break;
            default:
        }
        switch (this.position) {
            case 'bottom':
                this.axisGroup
                    .attr("transform", "translate(" + 0 + "," + (dimensions.height) + ")");
                break;
            case 'top':
                this.axisGroup
                    .attr("transform", "translate(" + 0 + "," + 0 + ")");
                break;
            case 'left':
                this.axisGroup
                    .attr("transform", "translate(" + 0 + "," + 0 + ")");
                break;
            case 'right':
                this.axisGroup
                    .attr("transform", "translate(" + 0 + "," + dimensions.width + ")");
                break;
            default:
        }
        this.axisGroup
            .transition()
            .duration(1000)
            .call(this.axis.scale(scale));
        if (this.config.extra.alternateTicks && this.position === 'bottom') {
            this.svg.layers.axes.selectAll("g.x-axis g.tick text")
                .attr("dy", (d, i) => {
                return (i % 2 == 0) ? 16 : 32;
            });
        }
    }
}
exports.ChartAxes = ChartAxes;
//# sourceMappingURL=chart-axes.js.map