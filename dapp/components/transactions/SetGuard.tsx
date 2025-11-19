"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Send } from "lucide-react";

type FormProps = {
  setForm: Dispatch<
    SetStateAction<{ guardAddress?: string; operation_description?: string }>
  >;
};

export default function SetGuard({ setForm }: FormProps) {
  const [data, setData] = useState({
    guardAddress: "",
    operation_description: "",
  });
  useEffect(() => {
    setForm(data);
  }, [data, setForm]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="text-gray-400 text-sm">Guard Address</label>
        <input
          value={data.guardAddress}
          onChange={(e) => setData({ ...data, guardAddress: e.target.value })}
          type="text"
          placeholder="0x..."
          className="bg-[#1a1a1a] border-b border-[#333333]  px-3 py-2 text-white text-sm focus:outline-none focus:border-[#eb5e28] transition"
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
