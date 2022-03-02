

export class MainController {

    constructor() {

        console.log("yo");
        this.setListeners();
    }


    setListeners()  {

        console.log("yo2");
        let abi_button = document.getElementById("abi_parse_button");

        abi_button.addEventListener('click', (event) => {
            this.parseAbi();
        });

    }


    parseAbi() {

        console.log("yo3");

        let abiText = (<HTMLTextAreaElement>document.getElementById("abi")).value;

        console.log(abiText);

    }


    async onSubmit() : Promise<any> {


    }

}

let main = new MainController();