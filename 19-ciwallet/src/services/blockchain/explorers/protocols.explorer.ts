import { Network, SupportedBridgeProtocolKey } from "@/config"

export interface ProtocolExplorerUrlParams {
  network: Network;
  value: string;
  bridgeProtocolKey: string;
  type: "tx"
}


export const wormholeExplorerUrl = ({
    network,
    value,
}: ProtocolExplorerUrlParams) => {
    switch (network) {
    case Network.Testnet:
        return {
            tx: `https://wormholescan.io/#/tx/${value}?network=Testnet`,
        }
    case Network.Mainnet:
        return {
            tx: `https://wormholescan.io/#/tx/${value}?network=Mainnet`,
        }
    }
}

export const protocolExplorerUrl = (params: ProtocolExplorerUrlParams) => {
    switch (params.bridgeProtocolKey) {
    case SupportedBridgeProtocolKey.Wormhole:
        return wormholeExplorerUrl(params)[params.type]
    default:
        throw new Error(`Protocol not supported: ${params.bridgeProtocolKey}`)
    }
}
