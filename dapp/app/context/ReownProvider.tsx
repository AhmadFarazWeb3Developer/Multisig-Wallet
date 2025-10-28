"use client";

import { createAppKit, AppKitProvider } from "@reown/appkit/react";
import { Ethers5Adapter } from "@reown/appkit-adapter-ethers5";
import {
  arbitrum,
  arbitrumSepolia,
  avalancheFuji,
  defineChain,
  mainnet,
  optimism,
  optimismSepolia,
  zksync,
} from "@reown/appkit/networks";

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

if (!projectId) throw new Error("NEXT_PUBLIC_REOWN_PROJECT_ID is not set");

const hardhat = defineChain({
  id: 31337,
  caipNetworkId: "eip155:31337",
  chainNamespace: "eip155",
  name: "Hardhat Local",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:8545"],
    },
  },
  blockExplorers: {
    default: {
      name: "Local Explorer",
      url: "http://127.0.0.1:8545",
    },
  },
});

createAppKit({
  adapters: [new Ethers5Adapter()],
  networks: [
    hardhat,
    mainnet,
    zksync,
    optimism,
    optimismSepolia,
    arbitrum,
    arbitrumSepolia,
    avalancheFuji,
  ],
  projectId,
  features: { analytics: true },
});

const FixedAppKitProvider = AppKitProvider as React.FC<{
  children: React.ReactNode;
}>;

export function ReownProvider({ children }: { children: React.ReactNode }) {
  return <FixedAppKitProvider>{children}</FixedAppKitProvider>;
}
