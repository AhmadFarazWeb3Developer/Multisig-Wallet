import { HomeIcon, ArrowDownUp, Circle, Copy } from "lucide-react";
import React, { ReactElement, useState, Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import Home from "./Home";
import Transactions from "./Transactions";
import Assets from "./Assets";

type SidePanelProps = {
  setComponent: Dispatch<SetStateAction<ReactElement | null>>;
  safeAddress: string;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
};

export default function SidePanel({
  setComponent,
  safeAddress,
  setIsSidebarOpen,
}: SidePanelProps) {
  const [activeTab, setActiveTab] = useState<string>("home");

  return (
    <aside className="bg-[#242424] border-r border-[#333333] min-h-[80vh] w-64  p-2 sm:p-4 transition-shadow duration-300">
      <div className="flex items-center justify-center py-2 sm:py-3 bg-[#2a2a2a] rounded-md  border border-[#333333]">
        <div className="flex items-center justify-center gap-3  ">
          <div className="size-8 rounded-full ring-2 ring-[#333333] transition-all overflow-hidden">
            <img
              src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${safeAddress}`}
              alt=""
              className="w-full h-full"
            />
          </div>

          <div className="flex flex-col ">
            <p className="text-gray-500 text-xs font-semibold">
              Account Address
            </p>
            <div className=" flex flex-row gap-4">
              {safeAddress ? (
                <p className="text-white text-sm font-mono">
                  {`${safeAddress?.slice(0, 6)}...${safeAddress?.slice(-6)}`}
                </p>
              ) : (
                <div className="flex gap-1 items-center">
                  <div
                    className="w-1 h-1 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-1 h-1 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-1 h-1 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                  <div
                    className="w-1 h-1 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "450ms" }}
                  />
                </div>
              )}

              <button
                onClick={() => {
                  navigator.clipboard.writeText(safeAddress.toString());
                  toast.success("copied");
                }}
                className=" text-gray-500  hover:text-[#d54e20] transition-colors cursor-pointer"
              >
                <Copy size={12} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className=" h-[0.4px] bg-gray-700/50 my-4"> </div>

      <div className="space-y-2">
        <button
          onClick={() => {
            setComponent(<Home safeAddress={safeAddress} />);
            setActiveTab("home");
            setIsSidebarOpen(false);
          }}
          className={`w-full flex items-center gap-3 px-4 py-2 rounded-md font-bold transition-all cursor-pointer ${
            activeTab === "home"
              ? "bg-[#eb5e28] text-white shadow-lg"
              : "text-[#A0A0A0] hover:bg-[#eb5e28]/20 hover:text-white"
          }`}
        >
          <HomeIcon size={17} />
          <span className="text-sm">Home</span>
        </button>

        <button
          onClick={() => {
            setComponent(<Assets />);
            setActiveTab("assets");
            setIsSidebarOpen(false);
          }}
          className={`w-full flex items-center gap-3 px-4 py-2 rounded-md font-bold transition-all cursor-pointer ${
            activeTab === "assets"
              ? "bg-[#eb5e28] text-white shadow-lg"
              : "text-[#A0A0A0] hover:bg-[#eb5e28]/20 hover:text-white"
          }`}
        >
          <div className="relative w-5 h-5 flex items-center justify-start">
            <Circle
              size={16}
              className="absolute left-0"
              fill="currentColor"
              fillOpacity={0.2}
            />
            <Circle
              size={16}
              className="absolute left-2"
              fill="currentColor"
              fillOpacity={0.2}
            />
          </div>
          <span className="text-sm">Assets</span>
        </button>

        <button
          onClick={() => {
            setComponent(<Transactions safeAddress={safeAddress} />);
            setActiveTab("transactions");
            setIsSidebarOpen(false);
          }}
          className={`w-full flex items-center gap-3 px-4 py-2 rounded-md font-bold transition-all cursor-pointer ${
            activeTab === "transactions"
              ? "bg-[#eb5e28] text-white shadow-lg"
              : "text-[#A0A0A0] hover:bg-[#eb5e28]/20 hover:text-white"
          }`}
        >
          <ArrowDownUp size={16} />
          <span className="text-sm">Transactions</span>
        </button>
      </div>
    </aside>
  );
}
