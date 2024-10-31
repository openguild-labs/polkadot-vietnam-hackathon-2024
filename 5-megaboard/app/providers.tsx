"use client";

import * as React from "react";
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { trustWallet, ledgerWallet } from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, http } from "wagmi";

const { wallets } = getDefaultWallets();

// Define the Unique chain
const bifrostMainnet = {
  id: 3068, // Sửa thành 8880 hoặc "0x22b0"
  name: "Bifrost Mainnet",
  network: "bifrost-mainnet",
  nativeCurrency: {
    name: "Bifrost Mainnet",
    symbol: "BFC",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://public-01.mainnet.bifrostnetwork.com/rpc"],
      websocket: ["wss://public-01.mainnet.bifrostnetwork.com/rpc"],
    },
    public: {
      http: ["https://public-01.mainnet.bifrostnetwork.com/rpc"],
      websocket: ["wss://public-01.mainnet.bifrostnetwork.com/rpc"],
    },
  },
  blockExplorers: {
    default: { name: "BifrostScan", url: "https://explorer.mainnet.bifrostnetwork.com/tx/" },
  },
  testnet: false,
};

// Define the Unique chain
const bifrostTestnet = {
  id: 49088,
  name: "Bifrost Testnet",
  network: "bifrost-testnet",
  nativeCurrency: {
    name: "Bifrost Testnet",
    symbol: "BFC",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://public-01.testnet.bifrostnetwork.com/rpc"],
      websocket: ["wss://public-01.testnet.bifrostnetwork.com/rpc"],
    },
    public: {
      http: ["https://public-01.testnet.bifrostnetwork.com/rpc"],
      websocket: ["wss://public-01.testnet.bifrostnetwork.com/rpc"],
    },
  },
  blockExplorers: {
    default: { name: "BifrostScan", url: "https://explorer.testnet.bifrostnetwork.com/tx/" },
  },
  testnet: true,
};
const moonbaseAlphaTestnet = {
  id: 1287, // Sửa thành 8880 hoặc "0x22b0"
  name: "Moonbase Alpha",
  network: "Moonbase Alpha",
  nativeCurrency: {
    name: "Moonbase Alpha",
    symbol: "DEV",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.api.moonbase.moonbeam.network"],
      websocket: ["wss://rpc.api.moonbase.moonbeam.network"],
    },
    public: {
      http: ["https://rpc.api.moonbase.moonbeam.network"],
      websocket: ["wss://rpc.api.moonbase.moonbeam.network"],
    },
  },
  blockExplorers: {
    default: { name: "Moonbase Alpha", url: "https://moonbase.moonscan.io/" },
  },
  testnet: true,
};

const config = getDefaultConfig({
  appName: "DApp Bootcamp Frontends",
  projectId: "b735f0d8b8e242fb3e26f7c8dd1062b1",
  wallets: [
    ...wallets,
    {
      groupName: "Other",
      wallets: [trustWallet, ledgerWallet],
    },
  ],
  chains: [moonbaseAlphaTestnet],
  transports: {
    //   [3068]: http("https://public-01.mainnet.bifrostnetwork.com/rpc"),
    // [49088]: http("https://public-01.testnet.bifrostnetwork.com/rpc"),
    [1287]: http("https://rpc.api.moonbase.moonbeam.network"),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}