import * as d3 from "d3";
import { ChartObjects, ChartSVG, ChartDimensions, ChartScale, ChartAxesV2 } from '../chart-basics/module';
import { Dimensions } from '../types/dimensions';

import { GraphObject } from '../types/graphObject';
import { IGraphMappingV3, IMappingOption, Mapping } from '../types/mapping';
import { HtmlPopup} from '../html-elements/module';
import { DataPart } from "../types/data";
import { IChartDimensions } from "../chart-basics/chart-dimensions";
import { IGraphConfigV3 } from "../types/graphConfig";

export interface IGraphControllerV3 {

    main: any, // main controller 
    config: IGraphConfigV3,
    element: HTMLElement,
    svgWrapper?: HTMLElement,
    dimensions: Dimensions,
    svg: any;

    // classes 
    chartDimensions : IChartDimensions,
    chartSVG? : any,
    popup? : any,

    scales: any;
    axes: any;
    parameters: any;

    update: (data: any, update: boolean) => void
}




export class GraphControllerV3 implements IGraphControllerV3  {


    config : IGraphConfigV3;
    dimensions: Dimensions;
    svg: any;

    chartDimensions : IChartDimensions;
    chartSVG: any;

    element: HTMLElement;
    scales: any;
    axes: any;
    parameters: any;
    popup: any;

    constructor(
        public main: any,
        public elementId : string,
    ) {
        this.element = d3.select('#' + elementId).node() as HTMLElement;
     //   this.firstMapping = false; // this.mapping.parameters[0] && this.mapping.parameters[0][0] ? getParameter(this.mapping,0) : false;
        this.parameters = {};
        this.scales = {};
        this.axes = {};
        this.config = { margin: { top: 0, bottom: 0, left: 0, right: 0 }, padding: { top: 0, bottom: 0, left: 0, right: 0 }, scales: [], axes: [], extra: {} }
    }

    _init() {

        let self = this;

        // add .. overrule from config.scales
        for (let s of this.config.scales.filter( (s) => s.parameter && s.parameter != null)) {
            this.parameters[s.slug] = s.parameter;
        }

        let chartObjects = ChartObjects();
        this.config = Object.assign(chartObjects.config(),this.config);
        this.dimensions = chartObjects.dimensions();
        this.svg = chartObjects.svg();
 
    }

    _svg(svgWrapper?: HTMLElement) {
        // with elementID we can create a child element as svg container with a fixed height. 
        this.element = d3.select(svgWrapper ? svgWrapper : this.element).node();
        this.chartDimensions = new ChartDimensions(this.element, this.config);
        this.dimensions = this.chartDimensions.measure(this.dimensions);

        this.chartSVG = new ChartSVG(this.element, this.config, this.dimensions, this.svg);

        for (let c of this.config.scales) {
            this.scales[c.slug] = new ChartScale(this,c)
        }

        for (let c of this.config.axes) {
            this.axes[c.slug] = new ChartAxesV2(this, c);

        }
    }

    redraw(data: any) {

        if(this.svg && this.svg.body == undefined) return;

        this.dimensions = this.chartDimensions.measure(this.dimensions);
 
        this.chartSVG.redraw(this.dimensions);

        if (this.config.scales) {
            for (let c of this.config.scales) {    
                this.scales[c.slug].reset()
            }
        }

        for (let a of this.config.axes) {
            this.axes[a.slug].redraw(this.dimensions,this.scales[a.scale].scale, data.slice)
        }
    }

    draw(data: any) {

    }


    prepareData(data: any) {

    }

    _update(newData: any, update: boolean) {

        let self = this;

        if(update && this.config.extra.noUpdate) { return; }

        // if (this.mapping.description) {
        //     this.popup.attachData(newData);
        // }

        let data = self.prepareData(newData);
        self.draw(data);
        self.redraw(data);
        window.addEventListener("resize", () => self.redraw(data), false);

        // if(this.mapping.segmentIndicator) {
        //     this.htmlSegment.draw(segment);
        // }
    }

    update(data: any, update: boolean) { }

    _addScale(slug: string, type: string, direction: string, parameter?: string) {

        this.config.scales.push({
            slug,
            type,
            direction,
            parameter
        })
    }

    _addAxis(slug: string, scale: string, position: string, format?: string, extra?: string, label?: string) {

        this.config.axes.push({
            slug,
            scale,
            position,
            format,
            extra,
            label
        })
    }

    _addMargin(top: number,bottom: number,left: number,right: number) {

        this.config.margin = {
            top,
            bottom,
            left,
            right
        }
    }

    _addPadding(top: number,bottom: number,left: number,right: number) {

        this.config.padding = {
            top,
            bottom,
            left,
            right
        }
    }
}