import { Network } from "@/config"
import { ExplorerUrlParams } from "./types.explorer"

export const algorandExplorerUrl = (
    { network, value}: ExplorerUrlParams
) => {
    switch (network) {
    case Network.Testnet:
        return {
            address: `https://explorer.solana.com/address/${value}?cluster=devnet`,
            tx: `https://testnet.explorer.perawallet.app/tx/${value}`,
        }
    case Network.Mainnet:
        return {
            address: `https://explorer.solana.com/address/${value}`,
            tx: `https://explorer.perawallet.app/tx/${value}`,
        }
    }
}