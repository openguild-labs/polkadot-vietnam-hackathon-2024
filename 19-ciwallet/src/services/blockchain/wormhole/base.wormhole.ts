import { Chain, Network, wormhole } from "@wormhole-foundation/sdk"
import algorand from "@wormhole-foundation/sdk/algorand"
import evm from "@wormhole-foundation/sdk/evm"
import solana from "@wormhole-foundation/sdk/solana"
import sui from "@wormhole-foundation/sdk/sui"
import cosmwasm from "@wormhole-foundation/sdk/cosmwasm"
import aptos from "@wormhole-foundation/sdk/aptos"

export const getWormhole = async <N extends Network>(network: N) =>
    wormhole(network, [sui, evm, algorand, solana, cosmwasm, aptos])

export const WORMHOLE_TESTNET_HOST_1 = "https://api.testnet.wormholescan.io"
export const WORMHOLE_MAINNET_HOST_1 = "https://api.mainnet.wormholescan.io"

export const wormholeHosts = <N extends Network>(network: N) => {
    switch (network) {
    case "Testnet":
        return [WORMHOLE_TESTNET_HOST_1]
    case "Mainnet":
        return [WORMHOLE_MAINNET_HOST_1]
    default:
        return []
    }
}

export interface SignerParams<N extends Network, C extends Chain> {
    network: N
    privateKey: string
    debug?: boolean
    address?: string
    chain: C
}