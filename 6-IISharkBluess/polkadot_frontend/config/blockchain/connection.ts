import { http, createConfig } from 'wagmi'
import { moonbaseAlpha, sepolia } from 'wagmi/chains'
import { metaMask } from 'wagmi/connectors'

export const configWagmi = createConfig({
  chains: [sepolia, moonbaseAlpha],
  connectors: [metaMask()],
  transports: {
    [sepolia.id]: http(),
    [moonbaseAlpha.id]: http(),
  },
})
