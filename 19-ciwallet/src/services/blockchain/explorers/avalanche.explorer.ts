import { Network } from "@/config"
import { ExplorerUrlParams } from "./types.explorer"

export const avalancheExplorerUrl = (
    { network, value}: ExplorerUrlParams
) => {
    switch (network) {
    case Network.Testnet:
        return {
            address: `https://testnet.snowtrace.io/address/${value}`,
            tx: `https://testnet.snowtrace.io/tx/${value}`,
        }
    case Network.Mainnet:
        return {
            address: `https://snowtrace.io/address/${value}`,
            tx: `https://snowtrace.io/tx/${value}`,
        }
    }
}