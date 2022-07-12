import { Coordinates, GraphNode, NetworkData } from "../../interfaces";
import NodeContent from "./node.content";
import LocalPeerContent from "./localpeer.content";
import colours from "../utils/colours.utils";

export class HtmlPopup {

    popupElement = document.getElementById('img-dashboard_popup');
    nodeContent: any;
    localPeerContent: any;
    data: NetworkData;

    constructor(
        private ctrlr: any,
    ){
       this.nodeContent = new NodeContent();
       this.localPeerContent = new LocalPeerContent();
    }


    pop(event: any, node: GraphNode) {

        const popupWidth = 200;
        const popupHeight = 200;

        this.popupElement.innerHTML = '';
        const targetPosition = event.target.getBoundingClientRect();

        const svg = [].slice.call(document.getElementsByTagName("svg"))[0];
        const svgPosition = svg.getBoundingClientRect();

        const center: Coordinates = {
            x: svgPosition.x + svgPosition.width / 2,
            y: svgPosition.y + svgPosition.height / 2
        }
     
        const pielleke = document.createElement('div');
        pielleke.classList.add('pielleke');
        pielleke.style.width = '1rem';
        pielleke.style.height = '1rem'
        pielleke.style.position = 'absolute';
        
        pielleke.style.pointerEvents = 'none';
        pielleke.style.zIndex = "0";

        const pOffset = 10;
        
        if (targetPosition.x <= center.x && targetPosition.y <= center.y) {
            // top left
            pielleke.style.top = '1rem';
            pielleke.style.transform = 'rotate(-45deg)';
            pielleke.style.left = -pOffset.toString() + "px";
            pielleke.style.right = "auto"
            this.popupElement.style.left = (3 * pOffset + targetPosition.x).toString()  + "px";
            this.popupElement.style.top = (-16 + targetPosition.top /* + window.scrollY */ ).toString() + 'px';

            
        } else if (targetPosition.x > center.x && targetPosition.y <= center.y) {
            // top right
            pielleke.style.top = '1rem';
            pielleke.style.transform = 'rotate(135deg)';
            pielleke.style.right = -pOffset.toString() + "px";
            pielleke.style.left = "auto"
            this.popupElement.style.left = (1 * -pOffset + targetPosition.x - popupWidth).toString()  + "px";
            this.popupElement.style.top = (-16 + targetPosition.top /* + window.scrollY */ ).toString() + 'px';
            
        } else if (targetPosition.x <= center.x && targetPosition.y > center.y) {
            // bottom left
            pielleke.style.bottom = '1rem';
            pielleke.style.top = "auto"
            pielleke.style.transform = 'rotate(315deg)';
            pielleke.style.left = -pOffset.toString() + "px";
            pielleke.style.right = "auto"
            this.popupElement.style.left = (3 * pOffset + targetPosition.x).toString()  + "px";
            this.popupElement.style.top = (30 + targetPosition.top  - popupHeight/* + window.scrollY */ ).toString() + 'px';

            
        } else if (targetPosition.x > center.x && targetPosition.y > center.y) {
            // bottom right
            pielleke.style.bottom = '1rem';
            pielleke.style.top = "auto"
            pielleke.style.transform = 'rotate(135deg)';
            pielleke.style.right = -pOffset.toString() + "px";
            pielleke.style.left = "auto"
            this.popupElement.style.left = (2 * -pOffset + targetPosition.x - popupWidth).toString()  + "px";
            this.popupElement.style.top = (40 + targetPosition.top - popupHeight/* + window.scrollY */ ).toString() + 'px';
        }

        let html: string;

        switch (event.target.classList.item(0)) {

            case "node":

                html = this.nodeContent.html(node);
                this.popupElement.style.background = colours.lightGrey[0];
                this.popupElement.style.borderColor = colours.lightGrey[0];
                pielleke.style.background = colours.lightGrey[0];
                pielleke.style.borderLeft = '1px solid ' + colours.lightGrey[0];
                pielleke.style.borderTop = '1px solid ' + colours.lightGrey[0];
                break;
            case  "satelite": 
                html = this.localPeerContent.html(node);
                this.popupElement.style.background = colours.orange[0];
                this.popupElement.style.borderColor = colours.orange[0];
                pielleke.style.background = colours.orange[0];
                pielleke.style.borderLeft = '1px solid ' + colours.orange[0];
                pielleke.style.borderTop = '1px solid ' + colours.orange[0];
                break;

        }

        this.popupElement.append(pielleke);
        this.popupElement.append(html);
        this.popupElement.style.display = "block" // (this.popupElement.style.display === 'none') ? "block" : "none";
    }

    close() {

        this.popupElement.style.display = 'none';
    }

}
