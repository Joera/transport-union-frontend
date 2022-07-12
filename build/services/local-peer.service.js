"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
// import fetch from "fetch";
const fluence_1 = require("@fluencelabs/fluence");
const fluence_network_environment_1 = require("@fluencelabs/fluence-network-environment");
const bs58 = __importStar(require("bs58"));
console.log("when do i run?");
const rustSK = '51h9mC4fkAoZmeQznhtL6NwT6C5xTemmPwX7eeQUyWa7ohW8GezWsqDFitn';
class LocalPeer {
    constructor() {
    }
    makeKeyPair(rustSK) {
        return __awaiter(this, void 0, void 0, function* () {
            const sk = bs58.decode(rustSK);
            const uint8array = new TextEncoder().encode(rustSK).slice(0, 32);
            return yield fluence_1.KeyPair.fromEd25519SK(uint8array);
        });
    }
    selectRelay() {
        return fluence_network_environment_1.krasnodar[1];
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            let relay = this.selectRelay();
            this.local_peer = new fluence_1.FluencePeer();
            yield this.local_peer.start({
                KeyPair: yield this.makeKeyPair(rustSK),
                connectTo: relay
            });
            return this.local_peer;
        });
    }
    getStatus() {
        let status = this.local_peer.getStatus();
        //  console.log(status);
        return status;
    }
}
exports.default = LocalPeer;
//# sourceMappingURL=local-peer.service.js.map