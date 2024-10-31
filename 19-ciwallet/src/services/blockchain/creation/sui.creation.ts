import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519"
import { ChainAccount } from "../common"
import { CreateAccountParams, ImportAccountParams } from "./types.creation"

export const createSuiAccount = ({
    accountNumber,
    mnemonic,
}: Omit<CreateAccountParams, "chainKey">): ChainAccount => {
    const account = Ed25519Keypair.deriveKeypair(mnemonic, `m/44'/784'/${accountNumber}'/0'/0'`)
    return {
        address: account.getPublicKey().toSuiAddress(),
        privateKey: account.getSecretKey(),
        publicKey: account.getPublicKey().toSuiPublicKey(),
    }
}

export const importSuiAccount = ({
    privateKey,
}: Omit<ImportAccountParams, "chainKey">): ChainAccount => {
    const account = Ed25519Keypair.fromSecretKey(privateKey)
    return {
        address: account.getPublicKey().toSuiAddress(),
        privateKey: account.getSecretKey(),
        publicKey: account.getPublicKey().toSuiPublicKey(),
    }
}