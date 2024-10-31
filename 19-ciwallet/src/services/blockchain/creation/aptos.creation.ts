import { Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk"
import { ChainAccount } from "../common"
import { CreateAccountParams, ImportAccountParams } from "./types.creation"

export const createAptosAccount = ({
    accountNumber,
    mnemonic,
}: Omit<CreateAccountParams, "chainKey">): ChainAccount => {
    const account = Account.fromDerivationPath({
        mnemonic,
        path: `m/44'/637'/${accountNumber}'/0'/0'`,
    })
    return {
        address: account.accountAddress.toString(),
        privateKey: account.privateKey.toString(),
        publicKey: account.publicKey.toString(),
    }
}

export const importAptosAccount = ({
    privateKey,
    accountAddress
}: Omit<ImportAccountParams, "chainKey">): ChainAccount => {
    const account = Account.fromPrivateKey({
        privateKey: new Ed25519PrivateKey(privateKey),
        address: accountAddress,
    })
    return {
        address: account.accountAddress.toString(),
        privateKey: account.privateKey.toString(),
        publicKey: account.publicKey.toString(),
    }
}