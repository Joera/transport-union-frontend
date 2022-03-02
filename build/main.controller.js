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
exports.MainController = void 0;
class MainController {
    constructor() {
        console.log("yo");
        this.setListeners();
    }
    setListeners() {
        console.log("yo2");
        let abi_button = document.getElementById("abi_parse_button");
        abi_button.addEventListener('click', (event) => {
            this.parseAbi();
        });
    }
    parseAbi() {
        console.log("yo3");
        let abiText = document.getElementById("abi").value;
        console.log(abiText);
    }
    onSubmit() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.MainController = MainController;
let main = new MainController();
//# sourceMappingURL=main.controller.js.map