import { Network } from "@/config"
import { ExplorerUrlParams } from "./types.explorer"

export const nearExplorerUrl = (
    { network, value}: ExplorerUrlParams
) => {
    switch (network) {
    case Network.Testnet:
        return {
            address: `https://testnet.nearblocks.io/address/${value}`,
            tx: `https://testnet.nearblocks.io/txns/${value}`,
        }
    case Network.Mainnet:
        return {
            address: `https://nearblocks.io/address/${value}`,
            tx: `https://nearblocks.io/txns/${value}`,
        }
    }
}