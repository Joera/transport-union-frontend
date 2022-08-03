import { IMainController } from "./main.controller";


interface UiElement {
    [key: string]: HTMLElement;
  }

export interface IUiController {

    main: IMainController;
    buttons: UiElement[];
    forms: UiElement[];
    sections: UiElement[];
    init(): void;
    uiClick(e: Event, method:string): void;
    uiSubmit(e: FormDataEvent, method:string): void;
    panes: UiElement[];
}

export class UiController implements IUiController {

    main: IMainController;
    buttons: any;
    forms: any;
    panes: any;
    sections: any;

    constructor(main: IMainController) {

        this.main =  main;
        this.buttons = {};
        this.forms = {};
        this.panes = {};
        this.sections = {};
    }

    init() {

        let self = this;

        [].slice.call(document.querySelectorAll("button[type='button']")).forEach((el: HTMLButtonElement) =>  {  
            this.buttons[el.id] = el;
    
            el.addEventListener("click", (e: Event) => {
                self.uiClick(e, el.id)
            })
        });
    
        [].slice.call(document.getElementsByTagName("form")).forEach((el: HTMLFormElement) =>  {  

            this.forms[el.id] = el;

            const onSubmit = (e: Event) => {

                e.preventDefault();
                new FormData(el);
            }

            el.addEventListener("submit", onSubmit );
            el.addEventListener("formdata", async (cc) => {
                self.uiSubmit(cc,el.id) // switch ding doen
            });
        });

        [].slice.call(document.getElementsByTagName("aside")).concat(document.getElementsByTagName("main")).forEach((el: HTMLElement) =>  { 

            this.panes[el.id] = el;
        });

        [].slice.call(document.getElementsByTagName("section")).forEach((el: HTMLElement) =>  { 

            this.sections[el.id] = el;
        });

       //   console.log(this);
    }

    async uiClick(e: Event, id: string)  {

        switch(id) {

            case  'select-local-peer':
                this.forms['local-keypair-form'].style.zIndex = 101;
            break;

            case  'select-relay-peer':
                this.forms['select-relay-form'].style.zIndex = 101;
            break;

            case  'select-map-view':
                this.hideSections();
                this.sections['map-view'].style.zIndex = 100;
            break;

            case 'select-matrix-view':
                this.hideSections();
                this.sections['matrix-view'].style.zIndex = 100;
            break;

            case  'select-chords-view':
                this.hideSections();
                this.sections['chords-view'].style.zIndex = 100;
                // this.main.chordDiagram.init();
            break;

            case  'select-network-view':
                this.hideSections();
                this.sections['network-view'].style.zIndex = 100;
            break;
        }
    }

    async uiSubmit(e: FormDataEvent, id: string)  {

        const formData = this.parseFormData(e.formData);

        switch(id) {

            case 'local-keypair-form':

                const keypair = await this.main.fluence.makeKeyPair(formData.sk);
                this.main.fluence.localPeer = keypair;
                this.updateIdentityPane();

                this.forms['local-keypair-form'].style.zIndex = '1';
                this.forms['select-relay-form'].style.zIndex = '101';

            break;

            case 'select-relay-form':

                this.main.fluence.setRelayPeerbyIndex(formData.relay_peer);
                this.forms['select-relay-form'].style.zIndex = '1';
                this.updateIdentityPane();
                await this.main.fluence.connectToRelay();
                this.updateIdentityPane();
                this.main.exploration.dataLoop();
          
            break;



        }


    }


    parseFormData(formData: FormData) {

        let object: any  = {};
        formData.forEach((value, key) => {
            // Reflect.has in favor of: object.hasOwnProperty(key)
            if(!Reflect.has(object, key)){
                object[key] = value;
                return;
            }
            if(!Array.isArray(object[key])){
                object[key] = [object[key]];    
            }
            object[key].push(value);
        });

        return object;
    }

    updateIdentityPane() {

        const p = this.panes["identity-pane"];

        if (this.main.fluence.localPeerId) {
            this.buttons["select-local-peer"].innerText = this.shortenPeerId(this.main.fluence.localPeerId);
        }

        if (this.main.fluence.relayPeerId) {
            this.buttons["select-relay-peer"].innerText = this.shortenPeerId(this.main.fluence.relayPeerId);
            this.buttons["select-relay-peer"].style.display = "block";
        }

        if (this.main.fluence.connection && this.main.fluence.status) {

            if (this.main.fluence.status.isConnected) {

                this.buttons["select-local-peer"].classList.add("connected");
                this.buttons["select-relay-peer"].classList.add("connected");   
            }
        }

         
    }

    shortenPeerId(id:string) : string {
        return ".." + id.substr(id.length - 12)
    }

    hideSections() {

        Object.values(this.sections).forEach ( (s: HTMLElement, i: number) => {
            s.style.zIndex = i.toString()
        })
    }



}