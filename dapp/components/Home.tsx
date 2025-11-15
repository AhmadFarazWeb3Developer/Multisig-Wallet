"use client";

import React, { useEffect, useState } from "react";
import {
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Wallet,
  Settings,
} from "lucide-react";

import useSafeInstance from "../blockchain-interaction/hooks/smartAccount/useSafeInstance";

type safeAddressInterface = {
  safeAddress: String;
};

type Owners = {
  address: string;
  name: string;
};

export default function Home({ safeAddress }: safeAddressInterface) {
  const safeInstance = useSafeInstance(safeAddress);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [safeOwners, setSafeOwners] = useState<Owners[]>([]);
  const [threshold, setThreshold] = useState<string | null>();

  const itemsPerPage = 5;

  const totalPages = Math.ceil(safeOwners.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOwners = safeOwners.slice(startIndex, endIndex);

  const handleCopy = (address: string, index: number) => {
    navigator.clipboard.writeText(address);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    if (!safeInstance) return;

    const fetchOwners = async () => {
      try {
        const blockchainOwners: string[] = await safeInstance.getOwners();

        const response = await fetch("api/owners/", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          console.error("Server error:", response.status);
          return;
        }

        const dbOwners = await response.json();

        const formattedOwners = blockchainOwners.map((address) => {
          const matched = dbOwners.find(
            (owner: any) =>
              owner.owner_address.toLowerCase() === address.toLowerCase()
          );

          return {
            address,
            name: matched ? matched.owner_name : "Unknown Owner",
          };
        });

        const threshold: string = await safeInstance.getThreshold();

        setSafeOwners(formattedOwners);
        setThreshold(threshold);
      } catch (err) {
        console.error("Error fetching owners:", err);
      }
    };

    fetchOwners();
  }, []);

  return (
    <main className="flex flex-col max-w-3xl gap-4 sm:gap-6 p-4 ">
      <div className="flex flex-row  w-full">
        <div className="bg-gradient-to-br from-[#242424] to-[#1A1A1A] border border-[#333333] rounded-l-md rounded-br-md p-2 sm:p-6 shadow-lg w-full">
          <p className="text-[#A0A0A0] text-sm font-semibold mb-2">
            Total Locked Value
          </p>
          <h3 className="text-white text-2xl sm:text-5xl font-bold mb-1">
            0.0 <span className="text-xl sm:text-3xl text-[#A0A0A0]">ETH</span>
          </h3>
        </div>

        <div className="flex flex-row  justify-center  w-1/3 h-10 rounded-r-md">
          <button className="cursor-pointer w-full px-1 sm:py-2 sm:px-2 text-xs sm:text-sm gap-1 sm:gap-2 text-white bg-[#2A2A2A] hover:bg-[#eb5e28] border border-[#333333] hover:border-[#eb5e28] rounded-r-md transition-all flex items-center justify-center ">
            <Wallet className="size-4 " />
            Add Funds
          </button>
        </div>
      </div>

      <div className="flex flex-row w-full">
        <div className="bg-[#242424] border border-[#333333] rounded-l-md rounded-br-md overflow-hidden shadow-lg w-full">
          <div className="p-2 sm:px-6 sm:py-4 border-b border-[#333333] flex items-center justify-between">
            <div>
              <p className="font-bold text-white text-xs sm:text-lg ">
                Wallet Owners
              </p>
              <p className="text-[#A0A0A0] text-xs sm:text-sm mt-1">
                {safeOwners.length} members
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 0}
                className={`p-1 sm:p-2 rounded-sm sm:rounded-lg border border-[#333333]  cursor-pointer hover:bg-[#eb5e28] transition ${
                  currentPage === 0
                    ? "opacity-40 cursor-not-allowed"
                    : "text-white"
                }`}
              >
                <ChevronLeft className="cursor-pointer size-3 sm:size-4" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages - 1}
                className={`p-1 sm:p-2 rounded-sm sm:rounded-lg  border border-[#333333] hover:bg-[#eb5e28] cursor-pointer transition ${
                  currentPage === totalPages - 1
                    ? "opacity-40 cursor-not-allowed"
                    : "text-white"
                }`}
              >
                <ChevronRight className="cursor-pointer size-3 sm:size-4 " />
              </button>
            </div>
          </div>

          <div className="divide-y divide-[#333333]">
            {currentOwners.map((safeOwner, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-2 sm:px-6 py-2 sm:py-4 hover:bg-[#2A2A2A] transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className=" size-8 p-1 sm:size-12  rounded-full ring-1 sm:ring-2 ring-[#333333] transition-all overflow-hidden">
                    <img
                      src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${safeOwner.address}`}
                      alt={safeOwner.name}
                      className="w-full h-full"
                    />
                  </div>

                  <div>
                    <p className="text-white text-sm sm:text-base sm:font-semibold mb-1">
                      {safeOwner.name}
                    </p>
                    <p className="text-[#A0A0A0] text-sm font-mono">
                      {safeOwner.address.slice(0, 6)}...
                      {safeOwner.address.slice(-4)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(safeOwner.address, index)}
                  className="flex cursor-pointer items-center gap-1 px-2 py-1 sm:gap-2 sm:px-4 sm:py-2 bg-[#1A1A1A] hover:bg-[#eb5e28] text-[#A0A0A0] hover:text-white  rounded-sm sm:rounded-lg transition-all border border-[#333333] hover:border-[#eb5e28] group-hover:scale-105"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="size-3 sm:size-4" />
                      <span className="text-xs sm:text-sm  sm:font-medium">
                        Copied!
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="cursor-pointer size-3 sm:size-4" />
                      <span className="text-xs sm:text-sm sm:font-medium">
                        Copy
                      </span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-row justify-center w-1/3 h-10 rounded-r-md">
          <button className="cursor-pointer w-full px-1 sm:py-2 sm:px-2 text-xs sm:text-sm gap-1  sm:gap-2   text-center text-white bg-[#2A2A2A] hover:bg-[#eb5e28] border border-[#333333] hover:border-[#eb5e28] rounded-r-md transition-all flex items-center justify-center ">
            <Plus className=" size-4" />
            Add Owner
          </button>
        </div>
      </div>

      <div className="flex flex-row w-full ">
        <div className="bg-gradient-to-br from-[#242424] to-[#1A1A1A] border border-[#333333] rounded-l-md rounded-br-md p-2 sm:p-6 shadow-lg w-full">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[#A0A0A0] text-xs sm:text-sm font-semibold mb-2">
                Confirmation Threshold
              </p>
              <h3 className="text-white sm:text-4xl font-bold">
                <span className="text-[#eb5e28]">{threshold?.toString()}</span>{" "}
                of {safeOwners.length}
              </h3>
            </div>
            <div className="w-10 h-10 sm:w-20 sm:h-20 rounded-full bg-[#eb5e28]/20 border-1 sm:border-4 border-[#eb5e28] flex items-center justify-center">
              <span className="text-white   sm:text-2xl sm:font-bold">
                {`${threshold?.toString()}/${safeOwners.length}`}
              </span>
            </div>
          </div>

          <div className="flex gap-2 mb-3">
            <div className="flex-1 h-2 bg-[#eb5e28] rounded-full"></div>
            <div className="flex-1 h-2 bg-[#eb5e28] rounded-full"></div>
            <div className="flex-1 h-2 bg-[#333333] rounded-full"></div>
          </div>

          <p className="text-[#A0A0A0] text-sm">
            Number of approvals required to execute a transaction.
          </p>
        </div>

        <div className="flex flex-row  justify-center w-1/3  h-12 rounded-r-md  ">
          <button className="cursor-pointer w-full px-1  gap-1 sm:py-2 sm:px-2 text-xs sm:text-sm sm:gap-2   text-white bg-[#2A2A2A] hover:bg-[#eb5e28] border border-[#333333] hover:border-[#eb5e28] rounded-r-md transition-all flex items-center justify-center ">
            <Settings className="sm:size-4" />
            Change Threshold
          </button>
        </div>
      </div>
    </main>
  );
}
