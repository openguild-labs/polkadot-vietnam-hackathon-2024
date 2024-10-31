import { Network } from "@/config"
import { avalancheHttpRpcUrl, avalancheWsRpcUrl } from "./avalanche.evm"
import { bscHttpRpcUrl, bscWsRpcUrl } from "./bsc.evm"

export const evmHttpRpcUrl = (chainKey: string, network: Network) => {
    switch (chainKey) {
    case "avalanche": {
        return avalancheHttpRpcUrl(network)
    }
    case "bsc": {
        return bscHttpRpcUrl(network)
    }
    default: throw new Error(`Chain not supported: ${chainKey}`)
    }
}

export const evmWsRpcUrl = (chainKey: string, network: Network) => {
    switch (chainKey) {
    case "avalanche": {
        return avalancheWsRpcUrl(network)
    }
    case "bsc": {
        return bscWsRpcUrl(network)
    }
    default: throw new Error(`Chain not supported: ${chainKey}`)
    }
}