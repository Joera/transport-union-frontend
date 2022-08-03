import { matchPeerName } from "../helpers/peers";
import { IMainController } from "../../controllers/main.controller";
import { GraphControllerV3 } from "./graph-v3";
import { GraphNode, MatrixData } from "../../interfaces";
import HeatmapElements from "../svg-elements/heatmap.elements";

export class MatrixGraph extends GraphControllerV3 {

    element: HTMLElement;
    // yParameter;
    dimensions: any;
    svg: any;

    chartDimensions: any;
    chartSVG: any;

    color: any;

    popup: any;
    heatmapElements: any;

    constructor(
        public main: any,
        public elementId: string,
    ){
        super(main,elementId)
        this.pre();
        this.init();
    }

    pre() {
        this._addMargin(0,0,0,0);
        this._addPadding(60,0,90,60);

        this._addScale('x','band','horizontal','peerId');
        this._addScale('y','band','vertical','peerId');

        this._addAxis('x','x','top');
        this._addAxis('y','y','left');

       
    }

    init() {

        let self = this;

        super._init();

        this.config.paddingInner = 0;
        this.config.paddingOuter = 0;

        const svgId = "svg-wrapper-matrix"; // + this.mapping.slug
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'row';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        container.style.width = "100%";
        // container.style.maxWidth = "400px"
        container.style.height = "100%";
        container.id = svgId;
        this.element.appendChild(container);

        super._svg(container);

        this.heatmapElements = new HeatmapElements(this.main,this)


   //     this.popup = new HtmlPopup(this);

    }

    prepareData()   {

        const nodes = this.main.peers.peers;

        nodes.forEach ( (p:GraphNode,i: number ) => {
            p.index = i
        })

        const index = new Map(nodes.map((n: any, i: number) => [n.peerId, i]));
        let matrix = Array.from(index, () => new Array(nodes.length).fill(0));

       // console.log(this.main.graphData.neighbors);

        for (const node of nodes) {

         //   console.log(node);

            for (const nPeerId of node.kademlia_neighbors) {

            //    console.log("yooooo");

                let neighborNode = nodes.find( (n: any) => n.peerId === nPeerId);
                
                if(neighborNode != undefined) {
            
                    matrix[node.index][neighborNode.index] = 1;
                }
                // one way only 
                // matrix[target][source] = 1;
            }

            for (const n of node.tested_connections) {
            
                matrix[node.index][n] = 2;
                // one way only 
                // matrix[target][source] = 1;
            }
        }

      //  console.log(matrix);
        // this.sateliteCircle.resupply(networkData);
        // const sateliteChords = this.coreCircle.chord(networkData.matrix);

        const data = { nodes, matrix }; 

        // console.log(data);

        return data;
    }

    draw(data: MatrixData) {
        
        this.scales.x.set(data.nodes.map(d => d['peerId']));
        this.scales.y.set(data.nodes.map(d => d['peerId']));

        this.heatmapElements.draw(data.nodes, data.matrix);
    }

    redraw(data: MatrixData) {

          super.redraw(data);
          this.scales.y.scale.range([0,this.dimensions.width]);
          
          this.axes.y.redraw(this.dimensions,this.scales.y.scale,data);

          this.svg.layers.axes.selectAll("g.x-axis g.tick text")
            .attr("text-anchor","start")
            .attr("transform","translate(10,0) rotate(-45)");
            // .attr("dy", (d: GraphNode,i: number) => {
            //     return (i % 2 == 0 ) ? 16 : 32
            // } );
        //   this.axes.y.axis.tickFormat( (d: string) => d.substring(20));
          this.heatmapElements.redraw(data.nodes, data.matrix);

    }
  
    update(data: MatrixData, update: boolean) {
        super._update(data,update);
    }


}