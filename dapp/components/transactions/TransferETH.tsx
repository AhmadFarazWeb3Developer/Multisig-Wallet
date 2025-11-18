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
      recipient?: string;
      amount?: string;
      description?: string;
    }>
  >;
};

export default function TransferETH({ setForm }: FormProps) {
  const [data, setData] = useState<{
    recipient: string;
    amount: string;
    description: string;
  }>({
    recipient: "",
    amount: "",
    description: "",
  });

  useEffect(() => {
    setForm(data);
  }, [data, setForm]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

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
          value={data.recipient}
          onChange={handleChange}
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
          value={data.amount}
          onChange={handleChange}
          className="border-b border-[#333333] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#eb5e28] transition-colors"
        />
      </div>

      <div className="flex flex-col space-y-1">
        <label className="text-gray-400 text-sm font-medium">
          Description (Optional)
        </label>
        <textarea
          name="description"
          placeholder="Add a description or memo..."
          value={data.description}
          onChange={handleChange}
          className="border-b border-[#333333] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#eb5e28] transition-colors"
          rows={2}
        />
      </div>
    </div>
  );
}
