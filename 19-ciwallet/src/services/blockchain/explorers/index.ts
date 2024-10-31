import { avalancheExplorerUrl } from "./avalanche.explorer"
import { aptosExplorerUrl } from "./aptos.explorer"
import { bscExplorerUrl } from "./bsc.explorer"
import { solanaExplorerUrl } from "./solana.explorer"
import { ExplorerUrlParams } from "./types.explorer"
import { suiExplorerUrl } from "./sui.explorer"
import { algorandExplorerUrl } from "./algorand.explorer"
import { SupportedChainKey } from "@/config"
import { nearExplorerUrl } from "./near.explorer"

export const explorerUrl = (params: ExplorerUrlParams) => {
    switch (params.chainKey) {
    case SupportedChainKey.Avalanche:
        return avalancheExplorerUrl(params)[params.type]
    case SupportedChainKey.Aptos:
        return aptosExplorerUrl(params)[params.type]
    case SupportedChainKey.Bsc:
        return bscExplorerUrl(params)[params.type]
    case SupportedChainKey.Solana:
        return solanaExplorerUrl(params)[params.type]
    case SupportedChainKey.Sui:
        return suiExplorerUrl(params)[params.type]
    case SupportedChainKey.Algorand:
        return algorandExplorerUrl(params)[params.type]
    case SupportedChainKey.Near:
        return nearExplorerUrl(params)[params.type]
    default:
        throw new Error(`Chain not supported: ${params.chainKey}`)
    }
}

export * from "./protocols.explorer"