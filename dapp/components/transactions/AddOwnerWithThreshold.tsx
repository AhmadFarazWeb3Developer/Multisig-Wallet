"use client";

import React, { useState, useEffect, Dispatch, SetStateAction } from "react";

type FormProps = {
  setForm: Dispatch<SetStateAction<{ newOwner: string; newThreshold: number }>>;
};

export default function AddOwnerWithThreshold({ setForm }: FormProps) {
  const [data, setData] = useState<{ newOwner: string; newThreshold: number }>({
    newOwner: "",
    newThreshold: 1,
  });

  useEffect(() => {
    setForm(data);
  }, [data, setForm]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="text-gray-400 text-sm">New Owner Address</label>
        <input
          type="text"
          placeholder="0x..."
          value={data.newOwner}
          onChange={(e) => setData({ ...data, newOwner: e.target.value })}
          className="bg-[#1a1a1a] border-b border-[#333333] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#eb5e28] transition"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-gray-400 text-sm">Threshold</label>
        <input
          type="number"
          min={1}
          step={1}
          placeholder="1"
          value={data.newThreshold}
          onChange={(e) =>
            setData({ ...data, newThreshold: Number(e.target.value) })
          }
          className="bg-[#1a1a1a] border-b border-[#333333] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#eb5e28] transition"
        />
      </div>
    </div>
  );
}
