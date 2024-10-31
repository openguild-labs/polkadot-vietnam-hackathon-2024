import { Network } from "@/config"
import { ExplorerUrlParams } from "./types.explorer"

export const suiExplorerUrl = (
    { network, value}: ExplorerUrlParams
) => {
    switch (network) {
    case Network.Testnet:
        return {
            address: `https://testnet.suivision.xyz/account/${value}`,
            tx: `https://testnet.suivision.xyz/txblock/${value}`,
        }
    case Network.Mainnet:
        return {
            address: `https://suivision.xyz/account/${value}`,
            tx: `https://suivision.xyz/txblock/${value}`,
        }
    }
}