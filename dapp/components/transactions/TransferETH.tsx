"use client";

import React, {
  useState,
  SetStateAction,
  Dispatch,
  ChangeEvent,
  useEffect,
} from "react";

type FormProps = {
  setForm: Dispatch<
    SetStateAction<{
      eth_recipient?: string;
      eth_amount?: string;
      operation_description?: string;
    }>
  >;
};

export default function TransferETH({ setForm }: FormProps) {
  const [data, setData] = useState<{
    eth_recipient: string;
    eth_amount: string;
    operation_description: string;
  }>({
    eth_recipient: "",
    eth_amount: "",
    operation_description: "",
  });

  useEffect(() => {
    setForm(data);
  }, [data, setForm]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col space-y-1">
        <label className="text-gray-400 text-sm font-medium">
          Recipient Address
        </label>
        <input
          type="text"
          name="recipient"
          placeholder="0x..."
          value={data.eth_recipient}
          onChange={(e) => setData({ ...data, eth_recipient: e.target.value })}
          className="border-b border-[#333333] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#eb5e28] transition-colors"
        />
      </div>

      <div className="flex flex-col space-y-1">
        <label className="text-gray-400 text-sm font-medium">
          Amount (ETH)
        </label>
        <input
          type="number"
          name="amount"
          placeholder="0.01"
          value={data.eth_amount}
          onChange={(e) => setData({ ...data, eth_amount: e.target.value })}
          className="border-b border-[#333333] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#eb5e28] transition-colors"
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
