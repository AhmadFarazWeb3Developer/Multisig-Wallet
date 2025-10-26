"use client";

import { createAppKit, AppKitProvider } from "@reown/appkit/react";
import { Ethers5Adapter } from "@reown/appkit-adapter-ethers5";
import { hardhat } from "@reown/appkit/networks";

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

if (!projectId) throw new Error("NEXT_PUBLIC_REOWN_PROJECT_ID is not set");

createAppKit({
  adapters: [new Ethers5Adapter()],
  networks: [hardhat],
  projectId,
  features: { analytics: true },
});

const FixedAppKitProvider = AppKitProvider as React.FC<{
  children: React.ReactNode;
}>;

export function ReownProvider({ children }: { children: React.ReactNode }) {
  return <FixedAppKitProvider>{children}</FixedAppKitProvider>;
}
