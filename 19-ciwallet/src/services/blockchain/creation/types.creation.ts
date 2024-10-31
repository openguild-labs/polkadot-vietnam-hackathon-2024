import { Network } from "@/config"

export interface CreateAccountParams {
    mnemonic: string;
    accountNumber: number;
    chainKey: string;
    //near only
    nearUsername: string;
    //temporatory our solution is testenet, so that we'll use it as default
    network?: Network;
}

export interface ImportAccountParams {
    privateKey: string;
    chainKey: string;
    accountAddress?: string;
}