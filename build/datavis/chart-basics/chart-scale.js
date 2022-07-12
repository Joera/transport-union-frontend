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
exports.ChartScale = void 0;
const d3 = __importStar(require("d3"));
class ChartScale {
    constructor(type, config, dimensions) {
        this.type = type;
        this.config = config;
        this.dimensions = dimensions;
        this.dataLength = 0;
    }
    set(data, minValue) {
        let self = this;
        this.dataLength = data.length;
        switch (this.type) {
            case 'linear':
                return d3.scaleLinear()
                    .domain([
                    minValue || 0,
                    d3.max(data, (v) => (v ? v : 0))
                ]);
                break;
            case 'time':
                return d3.scaleTime()
                    .domain([
                    d3.min(data, (d) => (new Date(d) ? new Date(d) : 0)),
                    d3.max(data, (d) => (new Date(d) ? new Date(d) : 0)),
                ]);
                break;
            case 'band':
                return d3.scaleBand()
                    .domain(data)
                    .paddingInner(self.config.extra.paddingInner)
                    .paddingOuter(self.config.extra.paddingOuter)
                    .align(.5);
                break;
            case 'bandTime':
                return d3.scaleBand()
                    .domain(data)
                    .paddingInner(.2)
                    .paddingOuter(.5)
                    .align(.5);
                break;
            case 'radius':
                return d3.scalePow()
                    .domain([
                    d3.min(data, (v) => (v ? v : 0)),
                    d3.max(data, (v) => (v ? v : 0))
                ]).nice();
                break;
            case 'normalised':
                return d3.scaleLinear();
                break;
        }
    }
    reset(direction, dimensions, newScale) {
        switch (direction) {
            case 'horizontal':
                return newScale
                    .range([0, dimensions.width]);
                break;
            case 'vertical-reverse':
                return newScale
                    .range([0, dimensions.height]);
                break;
            case 'vertical':
                return newScale
                    .range([dimensions.height, 0]);
                break;
            case 'radius':
                let langsteZijde = dimensions.width > dimensions.height ? dimensions.width : dimensions.height;
                return newScale
                    .range([this.config.extra.minRadius, (langsteZijde / this.dataLength) * this.config.extra.radiusFactor]);
                break;
            case 'opacity':
                return newScale
                    .range([0.3, 1]);
        }
    }
}
exports.ChartScale = ChartScale;
//# sourceMappingURL=chart-scale.js.map