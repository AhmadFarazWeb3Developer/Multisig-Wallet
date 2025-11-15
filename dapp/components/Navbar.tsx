"use client";
import Link from "next/link";
import {
  useAppKit,
  useAppKitAccount,
  useAppKitProvider,
  useAppKitNetwork,
  useAppKitState,
} from "@reown/appkit/react";

import {
  Wallet,
  ChevronDown,
  Vault,
  Bell,
  BellDot,
  Menu,
  MenuIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ethers } from "ethers";
import { getNetworkToken } from "../blockchain-interaction/helper/getNetworkToken";
import { MenuList } from "@mui/material";

export default function Navbar() {
  const { open, close } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { caipNetwork, chainId } = useAppKitNetwork();
  const { walletProvider } = useAppKitProvider("eip155");
  const { open: isModalOpen } = useAppKitState();

  const [nativeToken, setNativeToken] = useState({
    symbol: "ETH",
    name: "Ether",
  });
  const [previousChainId, setPreviousChainId] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [balance, setBalance] = useState<string>("0.00");

  const [isNotification, setIsNotification] = useState(true);

  useEffect(() => {
    if (
      previousChainId !== null &&
      previousChainId !== chainId &&
      isModalOpen
    ) {
      close();
    }
    setPreviousChainId(chainId);
  }, [chainId, isModalOpen, close, previousChainId]);

  useEffect(() => {
    if (chainId) {
      const token = getNetworkToken(chainId);
      setNativeToken(token);
    }
  }, [chainId]);

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
          setBalance("0.00");
        }
      }
    };

    fetchBalance();
  }, [isConnected, address, chainId, walletProvider]);

  useEffect(() => {
    setImageLoaded(false);
  }, [chainId, caipNetwork]);

  const getNetworkImageUrl = () => {
    if (!chainId) return null;

    const chainMap = {
      1: "ethereum",
      137: "polygon",
      56: "smartchain",
      42161: "arbitrum",
      10: "optimism",
      43114: "avalanchec",
      8453: "base",
      250: "fantom",
      100: "xdai",
      11155111: "ethereum",
      80002: "polygon",
      97: "smartchain",
      421614: "arbitrum",
      43113: "avalanchec",
      11155420: "optimism",
      84532: "base",
      31337: "ethereum",
    };

    const chainName = chainMap[chainId];
    if (chainName) {
      return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chainName}/info/logo.png`;
    }

    return null;
  };

  const networkImageUrl = getNetworkImageUrl();

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageLoaded(false);
  };

  return (
    <nav className="flex items-center justify-between sm:py-4 ">
      <Link href="/" className="flex items-center">
        <Vault color="white" className="h-6 w-6 sm:h-10  sm:w-10 " />
      </Link>
      <div className=" flex flex-row  gap-1 sm:gap-2 items-center">
        <div className=" py-3 pl-3 sm:px-3 sm:border-r-1  sm:border-r-white/10 ">
          {isNotification ? (
            <Bell
              strokeWidth={1}
              className="text-white cursor-pointer h-5 w-5 sm:h-6 sm:w-6"
            />
          ) : (
            <BellDot
              strokeWidth={1}
              className=" text-[#eb5e28]  cursor-pointer h-5 w-5"
            />
          )}
        </div>
        <div className="wallet flex items-center gap-1 ">
          {isConnected ? (
            <div className="flex flex-row items-center gap-1 sm:px-2 border border-white/10 rounded-full bg-white/5 backdrop-blur-xl  shadow-lg sm:py-2">
              <div className="sm:flex items-center justify-center hidden  gap-2 px-2 py-2 bg-white/5 rounded-full">
                <div className="rounded-full flex items-center justify-center">
                  <Wallet size={18} color="gray" strokeWidth="2px" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-white/60">
                    {balance}
                  </span>
                  <span className="text-xs sm:text-sm text-white/60  ">
                    ETH
                  </span>
                </div>
              </div>

              {caipNetwork && (
                <button
                  onClick={() => open({ view: "Networks" })}
                  className="flex items-center gap-1 px-2 py-1  rounded-full group cursor-pointer  transition-all hover:scale-105 hover:bg-[#eb5e28]"
                >
                  {networkImageUrl && (
                    <img
                      src={networkImageUrl}
                      alt={caipNetwork.name || "Network"}
                      className=" w-5 h-5 rounded-full   transition-all object-cover"
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                      style={{ display: imageLoaded ? "block" : "none" }}
                    />
                  )}

                  {(!networkImageUrl || !imageLoaded) && (
                    <div className=" w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-[10px]  sm:text-sm font-bold text-white ring-2 ring-white/10  transition-all ">
                      {caipNetwork.name?.charAt(0)?.toUpperCase() || "N"}
                    </div>
                  )}

                  <span className="text-[10px]  sm:text-sm text-white/80 group-hover:text-white transition-colors ">
                    {caipNetwork.name}
                  </span>
                  <ChevronDown size={14} className="text-white/60 " />
                </button>
              )}
              <button
                onClick={() => open({ view: "Account" })}
                className=" bg-black flex items-center gap-2 px-2 py-2 hover:bg-[#eb5e28] rounded-full  text-white/70 transition-all hover:scale-105 shadow-2xl  cursor-pointer  "
              >
                <span className="text-xs sm:text-sm">
                  {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
                </span>
                <ChevronDown size={14} className="opacity-100" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => open()}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r bg-[#eb5e28] rounded-full font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
            >
              <Wallet size={18} />
              <span className="text-xs sm:text-sm">Connect Wallet</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
