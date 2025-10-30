"use client";

import { useEffect, useState } from "react";
import { Trash2, UserPlus, Settings, Rocket, Plus, Minus } from "lucide-react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useRouter } from "next/navigation";

import useCreateSmartAccount from "../../blockchain-interaction/hooks/Proxy/useCreateSmartAccount";
import { promises } from "dns";

export default function CreateSmartAccountPage() {
  const { address, isConnected } = useAppKitAccount();
  const [owners, setOwners] = useState<string[]>([]);
  const [newOwner, setNewOwner] = useState("");
  const [threshold, setThreshold] = useState(0);
  const { createSmartAccount } = useCreateSmartAccount();

  const router = useRouter();

  const addOwner = () => {
    if (!newOwner.trim()) return;
    if (owners.includes(newOwner.trim())) return alert("Owner already added!");
    setOwners([...owners, newOwner.trim()]);
    setNewOwner("");
  };

  const removeOwner = (index: number) => {
    setOwners(owners.filter((_, i) => i !== index));
  };

  const increaseThreshold = () => {
    if (threshold < owners.length) setThreshold(threshold + 1);
  };

  const decreaseThreshold = () => {
    if (threshold > 1) setThreshold(threshold - 1);
  };

  useEffect(() => {
    const init = async () => {
      await createSmartAccount(
        [
          "0x2546bcd3c84621e976d8185a91a922ae77ecec30",
          "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",
          "0xf39fd6e51aad18f6f4ce6ab8827279cfffb92266",
        ],
        2
      );
    };
    init();
  });

  return (
    <main className="flex items-center justify-center  min-h-[80vh] bg-gradient-to-b from-[#1e1e1e] to-[#121212] text-white px-6 py-12">
      <div className="create-smart-account flex gap-6 w-full max-w-7xl">
        <div className="flex-[2] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col transition-all duration-500">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="text-[#eb5e28]" />
            <h2 className="text-xl font-semibold">Add Owners</h2>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
            {owners.length === 0 && (
              <p className="text-white/40 text-sm">No owners added yet.</p>
            )}
            {owners.map((owner, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white/10 px-4 py-2 rounded-full"
              >
                <p className="truncate text-sm text-gray-400">
                  {owner.toUpperCase()}
                </p>
                <button
                  onClick={() => removeOwner(index)}
                  className="text-red-400 hover:text-red-500 transition cursor-pointer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className=" truncate flex items-center gap-3 bg-white/10 rounded-full pl-4 mt-4">
            <input
              type="text"
              placeholder="Enter owner address (0x...)"
              value={newOwner}
              onChange={(e) => setNewOwner(e.target.value)}
              className="flex-1 bg-transparent outline-none text-white placeholder-white/40 py-2"
            />
            <button
              onClick={addOwner}
              className="bg-[#eb5e28] hover:bg-[#ff6b36] py-2 px-4 rounded-r-full font-semibold transition cursor-pointer"
            >
              <UserPlus className="cursor-pointer" />
            </button>
          </div>
        </div>

        <div className="group flex-1 hover:flex-[1.5] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col  items-center transition-all duration-500 overflow-hidden">
          <div className="flex items-center gap-2 mb">
            <Settings className="text-[#eb5e28]" />
            <h2 className="text-xl font-semibold">Set Threshold</h2>
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center w-full">
            <div className="flex items-center gap-4 justify-center my-4">
              <button
                onClick={decreaseThreshold}
                className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition cursor-pointer"
              >
                <Minus className=" cursor-pointer" />
              </button>
              <span className="text-2xl font-bold">{threshold}</span>
              <button
                onClick={increaseThreshold}
                className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition cursor-pointer"
              >
                <Plus className=" cursor-pointer" />
              </button>
            </div>
            <p className="text-sm text-white/60">
              {threshold} of {owners.length || 1} owners required.
            </p>
          </div>
        </div>

        <div className="group flex-1 hover:flex-[1.5] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col items-center  text-center transition-all duration-500 overflow-hidden">
          <div className=" flex flex-row items-center justify-center  gap-2">
            <Rocket className="text-[#eb5e28] " />
            <h2 className="text-xl font-semibold mb-2">Deploy Wallet</h2>
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-white/60 mb-6">
              Review and confirm your setup before deploying.
            </p>

            <div className="flex flex-col items-start text-white/60 py-4">
              <p>Owner : {owners.length}</p>
              <p>Threshold : {threshold}</p>
            </div>

            <button
              onClick={() => router.push("/dashboard")}
              className="w-full py-3 rounded-full bg-[#eb5e28] hover:bg-[#ff6b36] text-white font-semibold text-lg shadow-lg hover:scale-105 transition-all cursor-pointer"
            >
              Deploy Wallet
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
