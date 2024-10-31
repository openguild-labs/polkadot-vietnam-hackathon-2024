import {
    Chain,
    chainToPlatform,
    Network,
    TokenAddress,
    UniversalAddress,
} from "@wormhole-foundation/sdk"
import { AptosAddress } from "@wormhole-foundation/sdk-aptos"
import { EvmAddress } from "@wormhole-foundation/sdk-evm"
import { SolanaAddress } from "@wormhole-foundation/sdk-solana"
import { AlgorandAddress } from "@wormhole-foundation/sdk-algorand"
import { getWormhole } from "./base.wormhole"

export const toWormholeNative = <C extends Chain>(
    chain: C,
    tokenAddress: TokenAddress<C>
) => {
    const platform = chainToPlatform(chain)
    let address = ""
    switch (platform) {
    case "Evm": {
        address = new EvmAddress(tokenAddress.toString()).toNative().address
        break
    }
    case "Solana": {
        address = new SolanaAddress(tokenAddress.toString())
            .toNative()
            .address.toBase58()
        break
    }
    case "Aptos": {
        console.log("tokenAddress", tokenAddress)
        address = new AptosAddress(tokenAddress.toString()).toNative().toString()
        break
    }
    case "Algorand": {
        address = new AlgorandAddress(tokenAddress.toString())
            .toNative()
            .toInt()
            .toString()
        break
    }
    default: {
        throw new Error("Unsupported platform")
    }
    }
    return address
}

export const toWormholeNativeFromUniversal = <C extends Chain>(
    chain: C,
    tokenAddress: UniversalAddress
) => {
    const platform = chainToPlatform(chain)
    let address = ""
    switch (platform) {
    case "Evm": {
        address = new EvmAddress(
            tokenAddress.toNative(chain).toString()
        ).toNative().address
        break
    }
    case "Solana": {
        address = new SolanaAddress(tokenAddress.toNative(chain).toString())
            .toNative()
            .address.toBase58()
        break
    }
    case "Aptos": {
        address = new AptosAddress(tokenAddress).toString()
        console.log("address", address)
        break
    }   
    case "Algorand": {
        address = new AlgorandAddress(tokenAddress.toNative(chain).toString())
            .toNative()
            .toInt()
            .toString()
        break
    }
    default: {
        throw new Error("Unsupported platform")
    }
    }
    return address
}

export const toWormholeNativeTokenAddress = async <C extends Chain>(
    chain: C,
    tokenAddress: UniversalAddress,
    network: Network
) => {
    const platform = chainToPlatform(chain)
    let address = ""
    switch (platform) {
    case "Evm": {
        address = new EvmAddress(
            tokenAddress.toNative(chain).toString()
        ).toNative().address
        break
    }
    case "Solana": {
        address = new SolanaAddress(tokenAddress.toNative(chain).toString())
            .toNative()
            .address.toBase58()
        break
    }
    case "Aptos": {
        const wormhole = await getWormhole(network)
        address = (await wormhole.getOriginalAsset({
            address: tokenAddress,
            chain,
        })).address.toString()
        console.log("address", address)
        break
    }
    case "Algorand": {
        address = new AlgorandAddress(tokenAddress.toNative(chain).toString())
            .toNative()
            .toInt()
            .toString()
        break
    }
    default: {
        throw new Error("Unsupported platform")
    }
    }
    return address
}


export const toWormholeUniversal = <C extends Chain>(
    chain: C,
    tokenAddress: string
) => {
    const platform = chainToPlatform(chain)
    let address: UniversalAddress
    switch (platform) {
    case "Evm": {
        address = new EvmAddress(tokenAddress).toUniversalAddress()
        break
    }
    case "Solana": {
        address = new SolanaAddress(tokenAddress).toUniversalAddress()
        break
    }
    case "Aptos": {
        address = new AptosAddress(tokenAddress).toUniversalAddress()
        break
    }
    case "Algorand": {
        address = new AlgorandAddress(tokenAddress).toUniversalAddress()
        break
    }
    default: {
        throw new Error("Unsupported platform")
    }
    }
    return address
}