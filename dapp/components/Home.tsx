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
  Pencil,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { formatEther } from "ethers/lib/utils";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import useSafeInstance from "../blockchain-interaction/hooks/smartAccount/useSafeInstance";
import useInstancesSigner from "@/blockchain-interaction/helper/instancesSigner";

type safeAddressInterface = {
  safeAddress: string;
};

type Owners = {
  address: string;
  name: string;
};

export default function Home({ safeAddress }: safeAddressInterface) {
  const router = useRouter();
  const { safeReadInstance } = useSafeInstance(safeAddress);
  const InstancesSigner = useInstancesSigner();
  const { walletProvider } = useAppKitProvider("eip155");

  const { address, isConnected } = useAppKitAccount();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");
  const [safeOwners, setSafeOwners] = useState<Owners[]>([]);
  const [safeETH, setSafeETH] = useState<string>("0");
  const [safetokens, setSafeTokens] = useState<string>("0");

  const [threshold, setThreshold] = useState<String | null>();

  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

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

  const handleEdit = (index: number, currentName: string) => {
    setEditingIndex(index);
    setEditedName(currentName);
  };

  const handleSaveName = async (ownerAddress: string) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/owners/update-owner-name", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner_address: ownerAddress,
          owner_name: editedName,
        }),
      });
      if (!response.ok) {
        toast.error("Faild to update name", {
          action: { label: "Close", onClick: () => {} },
        });
      }

      setSafeOwners((prev) =>
        prev.map((owner, i) =>
          i === editingIndex ? { ...owner, name: editedName } : owner
        )
      );

      setEditingIndex(null);
    } catch (err) {
      setIsLoading(false);
      console.error("Failed to update owner name:", err);
    } finally {
      setIsLoading(false);

      toast.success(`Name Updated!`, {
        action: {
          label: "Close",
          onClick: () => {},
        },
      });
    }
  };

  useEffect(() => {
    if (!safeAddress || !safeReadInstance!) return;
    if (!isConnected || !walletProvider) return;
    const fetchOwners = async () => {
      try {
        setIsDataLoading(true);
        const blockchainOwners: string[] = await safeReadInstance.getOwners();
        const { safeTokensMockInstance } = await InstancesSigner();

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

        const threshold: string = await safeReadInstance.getThreshold();

        if (!safeTokensMockInstance) {
          toast.error("Safe Token Intance not exists");
          return;
        }

        const balance = await safeReadInstance.provider.getBalance(safeAddress);
        const tokens = await safeTokensMockInstance.balanceOf(safeAddress);

        setSafeOwners(formattedOwners);

        setThreshold(threshold);
        setSafeTokens(formatEther(tokens));
        setSafeETH(formatEther(balance));
      } catch (err) {
        console.error("Error fetching owners:", err);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchOwners();
  }, [safeAddress, safeReadInstance, isConnected, walletProvider]);

  console.log(safeETH);
  console.log(safetokens);
  return (
    <main className="flex flex-col max-w-3xl gap-4 sm:gap-6 p-4 ">
      <div className="flex flex-col sm:flex-row  w-full">
        {!isDataLoading ? (
          <>
            <div
              className="w-full bg-gradient-to-br  from-[#242424] to-[#1A1A1A] 
     border border-[#333333]  rounded-t-md   sm:rounded-tr-none  sm:rounded-l-md sm:rounded-br-md rounded-xl p-6 shadow-lg flex flex-col gap-5"
            >
              <div className="flex flex-col gap-1">
                <p className="text-[#A0A0A0] text-sm font-semibold tracking-wide">
                  Total Locked Value
                </p>

                <div className="flex items-baseline gap-2">
                  <h3 className="text-white text-4xl sm:text-5xl font-bold leading-tight">
                    {safeETH || "0"}
                  </h3>
                  <span className="text-[#A0A0A0] text-lg sm:text-2xl font-semibold">
                    ETH
                  </span>
                </div>
              </div>

              <div className="h-px bg-[#333333] w-full"></div>

              <div className="flex flex-col gap-1">
                <p className="text-[#A0A0A0] text-sm font-semibold tracking-wide">
                  Total Safws Tokens
                </p>

                <div className="flex items-baseline gap-2">
                  <h3 className="text-white text-4xl sm:text-5xl font-bold leading-tight">
                    {safetokens || "0"}
                  </h3>
                  <span className="text-[#A0A0A0] text-lg sm:text-2xl font-semibold">
                    Safws
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <Skeleton className="w-full h-60 rounded-t-md sm:rounded-tr-none sm:rounded-l-md" />
        )}

        <div className="flex flex-row justify-center sm:w-1/3 sm:h-10 sm:rounded-r-md">
          <button
            onClick={() =>
              router.push(`/new-transaction/?safeAddress=${safeAddress}`)
            }
            className="flex py-2 active:bg-[#eb5e28] active:scale-95 sm:active:scale-100  rounded-b-md sm:rounded-bl-none items-center justify-center w-full  gap-2  px-1 sm:py-2 sm:px-2 text-xs sm:text-sm  sm:gap-2 text-white bg-[#2A2A2A] hover:bg-[#eb5e28] border border-[#333333] hover:border-[#eb5e28] sm:rounded-r-md transition-all cursor-pointer  "
          >
            <Wallet className="size-4 " />
            Add Funds
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row w-full">
        {!isDataLoading ? (
          <>
            <div className="bg-[#242424] border border-[#333333] border-b-0  rounded-t-md   sm:rounded-tr-none  sm:rounded-l-md sm:rounded-br-md overflow-hidden shadow-lg w-full">
              <div className="p-2  py-3 sm:px-6 sm:py-4 border-b border-[#333333] flex items-center justify-between">
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
                    className={`p-1 sm:p-2  rounded-sm sm:rounded-lg border border-[#333333]  cursor-pointer hover:bg-[#eb5e28] transition ${
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
                      <div className="size-8 p-1 sm:size-12 rounded-full ring-1 sm:ring-2 ring-[#333333] overflow-hidden">
                        <img
                          src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${safeOwner.address}`}
                          alt={safeOwner.name}
                          className="w-full h-full"
                        />
                      </div>

                      <div className="flex flex-col">
                        {editingIndex === index ? (
                          <div className="flex items-center gap-2">
                            <input
                              value={editedName}
                              onChange={(e) => setEditedName(e.target.value)}
                              className="bg-[#1A1A1A] border border-[#333333] text-white text-sm px-2 py-1 rounded"
                              autoFocus
                            />

                            {!isLoading ? (
                              <button
                                onClick={() =>
                                  handleSaveName(safeOwner.address)
                                }
                                className="text-xs px-2 py-1 bg-[#eb5e28] text-white rounded cursor-pointer"
                              >
                                Save
                              </button>
                            ) : (
                              <div className="flex items-center gap-2 text-sm  text-[#eb5e28]">
                                <Loader2 className="animate-spin w-4 h-4" />
                                Updating...
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <p className="text-white text-sm sm:text-base sm:font-semibold">
                              {safeOwner.name}
                            </p>

                            <button
                              onClick={() => handleEdit(index, safeOwner.name)}
                              className="text-[#A0A0A0] hover:text-white  cursor-pointer"
                            >
                              <Pencil className="size-4" />
                            </button>
                          </div>
                        )}

                        <p className="text-[#A0A0A0] text-sm font-mono">
                          {safeOwner.address.slice(0, 6)}...
                          {safeOwner.address.slice(-4)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopy(safeOwner.address, index)}
                      className="flex cursor-pointer items-center gap-1 px-2 py-1 sm:gap-2 sm:px-4 sm:py-2 bg-[#1A1A1A] hover:bg-[#eb5e28] text-[#A0A0A0] hover:text-white rounded-sm sm:rounded-lg transition-all border border-[#333333] hover:border-[#eb5e28]"
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="size-3 sm:size-4" />
                          <span className="text-xs sm:text-sm">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3 sm:size-4" />
                          <span className="text-xs sm:text-sm">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <Skeleton className="w-full h-80 rounded-t-md sm:rounded-tr-none sm:rounded-l-md" />
        )}
        <div className="flex flex-row justify-center  sm:w-1/3 sm:h-10  sm:rounded-r-md ">
          <button
            onClick={() =>
              router.push(`/new-transaction/?safeAddress=${safeAddress}`)
            }
            className="cursor-pointer w-full active:bg-[#eb5e28] active:scale-95 sm:active:scale-100  px-1 py-2 sm:py-2 sm:px-2 text-xs sm:text-sm gap-2  sm:gap-2   text-center text-white bg-[#2A2A2A] hover:bg-[#eb5e28] border border-[#333333] hover:border-[#eb5e28]  rounded-b-md sm:rounded-r-md sm:rounded-bl-none transition-all flex items-center justify-center "
          >
            <Plus className=" size-4" />
            Add Owner
          </button>
        </div>
      </div>

      <div className="flex  flex-col sm:flex-row w-full ">
        {!isDataLoading ? (
          <>
            <div className="bg-gradient-to-br from-[#242424] to-[#1A1A1A] border border-[#333333]    rounded-t-md sm:rounded-l-md sm:rounded-br-md sm:rounded-tr-none p-2 py-3 sm:p-6 shadow-lg w-full">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[#A0A0A0] text-xs sm:text-sm font-semibold mb-2">
                    Confirmation Threshold
                  </p>
                  <h3 className="text-white sm:text-4xl font-bold">
                    <span className="text-[#eb5e28]">
                      {threshold?.toString()}
                    </span>{" "}
                    of {safeOwners.length}
                  </h3>
                </div>
                <div className="w-10 h-10 sm:w-20 sm:h-20 rounded-full bg-[#eb5e28]/20 border-1 sm:border-4 border-[#eb5e28] flex items-center justify-center">
                  <span className="text-white   sm:text-2xl sm:font-bold">
                    {`${threshold?.toString()}/${safeOwners.length}`}
                  </span>
                </div>
              </div>

              <div className="hidden  sm:flex gap-2 mb-3">
                <div className="flex-1 h-1 sm:h-2 bg-[#eb5e28] rounded-full"></div>
                <div className="flex-1 h-1 sm:h-2 bg-[#eb5e28] rounded-full"></div>
                <div className="flex-1 h-1 sm:h-2 bg-[#333333] rounded-full"></div>
              </div>

              <p className="text-[#A0A0A0] text-xs sm:text-sm">
                Number of approvals required to execute a transaction.
              </p>
            </div>
          </>
        ) : (
          <Skeleton className="w-full h-48 rounded-t-md sm:rounded-tr-none sm:rounded-l-md" />
        )}

        <div className="flex flex-row justify-center sm:w-1/3  sm:h-12  sm:rounded-r-md sm:rounded-bl-none sm:rounded-tl-none">
          <button
            onClick={() =>
              router.push(`/new-transaction/?safeAddress=${safeAddress}`)
            }
            className="cursor-pointer w-full  active:bg-[#eb5e28] active:scale-95 sm:active:scale-100  px-1 py-2 gap-2 sm:py-2 sm:px-2 text-xs sm:text-sm sm:gap-2   text-white bg-[#2A2A2A] hover:bg-[#eb5e28] border border-[#333333] hover:border-[#eb5e28]  rounded-b-md sm:rounded-r-md sm:rounded-bl-none sm:rounded-tl-none transition-all flex items-center justify-center "
          >
            <Settings className=" size-3 sm:size-4" />
            Change Threshold
          </button>
        </div>
      </div>
    </main>
  );
}
