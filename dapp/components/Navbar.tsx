"use client";
import Link from "next/link";
import {
  useAppKit,
  useAppKitAccount,
  useAppKitNetwork,
  useAppKitProvider,
} from "@reown/appkit/react";

import { Wallet, ChevronDown, Vault } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ethers } from "ethers";

export default function Navbar() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { caipNetwork, chainId } = useAppKitNetwork();
  const { walletProvider } = useAppKitProvider("eip155");

  const [balance, setBalance] = useState<string>("0.00");

  useEffect(() => {
    const fetchBalance = async () => {
      if (isConnected && address && walletProvider) {
        try {
          const provider = new ethers.providers.Web3Provider(walletProvider);
          const balanceWei = await provider.getBalance(address);
          const balanceEth = ethers.utils.formatEther(balanceWei);
          setBalance(parseFloat(balanceEth).toFixed(4));
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    };

    fetchBalance();
  }, [isConnected, address, chainId]);

  const networkImageUrl =
    caipNetwork?.imageUrl ||
    (caipNetwork?.imageId
      ? `https://api.web3modal.com/public/getAssetImage/${caipNetwork.imageId}`
      : null);

  return (
    <nav className="flex items-center justify-between py-4 shadow-sm ">
      <Link href="/" className="flex items-center space-x-3">
        <Vault size={34} color="white" />
      </Link>

      <div className="flex items-center gap-3">
        {isConnected && caipNetwork && (
          <button
            onClick={() => open({ view: "Networks" })}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all shadow-sm hover:shadow-md cursor-pointer"
            title={`Connected to ${caipNetwork.name}`}
          >
            {networkImageUrl ? (
              <Image
                src={networkImageUrl}
                alt={caipNetwork.name || "Network"}
                width={22}
                height={22}
                className="rounded-full"
                unoptimized
              />
            ) : (
              <div className="w-5 h-5 rounded-full  from-blue-400 to-purple-500 cursor-pointer" />
            )}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
              {caipNetwork.name}
            </span>
            <ChevronDown
              size={16}
              className="text-gray-400 dark:text-gray-500"
            />
          </button>
        )}

        {isConnected ? (
          <div className="flex flex-row items-center gap-2 border border-white/10 rounded-full bg-white/5 backdrop-blur-xl p-1 shadow-lg cursor-pointer">
            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 rounded-full">
              <div className="rounded-full flex items-center justify-center">
                <Wallet size={18} color="gray" strokeWidth="2px" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm  text-white/60">{balance}</span>
                <span className="text-xs text-white/60 ">ETH</span>
              </div>
            </div>

            {caipNetwork && networkImageUrl && (
              <button
                onClick={() => open({ view: "Networks" })}
                className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded-full transition-all group cursor-pointer"
              >
                <Image
                  src={networkImageUrl}
                  alt={caipNetwork.name || "Network"}
                  width={20}
                  height={20}
                  className="rounded-full ring-2 ring-white/10 group-hover:ring-primary-orange/50 transition-all"
                  unoptimized
                />
                <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors hidden sm:inline">
                  {caipNetwork.name}
                </span>
              </button>
            )}

            <button
              onClick={() => open({ view: "Account" })}
              className="flex items-center gap-2 px-5 py-2.5 hover:bg-[#eb5e28] rounded-full font-semibold text-white/70 transition-all hover:scale-105 shadow-2xl  cursor-pointer  "
            >
              <span className="text-sm">
                {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
              </span>
              <ChevronDown size={14} className="opacity-100" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => open()}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r bg-[#eb5e28] rounded-full font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
          >
            <Wallet size={18} />
            <span className="text-sm">Connect Wallet</span>
          </button>
        )}
      </div>
    </nav>
  );
}
