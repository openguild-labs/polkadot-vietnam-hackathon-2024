import { Network } from "@/config"

export interface ExplorerUrlParams {
    chainKey: string,
    value: string,
    type: "address"| "tx",
    network: Network,
}