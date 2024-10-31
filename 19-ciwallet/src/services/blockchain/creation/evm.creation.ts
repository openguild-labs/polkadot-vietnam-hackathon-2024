import { ethers } from "ethers"
import { ChainAccount } from "../common"
import { CreateAccountParams, ImportAccountParams } from "./types.creation"

export const createEvmAccount = ({
    accountNumber,
    mnemonic,
}: Omit<CreateAccountParams, "chainKey">): ChainAccount => {
    const account = ethers.HDNodeWallet.fromPhrase(
        mnemonic, "", `m/44'/60'/0'/0/${accountNumber}`  
    )
    return {
        address: account.address,
        privateKey: account.privateKey,
        publicKey: account.publicKey,
    }
}

export const importEvmAccount = ({
    privateKey,
}: Omit<ImportAccountParams, "chainKey">): ChainAccount => {
    const account = new ethers.Wallet(privateKey)
    return {
        address: account.address,
        privateKey: account.privateKey,
        publicKey: account.address,
    }
}
