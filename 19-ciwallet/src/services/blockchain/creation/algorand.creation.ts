import { mnemonicToSecretKey, mnemonicFromSeed, secretKeyToMnemonic } from "algosdk"
import { ChainAccount } from "../common"
import { getSeed } from "../../cryptography"
import { CreateAccountParams, ImportAccountParams } from "./types.creation"

export const createAlgorandAccount = ({
    mnemonic,
    accountNumber
}: Omit<CreateAccountParams, "chainKey">): ChainAccount => {
    const seed = getSeed({
        mnemonic,
        accountNumber,
    })
    const algorandMnemonic = mnemonicFromSeed(seed.subarray(0, 32))
    const account = mnemonicToSecretKey(algorandMnemonic)
    return {
        address: account.addr.toString(),
        //private key is mnemonic
        privateKey: secretKeyToMnemonic(account.sk),
        publicKey: account.addr.toString(),
    }
}

export const importAlgorandAccount = ({
    privateKey,
}: Omit<ImportAccountParams, "chainKey">): ChainAccount => {
    const account = mnemonicToSecretKey(privateKey)
    return {
        address: account.addr.toString(),
        privateKey: Buffer.from(account.sk).toString("base64"),
        publicKey: account.addr.toString(),
    }
}
