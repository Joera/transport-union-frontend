"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const export_1 = require("../_aqua/export");
class NetworkService {
    constructor() {
    }
    pushNodes(data, peers, source) {
        // function onlyUnique(peer: GraphNode, index: Number, self: GraphNode[]) {
        //     return self.indexOf(peer) === index;
        // }
        for (let peer of peers) {
            data.nodes.push({
                id: peer,
                name: peer
            });
            data.links.push({
                source: source,
                target: peer
            });
        }
        data.nodes = [...new Map(data.nodes.map(item => [item["id"], item])).values()];
        data.links = data.links.filter((v, i, a) => a.findIndex(v2 => (JSON.stringify(v2) === JSON.stringify(v))) === i);
        return data;
    }
    expand(localPeer, networkData) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let peer of networkData.nodes) {
                let mo_peers = yield (0, export_1.getNeighborhood)(localPeer, peer.id);
                networkData = this.pushNodes(networkData, mo_peers, peer.id);
            }
            return networkData;
        });
    }
    empty() {
        return {
            "nodes": [],
            "links": []
        };
    }
}
exports.default = NetworkService;
//# sourceMappingURL=network.service.js.map