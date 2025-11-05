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
  const [threshold, setThreshold] = useState<number | null>();

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

        const threshold = await safeInstance.getThreshold();

        setSafeOwners(formattedOwners);
        setThreshold(Number(threshold));
      } catch (err) {
        console.error("Error fetching owners:", err);
      }
    };

    fetchOwners();
  }, [safeInstance]);

  return (
    <main className="flex flex-col max-w-3xl gap-6 p-4 ">
      <div className="flex flex-row w-full">
        <div className="bg-gradient-to-br from-[#242424] to-[#1A1A1A] border border-[#333333] rounded-l-md rounded-br-md p-6 shadow-lg w-full">
          <p className="text-[#A0A0A0] text-sm font-semibold mb-2">
            Total Locked Value
          </p>
          <h3 className="text-white text-5xl font-bold mb-1">
            0.0 <span className="text-3xl text-[#A0A0A0]">ETH</span>
          </h3>
        </div>

        <div className="flex flex-row justify-center w-1/3 h-10 rounded-r-md">
          <button className="cursor-pointer w-full py-2 text-sm text-white bg-[#2A2A2A] hover:bg-[#eb5e28] border border-[#333333] hover:border-[#eb5e28] rounded-r-md transition-all flex items-center justify-center gap-2">
            <Wallet size={16} />
            Add Funds
          </button>
        </div>
      </div>

      <div className="flex flex-row w-full">
        <div className="bg-[#242424] border border-[#333333] rounded-l-md rounded-br-md overflow-hidden shadow-lg w-full">
          <div className="px-6 py-4 border-b border-[#333333] flex items-center justify-between">
            <div>
              <p className="font-bold text-white text-lg">Wallet Owners</p>
              <p className="text-[#A0A0A0] text-sm mt-1">
                {safeOwners.length} members
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 0}
                className={`p-2 rounded-lg border border-[#333333] cursor-pointer hover:bg-[#eb5e28] transition ${
                  currentPage === 0
                    ? "opacity-40 cursor-not-allowed"
                    : "text-white"
                }`}
              >
                <ChevronLeft size={18} className="cursor-pointer" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages - 1}
                className={`p-2 rounded-lg border border-[#333333] hover:bg-[#eb5e28] cursor-pointer transition ${
                  currentPage === totalPages - 1
                    ? "opacity-40 cursor-not-allowed"
                    : "text-white"
                }`}
              >
                <ChevronRight size={18} className="cursor-pointer" />
              </button>
            </div>
          </div>

          <div className="divide-y divide-[#333333]">
            {currentOwners.map((safeOwner, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-6 py-4 hover:bg-[#2A2A2A] transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full ring-2 ring-[#333333] transition-all overflow-hidden">
                    <img
                      src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${safeOwner.address}`}
                      alt={safeOwner.name}
                      className="w-full h-full"
                    />
                  </div>

                  <div>
                    <p className="text-white text-base font-semibold mb-1">
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
                  className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-[#1A1A1A] hover:bg-[#eb5e28] text-[#A0A0A0] hover:text-white rounded-lg transition-all border border-[#333333] hover:border-[#eb5e28] group-hover:scale-105"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check size={16} />
                      <span className="text-sm font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} className="cursor-pointer" />
                      <span className="text-sm font-medium">Copy</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-row  justify-center w-1/3 h-10 rounded-r-md">
          <button className="cursor-pointer w-full py-2 text-sm text-center text-white bg-[#2A2A2A] hover:bg-[#eb5e28] border border-[#333333] hover:border-[#eb5e28] rounded-r-md transition-all flex items-center justify-center gap-2">
            <Plus size={16} />
            Add Owner
          </button>
        </div>
      </div>

      <div className="flex flex-row w-full">
        <div className="bg-gradient-to-br from-[#242424] to-[#1A1A1A] border border-[#333333] rounded-l-md rounded-br-md p-6 shadow-lg w-full">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[#A0A0A0] text-sm font-semibold mb-2">
                Confirmation Threshold
              </p>
              <h3 className="text-white text-4xl font-bold">
                <span className="text-[#eb5e28]">{Number(threshold)}</span> of{" "}
                {safeOwners.length}
              </h3>
            </div>
            <div className="w-20 h-20 rounded-full bg-[#eb5e28]/20 border-4 border-[#eb5e28] flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {`${Number(threshold)}/${safeOwners.length}`}
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

        <div className="flex flex-row  justify-center w-1/3 h-10 rounded-r-md">
          <button className="cursor-pointer w-full py-2 text-sm text-white bg-[#2A2A2A] hover:bg-[#eb5e28] border border-[#333333] hover:border-[#eb5e28] rounded-r-md transition-all flex items-center justify-center gap-2">
            <Settings size={16} />
            Change Threshold
          </button>
        </div>
      </div>
    </main>
  );
}
