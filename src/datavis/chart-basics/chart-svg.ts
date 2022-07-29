import * as d3 from 'd3';
import { Dimensions } from '../types/dimensions';
import { IGraphConfigV3 } from '../types/graphConfig';

export class ChartSVG {

    constructor(
        public element: HTMLElement,
        public config: IGraphConfigV3,
        public dimensions: Dimensions,
        public svg: any
    ) {
        this.render();
        this.layers();
    }


    render() {

        this.svg.body = d3.select(this.element)
            .append('svg')
            .style('overflow','visible');
    }

    redraw(dimensions: Dimensions) {

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



