"use client";

import React, { useEffect, useState } from "react";
import { Gem, TrendingUp, TrendingDown } from "lucide-react";

const tokensData = [
  {
    id: 1,
    name: "Ethereum",
    symbol: "ETH",
    balance: "2.45",
    value: "4,890.00",
    price: "1,996.00",
    change: "+5.2",
    supply: "120,000,000",
    icon: "",
  },
  {
    id: 2,
    name: "Bitcoin",
    symbol: "BTC",
    balance: "0.125",
    value: "4,375.00",
    price: "35,000.00",
    change: "+2.8",
    supply: "21,000,000",
    icon: "",
  },
  {
    id: 3,
    name: "Solana",
    symbol: "SOL",
    balance: "85.5",
    value: "3,420.00",
    price: "40.00",
    change: "-1.5",
    supply: "555,000,000",
    icon: "",
  },
  {
    id: 4,
    name: "Chainlink",
    symbol: "LINK",
    balance: "450",
    value: "6,750.00",
    price: "15.00",
    change: "+8.3",
    supply: "1,000,000,000",
    icon: "",
  },
  {
    id: 5,
    name: "Polygon",
    symbol: "MATIC",
    balance: "1,250",
    value: "1,125.00",
    price: "0.90",
    change: "-2.1",
    supply: "10,000,000,000",
    icon: "",
  },
  {
    id: 6,
    name: "Avalanche",
    symbol: "AVAX",
    balance: "32.8",
    value: "1,148.00",
    price: "35.00",
    change: "+4.7",
    supply: "720,000,000",
    icon: "",
  },
];

const nftsData = [
  {
    id: 1,
    name: "Bored Ape #1234",
    collection: "Bored Ape Yacht Club",
    image:
      "https://cdn.decrypt.co/wp-content/uploads/2021/11/timbaland-bored-ape-nft-gID_6.png",
    floorPrice: "45.5 ETH",
    lastSale: "42.0 ETH",
  },
  {
    id: 2,
    name: "CryptoPunk #5678",
    collection: "CryptoPunks",
    image: "https://rallyrd.com/wp-content/uploads/2022/03/Punk-02.jpg",
    floorPrice: "65.2 ETH",
    lastSale: "60.0 ETH",
  },
  {
    id: 3,
    name: "Azuki #9012",
    collection: "Azuki",
    image:
      "https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/329418864/original/fba38221a9326ef80b79d9d87e6a838ba161be13/make-personalized-azuki-nft-art-for-you.jpeg",
    floorPrice: "12.3 ETH",
    lastSale: "11.5 ETH",
  },
  {
    id: 4,
    name: "Doodle #3456",
    collection: "Doodles",
    image:
      "https://img.bgstatic.com/multiLang/image/social/ba1f7f1a0f2cfaf71c30f6963969f1971746812668363.jpg",
    floorPrice: "8.7 ETH",
    lastSale: "9.2 ETH",
  },
  {
    id: 5,
    name: "Moonbird #7890",
    collection: "Moonbirds",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9JbNBUGddklk9Pr-DWzdd4FOC655m6JsGBA&s",
    floorPrice: "15.2 ETH",
    lastSale: "14.8 ETH",
  },
  {
    id: 6,
    name: "Clone X #2345",
    collection: "Clone X",
    image:
      "https://imageio.forbes.com/specials-images/imageserve/61a5031d6a4e45c93370c192/0x0.png?format=png&crop=1009,757,x0,y166,safe&height=900&width=1600&fit=bounds",
    floorPrice: "6.8 ETH",
    lastSale: "7.1 ETH",
  },
];

export default function Assets() {
  const [activeTab, setActiveTab] = useState<"tokens" | "nfts">("tokens");
  const [tokens, setTokens] = useState(tokensData); // use state for tokens

  const [logoUrls, setLogoUrls] = useState<string[]>([]);

  const apiKey = process.env.NEXT_PUBLIC_LOGODEV_API_KEY;
  if (!apiKey) throw new Error("NEXT_LOGODEV_API_KEY is not set");

  useEffect(() => {
    const updatedTokenData = tokensData.map((token) => ({
      ...token,
      icon: `https://img.logo.dev/crypto/${token.symbol.toLowerCase()}?token=${apiKey}`,
    }));
    setTokens(updatedTokenData);
  }, [tokensData, apiKey]);

  const renderTokens = () => (
    <div className="space-y-3">
      {tokens.map((token) => (
        <div
          key={token.id}
          className="bg-gradient-to-r from-[#111111] to-[#0e0e0e] border border-[#222222] rounded-xl p-3 sm:p-5 hover:border-[#eb5e28]/50 hover:shadow-lg hover:shadow-[#eb5e28]/10 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center  gap-2 sm:gap-4">
              <div className=" size-8 sm:w-14 sm:h-14 bg-gradient-to-br rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                <img src={token.icon} alt="" className=" rounded-full" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm  sm:text-lg">
                  {token.symbol}
                </h3>
                <p className="text-[#8a8a8a] text-sm  sm:text-lg">
                  {token.name}
                </p>
              </div>
            </div>

            <div className="hidden md:flex flex-col items-end">
              <p className="text-white font-semibold text-lg">
                {token.balance} {token.symbol}
              </p>
              <p className="text-[#8a8a8a] text-sm">${token.value}</p>
            </div>

            <div className="hidden lg:flex flex-col items-end">
              <p className="text-[#a0a0a0] text-sm">
                Price: <span className="text-white">${token.price}</span>
              </p>
              <p className="text-[#8a8a8a] text-xs">Supply: {token.supply}</p>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5  rounded-md sm:rounded-lg font-semibold  text-xs sm:text-sm ${
                  token.change.startsWith("+")
                    ? "bg-[#10b981]/10 text-[#10b981]"
                    : "bg-[#ef4444]/10 text-[#ef4444]"
                }`}
              >
                {token.change.startsWith("+") ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
                {token.change}%
              </div>
            </div>
          </div>

          <div className="md:hidden mt-4 pt-4 border-t border-[#222222] grid grid-cols-2 gap-4">
            <div>
              <p className="text-[#8a8a8a] text-xs  mb-0.5 sm:mb-1">Balance</p>
              <p className="text-white text-sm sm:text-lg font-semibold">
                {token.balance} {token.symbol}
              </p>
            </div>
            <div>
              <p className="text-[#8a8a8a] text-xs mb-0.5 sm:mb-1">Value</p>
              <p className="text-white text-sm sm:text-lg font-semibold">
                ${token.value}
              </p>
            </div>
            <div>
              <p className="text-[#8a8a8a] text-xs mb-0.5 sm:mb-1">Price</p>
              <p className="text-[#a0a0a0] text-sm">${token.price}</p>
            </div>
            <div>
              <p className="text-[#8a8a8a] text-xs mb-0.5 sm:mb-1">Supply</p>
              <p className="text-[#a0a0a0] text-sm">{token.supply}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderNFTs = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ">
      {nftsData.map((nft) => (
        <div
          key={nft.id}
          className="bg-[#111111] border border-[#222222] rounded-xl overflow-hidden hover:border-[#eb5e28] hover:shadow-xl hover:shadow-[#eb5e28]/20 transition-all duration-300 group cursor-pointer"
        >
          <div className="aspect-square bg-[#1a1a1a] overflow-hidden relative">
            <img
              src={nft.image}
              alt={nft.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <div className="p-4 space-y-3">
            <div>
              <h3 className="text-white font-bold text-base mb-1 truncate">
                {nft.name}
              </h3>
              <p className="text-[#8a8a8a] text-sm flex items-center gap-1.5">
                <Gem size={14} className="text-[#eb5e28]" />
                {nft.collection}
              </p>
            </div>

            <div className="pt-3 border-t border-[#222222] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[#8a8a8a] text-xs">Floor Price</span>
                <span className="text-white text-sm font-bold">
                  {nft.floorPrice}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#8a8a8a] text-xs">Last Sale</span>
                <span className="text-[#a0a0a0] text-sm">{nft.lastSale}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderEmptyState = (icon: React.ReactNode, text: string) => (
    <div className="flex flex-col items-center justify-center h-[400px] text-[#A0A0A0]">
      <div className="mb-4">{icon}</div>
      <p className="text-sm">{text}</p>
    </div>
  );

  const hasTokens = tokensData.length > 0;
  const hasNFTs = nftsData.length > 0;

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#0e0e0e] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Assets</h1>

      <div className="flex items-center gap-6 border-b border-[#333333] mb-6">
        <button
          onClick={() => setActiveTab("tokens")}
          className={`pb-3 text-sm font-medium transition relative cursor-pointer ${
            activeTab === "tokens"
              ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#eb5e28]"
              : "text-[#A0A0A0] hover:text-white"
          }`}
        >
          Tokens
        </button>

        <button
          onClick={() => setActiveTab("nfts")}
          className={`pb-3 text-sm font-medium relative cursor-pointer ${
            activeTab === "nfts"
              ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#eb5e28]"
              : "text-[#A0A0A0] hover:text-white"
          }`}
        >
          NFTs
        </button>
      </div>

      <div className="flex-1">
        {activeTab === "tokens" && (
          <>
            {hasTokens
              ? renderTokens()
              : renderEmptyState(
                  <div className="w-14 h-14 bg-gradient-to-br from-[#eb5e28] to-[#d94a1a] rounded-full flex items-center justify-center text-2xl">
                    ◎
                  </div>,
                  "No tokens available or none detected"
                )}
          </>
        )}

        {activeTab === "nfts" && (
          <>
            {hasNFTs
              ? renderNFTs()
              : renderEmptyState(
                  <Gem size={40} strokeWidth={1.5} />,
                  "No NFTs available or none detected"
                )}
          </>
        )}
      </div>
    </main>
  );
}
