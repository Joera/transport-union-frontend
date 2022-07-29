import * as d3 from "d3";

import * as topojson from "topojson-client";

import { MapElements } from "../svg-elements/module";
import { slugify } from "../utils/slugify.utils";
import { DataPart, GraphData } from "../types/data";
import { GraphControllerV3 } from "./graph-v3";
import { IGraphMappingV3 } from "../types/mapping";
// import { flattenColumn } from "../d3-services/_helpers";


export default class Map extends GraphControllerV3 {

    topojsonObject: any;

    scale: any;
    xScale: any;
    chartScale: any;
    features: any;
    mapElements: any;

    constructor(
        public main: any,
        public elementId : string,
    ) {
        super(main,elementId);
        this.pre();
        this.init();
    }

    pre() {
        this._addMargin(0,0,0,0);
        this._addPadding(20,40,40,0);
    }

    init() {

        this.config.margin.right = 25;
        super._init();

        const svgId = "svg-wrapper-map"; // + this.mapping.slug
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'row';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        container.style.width = "100%";
        // container.style.maxWidth = "400px"
        container.style.height = "100%";
        container.style.marginLeft = "-3%";
        container.id = svgId;
        this.element.appendChild(container);

        super._svg(container);
     
        this.mapElements = new MapElements(this);
        this.mapElements.init();

        // get geodata.js
        d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json').then( (topojsonObject) => {
            this.topojsonObject = topojsonObject;
            let data = this.prepareData([]);
            this.update(data,true);
        });
    }

    prepareData(data: DataPart[]) : GraphData  {

        let geojson: any = topojson.feature(this.topojsonObject, this.topojsonObject.objects.land);
        let backgroundFeatures = geojson.features;

        const features = [];

        for (let feature of this.main.peers.peers) {


        //     let muni = data.filter( (m) => {
        //         return m.gemeente === slugify(feature.properties.gemeentenaam).toLowerCase();
        //     })[0];

        //     if(muni && Object.entries(muni).length > 0) {
        //         for (let prop of Object.entries(muni)) {
        //             feature.properties[prop[0]] = prop[1];
        //         }
        //     }

            if(feature.location) {
            
                features.push({
                    "type": "Feature",
                    "geometry": {
                    "type": "Point",
                    "coordinates": [feature.location.longitude, feature.location.latitude]
                    },
                    "properties": feature
                });
            }
        }

        return {
            latest: null,
            slice: null,
            history: null,
            backgroundFeatures,
            features
        }
    }

    draw(data: GraphData) {
        this.mapElements.draw(data);    //   if (window.innerWidth < breakpoints.sm) {
    }

    redraw(data: GraphData) {

      //  this.scales.y.set(data.features.map( f => (f['properties'][this.parameters.y] !== undefined) ? f['properties'][this.parameters.y] : 0));
        super.redraw(data);
        this.mapElements.redraw();
    }

    update(data: GraphData, update: boolean) {
        super._update(data,update);
    }
}



