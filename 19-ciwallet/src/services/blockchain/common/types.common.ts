import { Network, SupportedChainKey } from "@/config"
import { Chain, Network as WormholeNetwork } from "@wormhole-foundation/sdk"

export enum Platform {
  Evm = "evm",
  Aptos = "aptops",
  Solana = "solana",
  Algorand = "algorand",
  Sui = "sui",
  Polkadot = "polkadot",
  Near = "near"
}

export const chainKeyToPlatform = (chainKey: string): Platform => {
    switch (chainKey) {
    case SupportedChainKey.Avalanche:
        return Platform.Evm
    case SupportedChainKey.Bsc:
        return Platform.Evm
    case SupportedChainKey.Solana:
        return Platform.Solana
    case SupportedChainKey.Aptos:
        return Platform.Aptos
    case SupportedChainKey.Algorand:
        return Platform.Algorand
    case SupportedChainKey.Sui:
        return Platform.Sui
    case SupportedChainKey.Polkadot:
        return Platform.Polkadot
    case SupportedChainKey.Near:
        return Platform.Near
    default:
        throw new Error(`Chain not supported: ${chainKey}`)
    }
}

export const parseNetwork = (network: Network): WormholeNetwork => {
    switch (network) {
    case Network.Mainnet:
        return "Mainnet"
    case Network.Testnet:
        return "Testnet"
    default:
        throw new Error(`Network not supported: ${network}`)
    }
}

export const parseWormholeNetwork = (network: WormholeNetwork): Network => {
    switch (network) {
    case "Mainnet":
        return Network.Mainnet
    case "Testnet":
        return Network.Testnet
    default:
        throw new Error(`Network not supported: ${network}`)
    }
}

export interface ChainAccount {
  address: string;
  privateKey: string;
  publicKey: string;
}

export const chainKeyToChain = (chainKey: string) : Chain => {
    switch (chainKey) {
    case SupportedChainKey.Aptos: return "Aptos"
    case SupportedChainKey.Solana: return "Solana"
    case SupportedChainKey.Avalanche: return "Avalanche"
    case SupportedChainKey.Bsc: return "Bsc"
    case SupportedChainKey.Algorand: return "Algorand"
    case SupportedChainKey.Sui: return "Sui"
    case SupportedChainKey.Near: return "Near"
    default: throw new Error(`Chain not found : ${chainKey}`)
    }
}

export const chainToChainKey = (chainKey: Chain) : string => {
    switch (chainKey) {
    case "Aptos": return SupportedChainKey.Aptos
    case "Solana": return SupportedChainKey.Solana
    case "Avalanche": return SupportedChainKey.Avalanche
    case "Algorand": return SupportedChainKey.Algorand
    case "Bsc": return SupportedChainKey.Bsc
    case "Sui": return SupportedChainKey.Sui
    case "Near": return SupportedChainKey.Near
    default: throw new Error(`Chain not found : ${chainKey}`)
    }
}