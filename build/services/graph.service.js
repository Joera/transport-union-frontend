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
const d3 = __importStar(require("d3"));
const module_1 = require("../datavis/chart-basics/module");
const module_2 = require("../datavis/chart-elements/module");
class GraphService {
    constructor(elementID) {
        this.elementID = elementID;
        this.config = {
            "graphType": "Network",
            "xScaleType": false,
            "yScaleType": false,
            "xParameter": false,
            "yParameter": false,
            "padding": {
                "top": 0,
                "bottom": 0,
                "left": 0,
                "right": 0
            },
            "margin": {
                "top": 0,
                "bottom": 0,
                "left": 0,
                "right": 0
            },
            "extra": {}
        };
        this.element = d3.select(elementID).node();
    }
    init(data) {
        let self = this;
        let chartObjects = (0, module_1.ChartObjects)();
        this.config = Object.assign(chartObjects.config(), this.config);
        this.dimensions = chartObjects.dimensions();
        this.svg = chartObjects.svg();
        // get dimensions from parent element
        this.chartDimensions = new module_1.ChartDimensions(this.element, this.config);
        this.dimensions = this.chartDimensions.get(this.dimensions);
        // create svg elements without data
        this.chartSVG = new module_1.ChartSVG(this.element, this.config, this.dimensions, this.svg);
        // get dimensions from parent element
        this.chartDimensions = new module_1.ChartDimensions(this.element, this.config);
        this.dimensions = this.chartDimensions.get(this.dimensions);
        this.network = new module_2.Network(this.config, this.svg.layers);
        self.update(data);
        //  this.legend();
    }
    prepareData(data) {
        return data;
    }
    draw(data) {
    }
    redraw(data) {
    }
    update(data) {
        let self = this;
        data = this.prepareData(data);
        this.draw(data);
        this.redraw(data);
        window.addEventListener("resize", () => self.redraw(data), false);
    }
}
exports.default = GraphService;
//# sourceMappingURL=graph.service.js.map