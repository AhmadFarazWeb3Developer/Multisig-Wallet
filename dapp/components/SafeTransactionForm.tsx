"use client";

import React, { useEffect, useState } from "react";
import CustomSelect from "./CustomSelect";
import TransferETH from "./transactions/TransferETH";
import TransferSafeTokens from "./transactions/TransferSafeTokens";
import ChangeThreshold from "./transactions/ChangeThreshold";
import SetGuard from "./transactions/SetGuard";
import AddOwnerWithThreshold from "./transactions/AddOwnerWithThreshold";
import RemoveOwner from "./transactions/RemoveOwner";
import SwapOwner from "./transactions/SwapOwner";
import useTransferETH from "../blockchain-interaction/hooks/smartAccount/useTransferETH";
import { toast } from "sonner";

type safeAddressInterface = {
  safeAddress: string;
};

type FormData = {
  [key: string]: any;
};

export default function SafeTransactionForm({
  safeAddress,
}: safeAddressInterface) {
  const [operation, setOperation] = useState("");
  const [formData, setForm] = useState<FormData>({});

  const transferETH = useTransferETH(safeAddress);

  const handleSubmit = async () => {
    if (operation === "Transfer ETH") {
      if (!formData.recipient || !formData.amount) {
        toast.error("Fill the form before proceeding");
        return;
      }
      await transferETH(formData);
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center py-4 font-unbounded">
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-light text-white tracking-tight">
            Safe Transaction
          </h1>
          <div className="h-px w-20 bg-[#eb5e28] mt-2"></div>
        </div>

        <div className="space-y-5">
          <div className=" mb-10">
            <label className=" cursor-pointer block text-xs text-white/40 mb-2 uppercase tracking-widest">
              Operation
            </label>

            <CustomSelect setOperation={setOperation} />
          </div>
          {operation === "Transfer ETH" && <TransferETH setForm={setForm} />}
          {operation === "Transfer Safe Token" && (
            <TransferSafeTokens setForm={setForm} />
          )}
          {operation === "Add Owner with Threshold" && (
            <AddOwnerWithThreshold setForm={setForm} />
          )}

          {operation === "Remove Owner" && <RemoveOwner setForm={setForm} />}
          {operation === "Set Guard" && <SetGuard setForm={setForm} />}
          {operation === "Change Threshold" && (
            <ChangeThreshold setForm={setForm} />
          )}
          {operation === "Swap Owner" && <SwapOwner setForm={setForm} />}

          <div className="pt-4">
            <button
              onClick={handleSubmit}
              className="w-full bg-[#eb5e28] text-white  text-xs py-3 sm:py-4 sm:text-sm font-medium uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 cursor-pointer rounded-sm"
            >
              Queue Transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
