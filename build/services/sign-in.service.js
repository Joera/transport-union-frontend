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
const ethers_1 = require("ethers");
const siwe_1 = require("siwe");
const domain = window.location.host;
const origin = window.location.origin;
const provider = new ethers_1.ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
class SignInWithEthereum {
    constructor() {
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.connectWalletBtn = document.getElementById('connectWalletBtn');
            //  this.siweBtn = document.getElementById('siweBtn');
            this.connectWalletBtn.onclick = () => this.connectWallet();
            //  this.siweBtn.onclick = () => this.signInWithEthereum();
        });
    }
    createSiweMessage(address, statement) {
        const message = new siwe_1.SiweMessage({
            domain,
            address,
            statement,
            uri: origin,
            version: '1',
            chainId: 1
        });
        return message.prepareMessage();
    }
    connectWallet() {
        return __awaiter(this, void 0, void 0, function* () {
            yield provider.send('eth_requestAccounts', [])
                .catch(() => console.log('user rejected request'));
            let a = yield signer.getAddress();
            console.log(a);
        });
    }
    signInWithEthereum() {
        return __awaiter(this, void 0, void 0, function* () {
            const message = this.createSiweMessage(yield signer.getAddress(), 'Sign in with Ethereum to the app.');
            console.log(yield signer.signMessage(message));
        });
    }
}
exports.default = SignInWithEthereum;
//# sourceMappingURL=sign-in.service.js.map