"use client";

import React, { useState, Dispatch, SetStateAction, useEffect } from "react";
import { Send } from "lucide-react";

type FormProps = {
  setForm: Dispatch<SetStateAction<{ recipient?: string; amount?: string }>>;
};

export default function TransferSafeTokens({ setForm }: FormProps) {
  const [data, setData] = useState({ recipient: "", amount: "" });

  useEffect(() => {
    setForm(data);
  }, [data, setForm]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="text-gray-400 text-sm">Recipient Address</label>
        <input
          type="text"
          placeholder="0x..."
          value={data.recipient}
          onChange={(e) => setData({ ...data, recipient: e.target.value })}
          className="bg-[#1a1a1a] border-b border-[#333333]  px-3 py-2 text-white text-sm focus:outline-none focus:border-[#eb5e28] transition"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-gray-400 text-sm">Amount (Safw Tokens)</label>
        <input
          type="number"
          placeholder="10 Safes"
          value={data.amount}
          onChange={(e) => setData({ ...data, amount: e.target.value })}
          className="bg-[#1a1a1a] border-b border-[#333333] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#eb5e28] transition"
        />
      </div>
    </div>
  );
}
