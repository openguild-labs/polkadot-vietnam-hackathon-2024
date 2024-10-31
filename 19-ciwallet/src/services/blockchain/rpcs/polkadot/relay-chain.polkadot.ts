import { Network } from "@/config"
import { ApiPromise, WsProvider } from "@polkadot/api"

const rpcUrlMap: Record<Network, string> = {
    [Network.Mainnet]: "",
    [Network.Testnet]: "wss://paseo.dotters.network",
}

export const polkadotRelayChainClient = async (
    network: Network = Network.Testnet
) => {
    const rpcUrl = rpcUrlMap[network]
    const wsProvider = new WsProvider(rpcUrl)
    return await ApiPromise.create({ provider: wsProvider })
}
