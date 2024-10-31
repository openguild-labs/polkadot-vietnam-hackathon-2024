import { Network, PolkadotChainKey } from "./blockchain.config"

export interface PolkadotChain {
    name: string;
    imageUrl: string;
}

export type PolkadotChainsConfig = Record<string, Record<Network, PolkadotChain>>


export const polkadotChainsConfig: () => PolkadotChainsConfig = () => ({
    [PolkadotChainKey.Relay]: {
        [Network.Mainnet]: {
            name: "Polkadot",
            imageUrl: "/icons/polkadot.svg",
        },
        [Network.Testnet]: {
            name: "Paseo Testnet",
            imageUrl: "/icons/paseo.webp",
        }
    },
    [PolkadotChainKey.Bifrost]: {
        [Network.Mainnet]: {
            name: "Bifrost",
            imageUrl: "/icons/bifrost.png",
        },
        [Network.Testnet]: {
            name: "Bifrost Testnet",
            imageUrl: "/icons/bifrost.png",
        },
    },
    [PolkadotChainKey.UniqueNetwork]: {
        [Network.Mainnet]: {
            name: "Unique Network",
            imageUrl: "/icons/unique-network.svg",
        },
        [Network.Testnet]: {
            name: "Opal Testnet",
            imageUrl: "/icons/opal-testnet.svg",
        }
    },
    [PolkadotChainKey.Moonbeam]: {
        [Network.Mainnet]: {
            name: "Moonbeam",
            imageUrl: "/icons/moonbeam.webp",
        },
        [Network.Testnet]: {
            name: "Moonbeam Alpha",
            imageUrl: "/icons/moonbeam.webp",
        }
    }
})