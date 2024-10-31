"use client";

import React from "react";
import { ThemeProvider } from "@material-tailwind/react";
import {
  ThirdwebProvider,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
} from "@thirdweb-dev/react";
import {
  Astar,
  AstarZkevm,
  AstarZkyoto,
  Moonbeam,
  Moonriver,
  MoonbaseAlpha,
} from "@thirdweb-dev/chains";

import {
  AstarShibuya,
  LocalChain,
} from "./customSupportedChains"



export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider
      supportedWallets={[
        metamaskWallet({
          recommended: true,
        }),
        coinbaseWallet(),
        walletConnect(),
      ]}
      supportedChains={[Astar, AstarZkevm, AstarZkyoto, AstarShibuya, Moonbeam, Moonriver, MoonbaseAlpha, LocalChain]}
      activeChain={LocalChain}
      clientId={process.env.THIRDWEB_CLIENT_ID!}
    >
      <ThemeProvider>{children}</ThemeProvider>;
    </ThirdwebProvider>
  );
}

export default Layout;
