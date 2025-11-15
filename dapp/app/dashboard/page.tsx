"use client";

import React, { useState, ReactElement, useEffect, useRef } from "react";
import SidePanel from "../../components/SidePanel";
import Home from "@/components/Home";
import { useAppKitAccount } from "@reown/appkit/react";
import { Menu, X } from "lucide-react";

export default function Dashboard() {
  const { address, isConnected } = useAppKitAccount();
  const [component, setComponent] = useState<ReactElement | null>(null);
  const [safeAddress, setSafeAddress] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
          `/api/owners/get-single-owner?address=${encodeURIComponent(address)}`,
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

    fetchConnectedAddressAccounts();
  }, [address, isConnected]);

  return (
    <main className="w-full flex flex-row border-1 border-[#333333] rounded-sm min-h-[80vh]">
      <div className="flex-1 bg-[#1A1A1A] flex flex-row">
        {showMenuIcon && (
          <Menu
            className="text-white cursor-pointer block sm:hidden m-2"
            strokeWidth={1}
            onClick={() => {
              setIsSidebarOpen(true);
            }}
          />
        )}

        <div
          className={`${
            isSidebarOpen ? "block" : "hidden"
          } sm:block bg-[#1A1A1A] sm:static fixed top-0 left-0 w-64 h-full z-50 transform transition-all duration-300 `}
        >
          {showXIcon && (
            <X
              className="text-white cursor-pointer block sm:hidden m-2"
              strokeWidth={1}
              onClick={() => {
                setIsSidebarOpen(false);
              }}
            />
          )}

          <SidePanel setComponent={setComponent} safeAddress={safeAddress} />
        </div>

        <div className="flex-1 from-[#242424] to-[#1A1A1A]">
          {component ? component : <Home safeAddress={safeAddress} />}
        </div>
      </div>
    </main>
  );
}
