import { Wallet } from "ethers"
import { Platform, chainKeyToPlatform } from "../common"
import nacl from "tweetnacl"
import { Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk"
import algosdk, { mnemonicToSecretKey } from "algosdk"
import bs58 from "bs58"
import { sr25519Sign } from "@polkadot/util-crypto"
import { hexToU8a } from "@polkadot/util"
import { nearKeyPair } from "../rpcs"

export interface SignMessageParams {
  message: string;
  privateKey: string;
  chainKey: string;
  publicKey: string;
}

export const evmSignMessage = ({ message, privateKey }: SignMessageParams) => {
    const wallet = new Wallet(privateKey)
    return wallet.signMessage(message)
}

export const solanaSignMessage = ({
    message,
    privateKey,
}: SignMessageParams) => {
    return Buffer.from(
        nacl.sign.detached(Buffer.from(message, "base64"), bs58.decode(privateKey))
    ).toString("base64")
}

export const aptosSignMessage = ({
    message,
    privateKey,
}: SignMessageParams) => {
    const ed25519PrivateKey = Account.fromPrivateKey({
        privateKey: new Ed25519PrivateKey(privateKey),
    })
    return ed25519PrivateKey.sign(message).toString()
}

export const algorandSignMessage = ({
    message,
    privateKey,
}: SignMessageParams) => {
    return Buffer.from(
        algosdk.signBytes(
            Buffer.from(message, "base64"),
            mnemonicToSecretKey(privateKey).sk
        )
    ).toString("base64")
}

export const polkadotSignMessage = ({
    message,
    privateKey,
    publicKey,
}: SignMessageParams) => {
    return Buffer.from(
        sr25519Sign(Buffer.from(message, "base64"), {
            secretKey: hexToU8a(privateKey),
            publicKey: hexToU8a(publicKey),
        })
    ).toString("base64")
}

export const nearSignMessage = ({ message, privateKey }: SignMessageParams) => {
    const keyPair = nearKeyPair(privateKey)
    return Buffer.from(
        keyPair.sign(Buffer.from(message, "base64")).signature
    ).toString("base64")
}

export const signMessage = (params: SignMessageParams) => {
    const platform = chainKeyToPlatform(params.chainKey)

    switch (platform) {
    case Platform.Evm: {
        return evmSignMessage(params)
    }
    case Platform.Solana: {
        return solanaSignMessage(params)
    }
    case Platform.Aptos: {
        return aptosSignMessage(params)
    }
    case Platform.Algorand: {
        return algorandSignMessage(params)
    }
    case Platform.Polkadot: {
        return polkadotSignMessage(params)
    }
    case Platform.Near: {
        return nearSignMessage(params)
    }
    default:
        throw new Error(`Platform not supported: ${platform}`)
    }
}
