"use client";
import { useEffect, useState } from "react";
import { Trash2, UserPlus, Settings, Rocket, Plus, Minus } from "lucide-react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useRouter } from "next/navigation";
import useCreateSmartAccount from "../../blockchain-interaction/hooks/Proxy/useCreateSmartAccount";

type Owner = {
  address: string;
  name: string;
};

export default function CreateSmartAccountPage() {
  const [owners, setOwners] = useState<Owner[]>([]);

  const [newOwner, setNewOwner] = useState("");
  const [threshold, setThreshold] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { createSmartAccount, isReady } = useCreateSmartAccount();

  const router = useRouter();

  const addOwner = () => {
    const trimmed = newOwner.trim();
    if (!trimmed) return;

    if (owners.some((owner) => owner.address === trimmed)) {
      return alert("Owner already added!");
    }

    console.log("trimmed :", trimmed);

    setOwners([...owners, { address: trimmed, name: "optional" }]);
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

  const createNewSmartAccount = async () => {
    if (!isReady) {
      console.log("Waiting for instances to be ready...");
      return;
    }

    try {
      setIsLoading(true);

      const ownerAddresses = owners.map((o) => o.address);

      const newSafeOnChain = await createSmartAccount(
        ownerAddresses,
        threshold
      );

      const response = await fetch("/api/safes/create-safe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          safe: {
            address: newSafeOnChain.address.toLowerCase(),
            name: "Optional",
          },
          owners,
        }),
      });
      const data = await response.json();
      console.log(data);
      router.push("/dashboard");
    } catch (err) {
      console.error("Error creating smart account:", err);
      alert("Failed to create wallet. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center bg-gradient-to-b from-[#1e1e1e] to-[#121212] text-white py-2  sm:py-6">
      <div className="create-smart-account flex flex-col sm:flex-row sm:min-h-80 sm:px-10 gap-4 sm:gap-6 w-full max-w-7xl">
        <div className="flex-[2]  bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col transition-all duration-500">
          <div className="flex items-center  gap-1 sm:gap-2 mb-4">
            <UserPlus className="text-[#eb5e28] h-5 sm:h-8" />
            <h2 className="text-sm sm:text-lg font-semibold">Add Owners</h2>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 text-xs sm:text-sm">
            {owners.length === 0 && (
              <p className="text-white/40">No owners added yet.</p>
            )}
            {owners.map((owner, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white/10 px-4 py-2 rounded-full"
              >
                <p className="truncate text-gray-400">
                  {owner.address.toUpperCase()}
                </p>
                <button
                  onClick={() => removeOwner(index)}
                  className="text-red-400 hover:text-red-500 transition cursor-pointer"
                >
                  <Trash2 className="h-3 sm:h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="truncate flex items-center gap-3 bg-white/10 rounded-full pl-4 mt-4">
            <input
              type="text"
              placeholder="Enter owner address (0x...)"
              value={newOwner}
              onChange={(e) => setNewOwner(e.target.value)}
              className="flex-1 text-xs sm:text-sm bg-transparent outline-none text-white placeholder-white/40 py-1 sm:py-2"
            />
            <button
              onClick={addOwner}
              className="bg-[#eb5e28] hover:bg-[#ff6b36] py-2 px-4 rounded-r-full font-semibold transition cursor-pointer"
            >
              <UserPlus className="cursor-pointer h-4" />
            </button>
          </div>
        </div>

        <div className="group flex-1 hover:flex-[1.5] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col items-center transition-all duration-500 overflow-hidden">
          <div className="flex items-center gap-2 mb">
            <Settings className="text-[#eb5e28]  h-8 " />
            <h2 className="text-sm sm:text-lg  font-semibold">Set Threshold</h2>
          </div>

          <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center w-full">
            <div className="flex items-center gap-4 justify-center my-4 text-sm sm:text-base">
              <button
                onClick={decreaseThreshold}
                className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition cursor-pointer"
              >
                <Minus className="cursor-pointer" />
              </button>
              <span className="text-xl sm:text-2xl font-bold">{threshold}</span>
              <button
                onClick={increaseThreshold}
                className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition cursor-pointer"
              >
                <Plus className="cursor-pointer" />
              </button>
            </div>
            <p className="text-[10px] sm:text-xs text-white/60">
              {threshold} of {owners.length || 1} owners required.
            </p>
          </div>
        </div>

        <div className="group flex-1 hover:flex-[1.5] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col items-center text-center transition-all duration-500 overflow-hidden">
          <div className="flex flex-row items-center justify-center gap-2">
            <Rocket className="text-[#eb5e28] h-8" />
            <h2 className="text-sm sm:text-lg font-semibold mb-2">
              Deploy Wallet
            </h2>
          </div>

          <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 text-xs sm:text-sm">
            <p className="text-white/60 mb-6">
              Review and confirm your setup before deploying.
            </p>

            <div className="hidden sm:flex flex-col  items-start text-white/60 py-4 text-xs sm:text-sm">
              <p>Owner : {owners.length}</p>
              <p>Threshold : {threshold}</p>
            </div>

            <button
              onClick={createNewSmartAccount}
              disabled={isLoading}
              className={`w-full py-3 rounded-full font-semibold text-xs sm:text-sm shadow-lg transition-all cursor-pointer ${
                isLoading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-[#eb5e28] hover:bg-[#ff6b36] text-white hover:scale-105"
              }`}
            >
              {isLoading ? "Deploying Wallet..." : "Deploy Wallet"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
