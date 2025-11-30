"use client";

import React, { useState, ReactElement, useEffect } from "react";
import SidePanel from "../../components/SidePanel";
import Home from "@/components/Home";
import { useAppKitAccount } from "@reown/appkit/react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { address, isConnected } = useAppKitAccount();
  const [component, setComponent] = useState<ReactElement | null>(null);
  const [safeAddress, setSafeAddress] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const showMenuIcon = !isSidebarOpen;
  const showXIcon = isSidebarOpen;

  useEffect(() => {
    if (!isConnected || !address) {
      console.log("Wallet not connected or address unavailable");
      return;
    }

    const fetchConnectedAddressAccounts = async () => {
      try {
        const res = await fetch(
          `/api/owners/get-safes-by-owner?address=${encodeURIComponent(
            address
          )}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!res.ok) {
          console.error("Server error:", res.status);
          return;
        }

        const data = await res.json();

        setSafeAddress(data[0]?.safe_address);

        console.log("Owner data:", data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    const verifyOnStart = async () => {
      if (!address) return;
      const response = await fetch(
        `/api/safes/verify-safe/?walletAddress=${encodeURIComponent(address)}`
      );

      const data = await response.json();

      if (!response.ok || !data || data.length === 0) {
        router.push("/");
      }
    };

    verifyOnStart();
    fetchConnectedAddressAccounts();
  }, [address, isConnected]);

  return (
    <main className="overflow-auto w-full flex flex-row border-1 border-[#333333] rounded-sm min-h-[80vh]">
      <div className="flex-1 bg-[#1A1A1A] sm:static relative flex flex-col sm:flex-row flex-">
        {showMenuIcon && (
          <Menu
            className="text-white cursor-pointer block sm:hidden m-2"
            strokeWidth={1}
            size={16}
            onClick={() => {
              setIsSidebarOpen(true);
            }}
          />
        )}

        <div
          className={`${
            isSidebarOpen ? "block" : "hidden"
          } sm:block bg-[#1A1A1A] sm:static fixed w-64 h-full z-50 transform transition-all duration-300`}
        >
          {showXIcon && (
            <X
              className="text-white cursor-pointer block sm:hidden m-2"
              strokeWidth={1}
              size={16}
              onClick={() => {
                setIsSidebarOpen(false);
              }}
            />
          )}

          <SidePanel
            setComponent={setComponent}
            safeAddress={safeAddress}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </div>

        <div
          className={`overflow-auto flex-1 from-[#242424] to-[#1A1A1A] transition-all duration-300 ${
            isSidebarOpen ? "blur-sm " : "blur-0 "
          }`}
        >
          {component ? component : <Home safeAddress={safeAddress} />}
        </div>
      </div>
    </main>
  );
}
