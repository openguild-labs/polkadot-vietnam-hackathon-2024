import { chainConfig } from "@/config";
import { ethers } from "ethers";

export async function getSigner() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return signer;
}


export async function getProvider() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    return provider;
}

export async function getChainId() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await provider.getNetwork();
    return network.chainId;
}

export async function getPoolFactoryAddress(){
    const chainId = await getChainId();
    const address: string =
      chainConfig[chainId.toString() as keyof typeof chainConfig]
        ?.contracts?.ProjectPoolFactory?.address;
        
    return address;
}

// export async function getAccount() {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner();
//     const account = await signer.getAddress();
//     return account;
// }

// export async function getBalance() {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner();
//     const balance = await signer.getBalance();
//     return balance;
// }

// export async function getNetwork() {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const network = await provider.getNetwork();
//     return network;
// }

// export async function getBlockNumber() {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const blockNumber = await provider.getBlockNumber();
//     return blockNumber;
// }

// export async function getBlock(blockNumber) {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const block = await provider.getBlock(blockNumber);
//     return block;
// }

// export async function getTransaction(transactionHash) {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const transaction = await provider.getTransaction(transactionHash);
//     return transaction;
// }

// export async function getTransactionReceipt(transactionHash) {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const transactionReceipt = await provider.getTransactionReceipt(transactionHash);
//     return transactionReceipt;
// }


