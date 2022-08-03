import { localTime } from '../helpers/_formats';
import * as d3 from "d3";
// import {getMonth, getMonthFromNumber} from "../utils/date-object.utils";
import { convertToCurrency } from '../helpers/_helpers';
import { Dimensions } from '../types/dimensions';
import { DataPart, GraphData } from '../types/data';
import { breakpoints } from '../helpers/_breakpoints';
import { IGraphControllerV3 } from '../graphs/graph-v3';
import { Axis, AxisDomain } from 'd3';
import { shortName } from '../helpers/peers';

export class ChartAxesV2 {

    axis: Axis<AxisDomain>;
    axisGroup: any;

    constructor(
        private ctrlr: IGraphControllerV3,
        private config: any
    ) {
        this.draw();
    }

    draw () {

        this.axisGroup = this.ctrlr.svg.layers.axes.append("g");

        switch (this.config.position) {

            case 'bottom' :
            case 'belowBottom':

                this.axisGroup
                    .attr('class', 'x-axis');

                this.axis = d3.axisBottom(this.ctrlr.scales[this.config.scale]);

                break;

            case 'center' :

                this.axisGroup
                    .attr('class', 'x-axis');

                this.axis = d3.axisBottom(this.ctrlr.scales[this.config.scale]);

                break;

            case 'top' :

                this.axisGroup
                    .attr('class', 'x-axis');

                this.axis =  d3.axisTop(this.ctrlr.scales[this.config.scale]);

                break;

            case 'left' :

                this.axisGroup
                    .attr('class', 'y-axis');

                this.axis = d3.axisLeft(this.ctrlr.scales[this.config.scale]);

                break;

            case 'right' :

                this.axisGroup
                    .attr('class', 'y-axis');

                this.axis = d3.axisRight(this.ctrlr.scales[this.config.scale]);

                break;

            default :

                return false;
        }
    }

    redraw(dimensions: Dimensions, scale: any, data: DataPart[]) {

           switch (this.ctrlr.scales[this.config.scale].config.type) {

               case 'band' :

                   this.axis
                       .tickFormat( (d: any, i: number) => {
                          return shortName(d);
                       })
                   break;

               case 'linear' :

                    if (this.config.format === "percentage") {

                        this.axis
                        .ticks(5)
                        .tickFormat( d => d + "%")

                    } else  {

                        this.axis
                            .ticks(4);
                    }

                   break;


               case 'time' :

                   let tickOrder : any , tickSpread : number;

                //    if(this.ctrlr.config.extra.xScaleTicks === 'quarterly') {

                       tickOrder= 'timeMonth';
                       tickSpread = (window.innerWidth < breakpoints.sm) ? 12 : 3;

                //    } else {

                //        tickOrder = this.ctrlr.config.extra.xScaleTicks;
                //        
                //    }

                //    this.axis
                //        .ticks(d3[tickOrder].every(tickSpread))
                //        .tickFormat( date => (d3.timeYear(date) < date) ? localTime.format('%b')(date) : localTime.format('%Y')(date));

                //    break;

            //    case 'bandTime' :

            //        this.axis
            //            .ticks(d3[this.ctrlr.config.extra.xScaleTicks].every(1))
            //            .tickFormat( date => localTime.format('%d %b')(new Date(date)));
            //        break;

               case 'stacked' :

                   this.axis
                       .ticks(10, "%");
                   break;

               case 'stackedNormalized' :

                   this.axis
                       .ticks(10, "%");
                   break;

               default :
           }

            switch (this.config.position) {

                case 'bottom' :

                    this.axisGroup
                        .attr("transform", "translate(" + 0 + "," + (dimensions.height) + ")")
                    break;

                case 'belowBottom' :

                    this.axisGroup
                        .attr("transform", "translate(" + 0 + "," + (dimensions.height + 0) + ")")
                    break;

                case 'top' :

                    this.axisGroup
                        .attr("transform", "translate(" + 0 + "," + 0 + ")");
                    break;

                case 'left' :

                    this.axisGroup
                        .attr("transform", "translate(" + 0 + "," + 0 + ")");
                    break;

                case 'right' :

                    this.axisGroup
                        .attr("transform", "translate(" + (dimensions.width + this.ctrlr.config.padding.right) + "," + 0 + ")");
                    break;

                default :
            }

         
            this.axisGroup
                .transition()
                .duration(200)
                .call(this.axis.scale(scale));

            // if(this.ctrlr.mapping.args && this.ctrlr.mapping.args[0] === "alternateTicks") {

            //     if (window.innerWidth < breakpoints.sm) {

            //         this.ctrlr.svg.layers.axes.selectAll("g.x-axis g.tick text")
            //         .attr("text-anchor","end")
            //         .attr("transform","translate(-10,0) rotate(-45)")
            //         // .attr("dy", (d,i) => {
            //         //     return (i % 2 == 0 ) ? 16 : 32
            //         // } );


            //     } else {

            //         this.ctrlr.svg.layers.axes.selectAll("g.x-axis g.tick text")
            //         .attr("dy", (d: any, i: number) => {
            //             return (i % 2 == 0 ) ? 16 : 32
            //         } );
            //     }

                
            // }

            // if(['weekly','monthly','quarterly','yearly'].indexOf(this.config.format) > -1) {

            //     const offset = (this.ctrlr.dimensions.width / data.length) / 2;

            //     this.ctrlr.svg.layers.axes.selectAll("g.x-axis g.tick text")
            //         .attr("dx", offset);

            //     this.ctrlr.svg.layers.axes.selectAll("g.x-axis g.tick line")
            //         .attr("x1", offset)
            //         .attr("x2", offset)
            //     ;
            // }
    }
}

