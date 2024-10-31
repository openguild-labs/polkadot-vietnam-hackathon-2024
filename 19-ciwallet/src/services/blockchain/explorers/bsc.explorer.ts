import { Network } from "@/config"
import { ExplorerUrlParams } from "./types.explorer"

export const bscExplorerUrl = (
    { network, value}: ExplorerUrlParams
) => {
    switch (network) {
    case Network.Testnet:
        return {
            address: `https://testnet.bscscan.com/address/${value}`,
            tx: `https://testnet.bscscan.com/tx/${value}`,
        }
    case Network.Mainnet:
        return {
            address: `https://bscscan.com/address/${value}`,
            tx: `https://bscscan.com/tx/${value}`,
        }
    }
}