import { matchPeerName } from "../datavis/helpers/peers";
import { IMainController } from "./main.controller";

export interface ITableController {

    el: HTMLTableElement;
    update: () => void;
    signalExplorer: (peerID: string) => void;
}

export class TableController implements ITableController {

    el: HTMLTableElement;
    
    constructor(
        private main : IMainController
    ) { 
        this.el = document.getElementById("network-table") as HTMLTableElement;
    }

    update() {

        this.el.style.display = "block";

        let tableBody = this.el.querySelector("tbody")
        let emptyRow =  tableBody.querySelector("tr:last-child");

        for (let peer of this.main.peers.peers) {

            let hasRow = tableBody.querySelector("tr#id_" + peer.peerId);

            if(hasRow) {

                if(peer.location) {
                    (hasRow.querySelector('td:nth-of-type(5)') as HTMLTableCellElement).innerText = peer.location.city;
                }

            } else {

                let emptyRow = this.el.querySelector("tbody tr:last-child");
                let newRow = emptyRow.cloneNode(true) as HTMLTableRowElement;
                newRow.id = 'id_' + peer.peerId;

                let name = matchPeerName(peer.peerId);
                if(name != undefined) {
                    (newRow.querySelector('td:nth-of-type(2)') as HTMLTableCellElement).innerText = name;
                }
                let s : string = "..." + peer.peerId.substring(24);
                (newRow.querySelector('td:nth-of-type(3)') as HTMLTableCellElement).innerText = s;

                if(peer.addresses.length > 0) {
                    (newRow.querySelector('td:nth-of-type(4)') as HTMLTableCellElement).innerText = peer.public ? this.deconstructMultiaddress(peer.addresses[0]).location : "private";
                }

                if(peer.location) {
                    (newRow.querySelector('td:nth-of-type(5)') as HTMLTableCellElement).innerText = peer.location.city;
                }

                if(peer.location) {
                    (newRow.querySelector('td:nth-of-type(6)') as HTMLTableCellElement).innerText = peer.tested_connections.length.toString();
                }

                tableBody.insertBefore(newRow,emptyRow);
            }
        }
   


    }

    signalExplorer(peerId: string) {
    
        let rows = this.el.querySelectorAll("tbody tr");

        for (let row of rows) {

            if(this.main.exploration.explored.indexOf(row.id.substring(3)) > -1 ) {

                (row.querySelector("td span") as HTMLElement).style.borderColor = "#dedede";
                (row.querySelector("td span") as HTMLElement).style.backgroundColor = "#dedede"

            } else if(row.id === 'id_' + peerId ) {

                (row.querySelector("td span") as HTMLElement).style.borderColor = "black";
                (row.querySelector("td span") as HTMLElement).style.backgroundColor = "white";

            } else {

                (row.querySelector("td span") as HTMLElement).style.borderColor = "#dedede";
                (row.querySelector("td span") as HTMLElement).style.backgroundColor = "white";
            }

        }

    }

    deconstructMultiaddress(address: string) {

        const parts = address.split("/");

        return {
            locationProtocol : parts[1],
            location : parts[2],
            transportProtocol : parts[3],
            port: parts[4],
            peerPRotocol: parts[5],
            peerId : parts[6]

        }
    }


}