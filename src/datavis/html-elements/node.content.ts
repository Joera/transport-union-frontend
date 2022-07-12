import { GraphNode } from "../../interfaces";

export default class NodeContent {

    constructor() {

    }

    html(peerData: GraphNode) {

        let container = document.createElement("div");

        let header = document.createElement("h3");
        header.innerText = peerData.name ? peerData.name : "..." + peerData.peerId.substring(20)
        container.appendChild(header);

        // if (peerData.name != undefined) {

        //     let name = document.createElement("h4");
        //     name.innerText = peerData.name;
        //     container.appendChild(name);
        // }

        if (peerData.info != undefined) {

            let versionList = document.createElement("ul");
            let l1 = document.createElement("li");
            let l2 = document.createElement("li");
            l1.innerText = "node version: " + peerData.info.node_version;
            l2.innerText = "air version: " + peerData.info.node_version;
            versionList.appendChild(l1);
            versionList.appendChild(l2);
            container.appendChild(versionList)
        }

        if (peerData.info != undefined && peerData.info.external_addresses != undefined) {

            let adressList = document.createElement("ul");
            
            for (let a of peerData.info.external_addresses ) {
                let l = document.createElement("li");
                l.innerText = a.toString();
                adressList.appendChild(l);
            }

            container.appendChild(adressList)
        }

        if (peerData.services != undefined) {

            let serviceList = document.createElement("ul");
            for (let a of peerData.myServices) {
                let l = document.createElement("li");
                l.innerText = a.id.toString();
                serviceList.appendChild(l);
            }

            container.appendChild(serviceList);
        }

        return container
    }
}