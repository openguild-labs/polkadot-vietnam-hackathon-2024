import { Network } from "@/config"
import { ExplorerUrlParams } from "./types.explorer"

export const aptosExplorerUrl = ({ network, value}: ExplorerUrlParams) => {
    switch (network) {
    case Network.Testnet:
        return {
            address: `https://explorer.aptoslabs.com/account/${value}?network=testnet`,
            tx: `https://explorer.aptoslabs.com/txn/${value}?network=testnet`,
        }
    case Network.Mainnet:
        return {
            address: `https://explorer.aptoslabs.com/account/${value}?network=mainnet`,
            tx: `https://explorer.aptoslabs.com/txn/${value}?network=mainnet`,
        }
    }
}