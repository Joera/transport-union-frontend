import { GraphNode } from "../../interfaces";

export default class LocalPeerContent {

    constructor() {

    }

    html(peerData: GraphNode) {

        let container = document.createElement("div");

        const html =`
      
            <h3>Local Peer</h3>
            <div id="sign-in-ethereum">
                <button id='connectWalletBtn'>Connect with account wallet</button>
                <div id="pairing"></div>
            </div>
        `

        container.innerHTML = html;

        return container
    }
}