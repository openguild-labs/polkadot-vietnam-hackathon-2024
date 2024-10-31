import { ChainAccount } from "../common"
import { getSeed } from "../../cryptography"
import { Keypair } from "@solana/web3.js"
import { CreateAccountParams, ImportAccountParams } from "./types.creation"
import bs58 from "bs58"

export const createSolanaAccount = ({
    accountNumber,
    mnemonic,
}: Omit<CreateAccountParams, "chainKey">): ChainAccount => {
    const seed = getSeed({
        mnemonic,
        accountNumber,
    })
    const account = Keypair.fromSeed(seed.subarray(0, 32))
    return {
        address: account.publicKey.toString(),
        privateKey: bs58.encode(account.secretKey),
        publicKey: account.publicKey.toString(),
    }
}

export const importSolanaAccount = ({
    privateKey,
}: Omit<ImportAccountParams, "chainKey">): ChainAccount => {
    const account = Keypair.fromSecretKey(bs58.decode(privateKey))
    return {
        address: account.publicKey.toString(),
        privateKey: Buffer.from(account.secretKey).toString("hex"),
        publicKey: account.publicKey.toString(),
    }
}
