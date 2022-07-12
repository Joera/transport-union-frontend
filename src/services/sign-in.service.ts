// import { ethers } from 'ethers';
// import { SiweMessage } from 'siwe';

// const domain = window.location.host;
// const origin = window.location.origin;
// const provider = new ethers.providers.Web3Provider(window.ethereum);
// const signer = provider.getSigner();

// export default class SignInWithEthereum {

//     connectWalletBtn: HTMLElement;
//     siweBtn: HTMLElement;

//     constructor() {

//         this.init();
//     }

//     async init() {

      

//         this.connectWalletBtn = document.getElementById('connectWalletBtn');
//       //  this.siweBtn = document.getElementById('siweBtn');
//    //     this.connectWalletBtn.onclick = () => this.connectWallet();
//       //  this.siweBtn.onclick = () => this.signInWithEthereum();

//     }

//     createSiweMessage(address: string, statement: string) {
//         const message = new SiweMessage({
//             domain,
//             address,
//             statement,
//             uri: origin,
//             version: '1',
//             chainId: 1
//         });
//         return message.prepareMessage();
//     }

//     async connectWallet() {
//         await provider.send('eth_requestAccounts', [])
//             .catch(() => console.log('user rejected request'));

//         let a = await signer.getAddress();

//         console.log(a);
//     }

//     async signInWithEthereum() {
//         const message = this.createSiweMessage(
//             await signer.getAddress(),
//             'Sign in with Ethereum to the app.'
//         );
//         console.log(await signer.signMessage(message));
//     }
// }



