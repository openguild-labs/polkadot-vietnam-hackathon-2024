
// import type { Chain } from "../src/types";

// # RPC_ENDPOINT="https://evm.shibuya.astar.network/"
// # RPC_ENDPOINT=https://shibuya-rpc.dwellir.com
// # RPC_ENDPOINT=https://evm.astar.network/
// # RPC_ENDPOINT="https://astar.public.blastapi.io/"
// # RPC_ENDPOINT=https://astar-mainnet.g.alchemy.com/v2/YXeTvtAle8Rm_JfIQ4cEOj1iO-o4Ydrg
// RPC_ENDPOINT=https://astar.api.onfinality.io/public

export const AstarShibuya = {
    "chain": "ASTR",
    "chainId": 81,
    "explorers": [
        {
            "name": "subscan",
            "url": "https://shibuya.subscan.io/",
            "standard": "none",
            "icon": {
                "url": "ipfs://Qma2GfW5nQHuA7nGqdEfwaXPL63G9oTwRTQKaGTfjNtM2W",
                "width": 400,
                "height": 400,
                "format": "png"
            }
        }
    ],
    "faucets": [],
    "features": [],
    "icon": {
        "url": "ipfs://Qmdvmx3p6gXBCLUMU1qivscaTNkT6h3URdhUTZCHLwKudg",
        "width": 1000,
        "height": 1000,
        "format": "png"
    },
    "infoURL": "https://evm.shibuya.astar.network/",
    "name": "Shibuya",
    "nativeCurrency": {
        "name": "Shibuya",
        "symbol": "SBY",
        "decimals": 18
    },
    "networkId": 81,
    "redFlags": [],
    "rpc": [
        "https://evm.shibuya.astar.network/",
        "https://shibuya-rpc.dwellir.com",
        "https://astar.public.blastapi.io/",
        "https://astar.api.onfinality.io/public",
    ],
    "shortName": "sby",
    "slug": "shibuya",
    "testnet": true
}
// as const satisfies Chain;