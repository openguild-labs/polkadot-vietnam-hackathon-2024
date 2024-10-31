import { Network } from "@/config"

export const BSC_MAINNET_HTTP_RPC_URL = "https://bsc-dataseed.binance.org/"
export const BSC_TESTNET_HTTP_RPC_URL = "https://data-seed-prebsc-2-s1.binance.org:8545/"

export const bscHttpRpcUrl = (network: Network) => {
    let rpcUrl = ""
    switch (network) {
    case Network.Mainnet: {
        rpcUrl = BSC_MAINNET_HTTP_RPC_URL
        break
    }
    case Network.Testnet: {
        rpcUrl = BSC_TESTNET_HTTP_RPC_URL
        break
    }
    }
    return rpcUrl
}

export const BSC_MAINNET_WS_RPC_URL = "wss://bsc-ws-node.nariox.org:443"
export const BSC_TESTNET_WS_RPC_URL = "wss://data-seed-prebsc-1-s1.binance.org:443"


export const bscWsRpcUrl = (network: Network) => {
    let rpcUrl = ""
    switch (network) {
    case Network.Mainnet: {
        rpcUrl = BSC_MAINNET_WS_RPC_URL
        break
    }
    case Network.Testnet: {
        rpcUrl = BSC_TESTNET_WS_RPC_URL
        break
    }
    }
    return rpcUrl
}