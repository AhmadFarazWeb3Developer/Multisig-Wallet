"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

type FormProps = {
  setForm: Dispatch<
    SetStateAction<{
      prevOwner?: string;
      oldOwner?: string;
      newOwner?: string;
    }>
  >;
};

export default function SwapOwner({ setForm }: FormProps) {
  const [data, setData] = useState({
    prevOwner: "",
    oldOwner: "",
    newOwner: "",
  });

  useEffect(() => {
    setForm(data);
  }, [data, setForm]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="text-gray-400 text-sm">Previous Owner Address</label>
        <input
          value={data.prevOwner}
          onChange={(e) => setData({ ...data, prevOwner: e.target.value })}
          type="text"
          placeholder="0x..."
          className="bg-[#1a1a1a] border-b border-[#333333] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#eb5e28] transition"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-gray-400 text-sm">Old Owner Address</label>
        <input
          value={data.oldOwner}
          onChange={(e) => setData({ ...data, oldOwner: e.target.value })}
          type="text"
          placeholder="0x..."
          className="bg-[#1a1a1a] border-b border-[#333333] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#eb5e28] transition"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-gray-400 text-sm">New Owner Address</label>
        <input
          value={data.newOwner}
          onChange={(e) => setData({ ...data, newOwner: e.target.value })}
          type="text"
          placeholder="0x..."
          className="bg-[#1a1a1a] border-b border-[#333333] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#eb5e28] transition"
        />
      </div>
    </div>
  );
}
