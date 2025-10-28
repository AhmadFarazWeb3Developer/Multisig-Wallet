import { HomeIcon, ArrowDownUp, Circle } from "lucide-react";
import React, { ReactElement, useState, Dispatch, SetStateAction } from "react";
import Home from "./Home";
import Transactions from "./Transactions";
import Assets from "./Assets";

type SidePanelProps = {
  setComponent: Dispatch<SetStateAction<ReactElement | null>>;
};

export default function SidePanel({ setComponent }: SidePanelProps) {
  const [activeTab, setActiveTab] = useState<string>("home");

  return (
    <aside className="bg-[#242424] border-r border-[#333333] min-h-[80vh] w-64 p-4">
      <div className="space-y-2">
        <button
          onClick={() => {
            setComponent(<Home />);
            setActiveTab("home");
          }}
          className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === "home"
              ? "bg-[#eb5e28] text-white shadow-lg"
              : "text-[#A0A0A0]   hover:bg-[#eb5e28]/20 hover:text-white"
          }`}
        >
          <HomeIcon size={17} />
          <span className=" text-sm">Home</span>
        </button>

        <button
          onClick={() => {
            setComponent(<Assets />);
            setActiveTab("assets");
          }}
          className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl font-bold transition-all  cursor-pointer ${
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
          <span className=" text-sm">Assets</span>
        </button>

        <button
          onClick={() => {
            setComponent(<Transactions />);
            setActiveTab("transactions");
          }}
          className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === "transactions"
              ? "bg-[#eb5e28] text-white shadow-lg"
              : "text-[#A0A0A0]  hover:bg-[#eb5e28]/20 hover:text-white"
          }`}
        >
          <ArrowDownUp size={16} />
          <span className=" text-sm">Transactions</span>
        </button>
      </div>
    </aside>
  );
}
