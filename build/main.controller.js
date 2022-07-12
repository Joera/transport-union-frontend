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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainController = void 0;
const sign_in_service_1 = __importDefault(require("./services/sign-in.service"));
const local_peer_service_1 = __importDefault(require("./services/local-peer.service"));
const network_service_1 = __importDefault(require("./services/network.service"));
const graph_service_1 = __importDefault(require("./services/graph.service"));
const export_1 = require("./_aqua/export");
class MainController {
    constructor() {
        this.signInWithEthereum = new sign_in_service_1.default();
        this.localPeer = new local_peer_service_1.default();
        this.network = new network_service_1.default();
        this.graph = new graph_service_1.default("network-graph-container");
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            let networkData = this.network.empty();
            //  this.signInWithEthereum
            let localPeer = yield this.localPeer.init();
            let status = yield this.localPeer.getStatus();
            document.getElementById('local_peer_info').innerText = JSON.stringify(status);
            networkData = this.network.pushNodes(networkData, [status.relayPeerId], status.peerId);
            console.log(networkData);
            this.graph.init(networkData);
            let first_ring = (yield (0, export_1.getNeighborhood)(localPeer, status.relayPeerId)).filter(p => p !== 'timeout');
            networkData = this.network.pushNodes(networkData, first_ring, status.relayPeerId);
            console.log(networkData);
            networkData = yield this.network.expand(localPeer, networkData);
            console.log(networkData);
        });
    }
}
exports.MainController = MainController;
let main = new MainController();
//# sourceMappingURL=main.controller.js.map