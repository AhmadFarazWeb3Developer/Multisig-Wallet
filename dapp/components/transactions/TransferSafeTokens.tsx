"use client";

import React, { useState, Dispatch, SetStateAction, useEffect } from "react";

type FormProps = {
  setForm: Dispatch<
    SetStateAction<{
      token_amount?: string;
      token_recipient?: string;
      operation_description?: string;
    }>
  >;
};

export default function TransferSafeTokens({ setForm }: FormProps) {
  const [data, setData] = useState({
    token_amount: "",
    token_recipient: "",
    operation_description: "",
  });

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
          value={data.token_recipient}
          onChange={(e) =>
            setData({ ...data, token_recipient: e.target.value })
          }
          className="bg-[#1a1a1a] border-b border-[#333333]  px-3 py-2 text-white text-sm focus:outline-none focus:border-[#eb5e28] transition"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-gray-400 text-sm">Amount (Safw Tokens)</label>
        <input
          type="number"
          placeholder="10 Safes"
          value={data.token_amount}
          onChange={(e) => setData({ ...data, token_amount: e.target.value })}
          className="bg-[#1a1a1a] border-b border-[#333333] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#eb5e28] transition"
        />
      </div>
      <div className="flex flex-col space-y-1">
        <label className="text-gray-400 text-sm ">Description</label>
        <textarea
          name="description"
          placeholder="Add a description or memo..."
          value={data.operation_description}
          onChange={(e) =>
            setData({ ...data, operation_description: e.target.value })
          }
          className="border-b border-[#333333] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#eb5e28] transition-colors"
          rows={2}
        />
      </div>
    </div>
  );
}
