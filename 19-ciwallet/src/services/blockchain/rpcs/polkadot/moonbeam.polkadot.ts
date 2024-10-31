import { JsonRpcProvider } from "ethers"
import { Network } from "@/config"

const MAINNET_MOONBEAM_RPC_URL = ""
const TESTNET_MOONBEAM_RPC_URL = "https://rpc.api.moonbase.moonbeam.network"

const rpcUrlMap: Record<Network, string> = {
    [Network.Mainnet]: MAINNET_MOONBEAM_RPC_URL,
    [Network.Testnet]: TESTNET_MOONBEAM_RPC_URL,
}

export const polkadotMoonbeamProvider = (network: Network): JsonRpcProvider => {
    return new JsonRpcProvider(rpcUrlMap[network])
}